# Tenstorrent tt-metal vLLM統合調査

このディレクトリには、Tenstorrent tt-metalプロジェクトにおけるvLLM統合の調査レポートが含まれています。

## 📋 調査の目的

1. **Tenstorrent製品でvLLMを稼働できるか？**
2. **外部（Claude Code等）から呼び出せるか？**

## 📚 レポート一覧

### メインレポート

- **[TENSTORRENT_VLLM_REPORT.md](./TENSTORRENT_VLLM_REPORT.md)** - 完全版調査レポート（日本語）
  - エグゼクティブサマリー
  - アーキテクチャ詳細
  - サポート状況
  - セットアップ手順
  - サンプルコード集
  - トラブルシューティング

- **[TENSTORRENT_VLLM_REPORT_EN.md](./TENSTORRENT_VLLM_REPORT_EN.md)** - Summary Report (English)
  - Executive summary
  - Integration architecture
  - Support matrix
  - Setup instructions

- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - クイックリファレンス
  - 即座に始められるガイド
  - コード例
  - トラブルシューティング

## 🎯 主な結論

### ✅ vLLMはTenstorrent製品で稼働可能

- Tenstorrent公式のvLLMフォークとプラグインが提供されている
- 主要なLLMモデル（Llama、Mistral、Qwen等）をサポート
- n150からGalaxyまで、幅広いハードウェアに対応

### ✅ 外部からの呼び出しが可能

- OpenAI互換のREST APIエンドポイントを提供
- Claude Code等の外部クライアントから標準的なHTTPリクエストで呼び出し可能
- マイクロサービスアーキテクチャやエージェントワークフローへの統合が容易

## 🚀 クイックスタート

### Dockerを使用（最速）

```bash
docker pull ghcr.io/tenstorrent/tt-metal/tt-metalium-ubuntu-20.04-amd64-release:latest-rc
docker run -it --rm -p 8000:8000 --device /dev/tenstorrent \
  ghcr.io/tenstorrent/tt-metal/tt-metalium-ubuntu-20.04-amd64-release:latest-rc
```

### 外部から呼び出し（Python）

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://your-tenstorrent-server:8000/v1",
    api_key="dummy"
)

response = client.chat.completions.create(
    model="meta-llama/Llama-3.2-1B-Instruct",
    messages=[{"role": "user", "content": "Hello!"}]
)

print(response.choices[0].message.content)
```

## 📊 アーキテクチャ概要

```
外部クライアント (Claude Code等)
        ↓ HTTP/REST
vLLM Server (OpenAI互換API)
        ↓
TT-Transformers (最適化モデル)
        ↓
TT-Metal Runtime
        ↓
Tenstorrentハードウェア (n150/n300/T3K/Galaxy)
```

## 🔗 参考リソース

- **TT-Metal GitHubリポジトリ**: https://github.com/tenstorrent/tt-metal
- **vLLM統合フォーク**: https://github.com/tenstorrent/vllm
- **tt-inference-server**: https://github.com/tenstorrent/tt-inference-server
- **公式ドキュメント**: https://docs.tenstorrent.com/
- **開発者ポータル**: https://tenstorrent.com/en/developers/

## 📝 調査実施日

2026年2月13日

## 👤 調査担当

GitHub Copilot

---

詳細については、各レポートをご参照ください。
