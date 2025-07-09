# 02. ブランチ操作練習 / Branching Practice

この章では、Gitのブランチ機能について学習します。

## 🎯 学習目標 / Learning Goals

- ブランチの作成・切り替えができる
- ブランチ間での作業を理解できる
- マージの基本を理解できる
- ブランチ戦略を理解できる

## 📝 練習課題 / Practice Exercises

### 準備: 練習用リポジトリをセットアップ

```bash
cd sample_files
git status  # 現在のブランチを確認
```

### 課題1: ブランチの基本操作

1. 現在のブランチを確認
   ```bash
   git branch
   ```

2. 新しいブランチを作成
   ```bash
   git branch feature/new-page
   ```

3. ブランチ一覧を確認
   ```bash
   git branch
   ```

4. 新しいブランチに切り替え
   ```bash
   git checkout feature/new-page
   # または新しい方法
   git switch feature/new-page
   ```

5. 現在のブランチを確認
   ```bash
   git branch
   ```

### 課題2: ブランチでの開発

1. 新しいファイルを作成
   ```bash
   echo "<!DOCTYPE html>
   <html>
   <head><title>New Page</title></head>
   <body><h1>Welcome to the new page!</h1></body>
   </html>" > new-page.html
   ```

2. ファイルをコミット
   ```bash
   git add new-page.html
   git commit -m "Add new-page.html"
   ```

3. ログを確認
   ```bash
   git log --oneline --graph --all
   ```

### 課題3: 別のブランチでの並行開発

1. mainブランチに戻る
   ```bash
   git switch main
   ```

2. 別の新しいブランチを作成・切り替え
   ```bash
   git switch -c feature/update-readme
   ```

3. README.mdを編集
   ```bash
   echo -e "\n## New Features\n- Added new page functionality" >> README.md
   ```

4. 変更をコミット
   ```bash
   git add README.md
   git commit -m "Update README with new features section"
   ```

### 課題4: Fast-Forward マージ

1. mainブランチに戻る
   ```bash
   git switch main
   ```

2. feature/update-readmeブランチをマージ
   ```bash
   git merge feature/update-readme
   ```

3. ログを確認（Fast-Forwardマージを確認）
   ```bash
   git log --oneline --graph
   ```

4. 不要になったブランチを削除
   ```bash
   git branch -d feature/update-readme
   ```

### 課題5: 3-way マージ

1. mainブランチで新しいコミットを作成
   ```bash
   echo "body { font-family: Arial, sans-serif; }" > main-styles.css
   git add main-styles.css
   git commit -m "Add main styles"
   ```

2. feature/new-pageブランチをマージ
   ```bash
   git merge feature/new-page
   ```

3. ログを確認（マージコミットを確認）
   ```bash
   git log --oneline --graph
   ```

### 課題6: ブランチ間での差分確認

1. 新しいブランチを作成
   ```bash
   git switch -c feature/improvements
   ```

2. いくつかの変更を加える
   ```bash
   echo "<p>This page has been improved!</p>" >> new-page.html
   git add new-page.html
   git commit -m "Improve new page content"
   ```

3. mainブランチとの差分を確認
   ```bash
   git diff main
   ```

4. 特定のファイルの差分を確認
   ```bash
   git diff main -- new-page.html
   ```

### 課題7: ブランチのリネーム

1. 現在のブランチ名を確認
   ```bash
   git branch
   ```

2. ブランチ名を変更
   ```bash
   git branch -m feature/enhancements
   ```

3. 変更を確認
   ```bash
   git branch
   ```

## 🔄 ブランチ戦略 / Branching Strategies

### Git Flow
- `main` - 本番環境用
- `develop` - 開発用
- `feature/*` - 新機能開発用
- `hotfix/*` - 緊急修正用

### GitHub Flow
- `main` - 本番環境用
- `feature/*` - すべての開発用

## ✅ チェックポイント / Checkpoint

以下のコマンドがエラーなく実行できれば、ブランチ操作をマスターしています：

```bash
git branch
git log --oneline --graph --all
git diff main
```

## 🚀 次のステップ / Next Steps

ブランチ操作ができるようになったら、[03_conflicts](../03_conflicts/README.md)でコンフリクト解決を学習しましょう。