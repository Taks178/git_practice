# 01. Git基本操作練習 / Basic Git Operations Practice

この章では、Gitの最も基本的な操作について学習します。

## 🎯 学習目標 / Learning Goals

- リポジトリの初期化ができる
- ファイルのステージング・コミットができる
- 変更履歴を確認できる
- 状態を確認できる

## 📝 練習課題 / Practice Exercises

### 課題1: 新しいリポジトリを作成する

1. 新しいディレクトリを作成
   ```bash
   mkdir my-first-repo
   cd my-first-repo
   ```

2. Gitリポジトリとして初期化
   ```bash
   git init
   ```

3. 状態を確認
   ```bash
   git status
   ```

### 課題2: 初回コミット

1. README.mdファイルを作成
   ```bash
   echo "# My First Repository" > README.md
   ```

2. ファイルをステージング
   ```bash
   git add README.md
   ```

3. 状態を確認
   ```bash
   git status
   ```

4. コミット
   ```bash
   git commit -m "Initial commit: Add README.md"
   ```

### 課題3: 複数のファイルを扱う

1. 複数のファイルを作成
   ```bash
   echo "console.log('Hello, World!');" > hello.js
   echo "body { margin: 0; }" > style.css
   ```

2. 一度にすべてステージング
   ```bash
   git add .
   ```

3. コミット
   ```bash
   git commit -m "Add JavaScript and CSS files"
   ```

### 課題4: ファイルの変更と部分的ステージング

1. README.mdを編集
   ```bash
   echo -e "\n## About\nThis is a practice repository." >> README.md
   ```

2. hello.jsも編集
   ```bash
   echo "console.log('Goodbye!');" >> hello.js
   ```

3. README.mdのみをステージング
   ```bash
   git add README.md
   ```

4. 状態を確認（一部がステージング、一部が未ステージング）
   ```bash
   git status
   ```

5. ステージングされた変更のみコミット
   ```bash
   git commit -m "Update README with description"
   ```

6. 残りの変更もコミット
   ```bash
   git add hello.js
   git commit -m "Add goodbye message to hello.js"
   ```

### 課題5: 履歴の確認

1. コミット履歴を確認
   ```bash
   git log
   ```

2. 一行で表示
   ```bash
   git log --oneline
   ```

3. グラフ表示
   ```bash
   git log --oneline --graph
   ```

4. 特定のファイルの履歴
   ```bash
   git log README.md
   ```

### 課題6: 差分の確認

1. ファイルを編集
   ```bash
   echo "/* Additional styles */" >> style.css
   ```

2. 現在の差分を確認
   ```bash
   git diff
   ```

3. ファイルをステージング
   ```bash
   git add style.css
   ```

4. ステージングされた差分を確認
   ```bash
   git diff --staged
   ```

5. コミット
   ```bash
   git commit -m "Add comment to CSS file"
   ```

## ✅ チェックポイント / Checkpoint

以下のコマンドがエラーなく実行できれば、基本操作をマスターしています：

```bash
git status
git log --oneline
git diff HEAD~1
```

## 🚀 次のステップ / Next Steps

基本操作ができるようになったら、[02_branching](../02_branching/README.md)でブランチ操作を学習しましょう。