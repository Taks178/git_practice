# Tenstorrent tt-metal vLLM統合調査レポート

**調査日**: 2026年2月13日  
**対象リポジトリ**: https://github.com/tenstorrent/tt-metal  
**調査目的**: Tenstorrent製品でvLLMを稼働できるか、および外部（Claude Code等）から呼び出せるかの検証

---

## エグゼクティブサマリー

本調査により、以下の結論に至りました：

✅ **結論1: vLLMはTenstorrent製品上で稼働可能**  
Tenstorrentは専用のvLLMフォークとプラグインを提供しており、Tenstorrent製ハードウェア上で高スループットのLLM推論が実現可能です。

✅ **結論2: 外部からの呼び出しが可能**  
vLLMサーバーはOpenAI互換のREST APIエンドポイントを提供しており、Claude Codeを含む任意の外部クライアントから標準的なHTTPリクエストで呼び出せます。

---

## 1. vLLM on Tenstorrent: 統合アーキテクチャ

### 1.1 アーキテクチャ概要

Tenstorrent上でのvLLM動作は、以下の階層構造で実現されています：

```
┌─────────────────────────────────────┐
│  クライアントアプリケーション         │
│  (Claude Code、カスタムアプリ等)      │
└────────────┬────────────────────────┘
             │ HTTP (OpenAI互換API)
             ▼
┌─────────────────────────────────────┐
│  vLLM Server (Tenstorrentフォーク)   │
│  - /v1/completions                  │
│  - /v1/chat/completions             │
│  - /v1/embeddings                   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  TT-Transformers                    │
│  (Tenstorrent最適化モデル実装)       │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  TT-Metal Runtime                   │
│  (デバイスドライバ、コアランタイム)   │
└─────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Tenstorrentハードウェア             │
│  (n150, n300, T3K, Galaxy等)        │
└─────────────────────────────────────┘
```

### 1.2 統合メカニズム

**vLLMプラグインシステム** (`tt-vllm-plugin`):
- Pythonエントリーポイント経由で`TTPlatform`クラスを登録
- vLLMコアから推論タスクをTenstorrentハードウェアルーチンへ委譲
- カスタムランナー（テキスト生成、埋め込み）、アテンションバックエンド、メモリ管理（KVキャッシュ）を提供

**モデルマッピング**:
- Hugging Faceのモデルアーキテクチャ（Llama、Mistral、Qwen等）をサーバー起動時にTenstorrent最適化実装にマッピング
- vLLMモデルレジストリへのTenstorrentモデル登録により、クライアントアプリケーションからの透過的な呼び出しを実現

---

## 2. サポート状況

### 2.1 対応LLMモデル

以下の主要モデルファミリーをサポート：

| モデルファミリー | 例 | 備考 |
|---------------|-----|------|
| Llama | Llama 3.2 1B/3B, Llama 3.3 70B | マルチモーダル対応（Vision）含む |
| Qwen | Qwen 1.5/2.5/3シリーズ | 各種サイズバリエーション |
| Mistral | Mistral 7B, Mixtral 8x7B | MoEアーキテクチャ対応 |
| Gemma | Gemma 2B/7B | Google製モデル |
| DeepSeek | DeepSeekシリーズ | 最新の高効率モデル |

### 2.2 対応ハードウェア

| デバイス | 適用モデルサイズ | 備考 |
|---------|----------------|------|
| n150 | 小型モデル（1B-3B） | エントリーレベル |
| n300 | 中型モデル（7B-13B） | 標準的な推論用途 |
| T3K | 大型モデル（70B+） | エンタープライズ向け |
| Galaxy | 超大型モデル | マルチカード構成 |
| QuietBox / LoudBox | 統合システム | オールインワンボックス |

**動的ルーティング**: 実行時にモデルサイズを検出し、適切なハードウェアへ自動ルーティング

---

## 3. 外部からの呼び出し方法

### 3.1 OpenAI互換API

vLLM-TT-Metalサーバーは、OpenAI APIと完全互換のエンドポイントを提供します：

#### エンドポイント一覧

```
POST /v1/completions          # テキスト補完
POST /v1/chat/completions     # チャット形式の対話
POST /v1/embeddings           # 埋め込みベクトル生成
```

### 3.2 Claude Codeからの呼び出し

Claude Code（およびその他の外部クライアント）から、標準的なHTTPリクエストで呼び出し可能です。

#### 例: Pythonクライアント

```python
import requests

# vLLM-TT-Metalサーバーのエンドポイント
VLLM_ENDPOINT = "http://your-tenstorrent-server:8000"

# チャット補完リクエスト（OpenAI互換）
response = requests.post(
    f"{VLLM_ENDPOINT}/v1/chat/completions",
    json={
        "model": "meta-llama/Llama-3.2-1B-Instruct",
        "messages": [
            {"role": "user", "content": "Hello, how are you?"}
        ],
        "temperature": 0.7,
        "max_tokens": 100
    },
    headers={"Content-Type": "application/json"}
)

result = response.json()
print(result["choices"][0]["message"]["content"])
```

#### 例: curlコマンド

```bash
curl -X POST http://your-tenstorrent-server:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "meta-llama/Llama-3.2-1B-Instruct",
    "messages": [{"role": "user", "content": "Hello!"}],
    "temperature": 0.7
  }'
```

#### 例: OpenAI Python SDKの利用

OpenAI互換APIのため、OpenAI SDKをそのまま使用可能：

```python
from openai import OpenAI

# Tenstorrentサーバーを指定
client = OpenAI(
    base_url="http://your-tenstorrent-server:8000/v1",
    api_key="not-needed"  # 認証不要の場合
)

# 通常のOpenAI APIと同じインターフェース
response = client.chat.completions.create(
    model="meta-llama/Llama-3.2-1B-Instruct",
    messages=[
        {"role": "user", "content": "Explain quantum computing"}
    ]
)

print(response.choices[0].message.content)
```

### 3.3 Claude Codeとの統合シナリオ

Claude Codeから以下のような統合が可能です：

1. **直接API呼び出し**: Claude Codeの機能拡張やプラグインから、HTTP経由でvLLM-TT-Metalサーバーへリクエスト
2. **マイクロサービスアーキテクチャ**: Claude Codeをフロントエンド、Tenstorrent vLLMをバックエンドLLM推論エンジンとして構成
3. **エージェントワークフロー**: 複数のLLMエージェントを組み合わせ、特定タスクをTenstorrentハードウェアで実行

---

## 4. セットアップ手順

### 4.1 必要なリポジトリ

```bash
# 1. TT-Metalのクローン
git clone https://github.com/tenstorrent/tt-metal.git --recurse-submodules
cd tt-metal

# 2. 依存関係のインストール
./install_dependencies.sh

# 3. ビルドと仮想環境作成
./build_metal.sh && ./create_venv.sh
source python_env/bin/activate

# 4. vLLMプラグインのインストール
git clone https://github.com/tenstorrent/tt-inference-server.git
cd tt-inference-server/tt-vllm-plugin
pip install -e .

# 5. 環境変数設定
export VLLM_USE_V1=1
```

### 4.2 Dockerを使用した簡単セットアップ

```bash
# 事前ビルド済みイメージの取得
docker pull ghcr.io/tenstorrent/tt-metal/tt-metalium-ubuntu-20.04-amd64-release:latest-rc

# コンテナ起動
docker run -it --rm \
  -v /dev/hugepages-1G:/dev/hugepages-1G \
  --device /dev/tenstorrent \
  -p 8000:8000 \
  ghcr.io/tenstorrent/tt-metal/tt-metalium-ubuntu-20.04-amd64-release:latest-rc bash
```

### 4.3 サーバー起動

```bash
# 基本的な起動コマンド
python3 run.py \
  --model Llama-3.2-1B-Instruct \
  --device n300 \
  --workflow server \
  --docker-server

# または簡易スクリプト
./serve.sh
```

サーバー起動後、`http://localhost:8000`でAPIエンドポイントが利用可能になります。

---

## 5. 技術的特徴

### 5.1 パフォーマンス最適化

- **連続バッチング**: vLLMの動的バッチスケジューリング機能をTT-Metalバックエンドで維持
- **高スループット**: Tenstorrentハードウェアの専用アクセラレーションを活用
- **メモリ効率**: カスタムKVキャッシュ管理によるメモリ使用量の最適化

### 5.2 互換性

- **OpenAI互換API**: 既存のLLMワークフローとの最大限の互換性
- **標準ツールチェーン**: 既存の開発ツール、モニタリングツールをそのまま利用可能
- **マルチモーダル対応**: テキストのみならず、ビジョンモデルもサポート

### 5.3 開発とデバッグ

Tenstorrentは以下のツール群を提供：

- **TT-SMI**: システム管理インターフェース
- **TT-NN Visualizer**: ニューラルネットワーク可視化
- **Model Explorer**: モデル構造解析
- **デバッグツール**: カーネルレベルのデバッグとプロファイリング

---

## 6. 制限事項と考慮事項

### 6.1 ハードウェア要件

- Tenstorrentハードウェア（n150/n300/T3K/Galaxy等）が必要
- 適切なCPUガバナー設定、hugepages設定が必要（パフォーマンス最適化のため）
- マルチカード構成の場合、メッシュトポロジー設定が必要

### 6.2 ソフトウェア環境

- Ubuntu 20.04以降（推奨）
- Python 3.8以上
- TT-Metalスタック全体のインストールが必要

### 6.3 開発状況

- **積極的に開発中**: TT-MetalとvLLMフォークは同期的にアップデート
- **モデルサポート拡大中**: 継続的に新しいモデルとデバイスのサポートが追加
- **コミュニティサポート**: GitHubイシュー、ディスカッションで活発なコミュニティ

---

## 7. まとめ

### 7.1 調査目的への回答

**Q1: Tenstorrent製品でvLLMを稼働できるか？**

✅ **回答**: はい、可能です。

- Tenstorrent公式のvLLMフォークとプラグインが提供されている
- 主要なLLMモデル（Llama、Mistral、Qwen等）をサポート
- n150からGalaxyまで、幅広いハードウェアラインナップに対応
- Dockerイメージと自動化スクリプトにより、セットアップが簡素化されている

**Q2: 外部（Claude Code）から呼び出せるか？**

✅ **回答**: はい、可能です。

- OpenAI互換のREST APIエンドポイントを提供
- 標準的なHTTPクライアント（Python requests、curl、OpenAI SDK等）で呼び出し可能
- 認証やカスタムヘッダーの設定にも対応
- マイクロサービスアーキテクチャやエージェントワークフローへの統合が容易

### 7.2 推奨される次のステップ

1. **PoC環境の構築**: 最小構成（n150 + 小型モデル）でテスト環境を構築
2. **ベンチマーク実施**: 実際のワークロードでのスループット、レイテンシを測定
3. **統合テスト**: Claude Code等の外部システムとの統合テストを実施
4. **本番環境設計**: 冗長性、スケーラビリティ、監視を含む本番環境の設計

### 7.3 参考リソース

- **TT-Metal GitHubリポジトリ**: https://github.com/tenstorrent/tt-metal
- **vLLM統合フォーク**: https://github.com/tenstorrent/vllm
- **tt-inference-server**: https://github.com/tenstorrent/tt-inference-server
- **公式ドキュメント**: https://docs.tenstorrent.com/
- **開発者ポータル**: https://tenstorrent.com/en/developers/

---

## 付録A: サンプルコード集

### A.1 基本的なチャットボット

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://tenstorrent-server:8000/v1",
    api_key="dummy"
)

def chat(user_message):
    response = client.chat.completions.create(
        model="meta-llama/Llama-3.2-1B-Instruct",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": user_message}
        ],
        temperature=0.7,
        max_tokens=200
    )
    return response.choices[0].message.content

# 使用例
print(chat("What is machine learning?"))
```

### A.2 ストリーミングレスポンス

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://tenstorrent-server:8000/v1",
    api_key="dummy"
)

def chat_stream(user_message):
    stream = client.chat.completions.create(
        model="meta-llama/Llama-3.2-1B-Instruct",
        messages=[{"role": "user", "content": user_message}],
        stream=True
    )
    
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end='', flush=True)
    print()

# 使用例
chat_stream("Write a short poem about AI")
```

### A.3 埋め込みベクトル生成

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://tenstorrent-server:8000/v1",
    api_key="dummy"
)

def get_embedding(text):
    response = client.embeddings.create(
        model="your-embedding-model",
        input=text
    )
    return response.data[0].embedding

# 使用例
embedding = get_embedding("Sample text for embedding")
print(f"Embedding dimension: {len(embedding)}")
```

---

## 付録B: トラブルシューティング

### B.1 よくある問題と解決策

| 問題 | 原因 | 解決策 |
|-----|------|-------|
| デバイスが認識されない | ドライバ未インストール | `/dev/tenstorrent`の権限確認、ドライバ再インストール |
| OOMエラー | メモリ不足 | 小さいモデルを使用、バッチサイズ削減 |
| 低スループット | CPU設定 | CPUガバナーをperformanceに設定、hugepages有効化 |
| APIエラー500 | モデル未対応 | サポートされているモデルリストを確認 |

### B.2 ログとデバッグ

```bash
# ログレベルの設定
export TT_METAL_LOGGER_LEVEL=DEBUG

# vLLMデバッグモード
VLLM_LOGGING_LEVEL=DEBUG python3 run.py ...

# システム情報確認
tt-smi

# デバイス情報
python3 -c "import ttnn; print(ttnn.get_device_compute_with_storage_grid_size())"
```

---

**調査担当者**: GitHub Copilot  
**最終更新**: 2026年2月13日
