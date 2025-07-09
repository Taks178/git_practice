# 03. コンフリクト解決練習 / Conflict Resolution Practice

この章では、Gitでコンフリクトが発生した場合の解決方法について学習します。

## 🎯 学習目標 / Learning Goals

- コンフリクトが発生する状況を理解できる
- マージコンフリクトを解決できる
- リベースコンフリクトを解決できる
- コンフリクトを予防する方法を知る

## 📝 練習課題 / Practice Exercises

### 準備: コンフリクト練習用のセットアップ

```bash
cd sample_files
# 練習用ファイルを作成
echo "# Sample Project
This is a sample project for Git practice.

## Features
- Feature A
- Feature B" > project.md
git add project.md
git commit -m "Initial project file"
```

### 課題1: 意図的にコンフリクトを発生させる

1. 新しいブランチを作成
   ```bash
   git switch -c feature/update-features
   ```

2. project.mdを編集（同じ行を変更）
   ```bash
   sed -i 's/Feature A/Advanced Feature A/' project.md
   sed -i 's/Feature B/Enhanced Feature B/' project.md
   git add project.md
   git commit -m "Enhance features in project.md"
   ```

3. mainブランチに戻る
   ```bash
   git switch main
   ```

4. 同じファイルの同じ部分を異なる内容で編集
   ```bash
   sed -i 's/Feature A/Improved Feature A/' project.md
   sed -i 's/Feature B/Better Feature B/' project.md
   git add project.md
   git commit -m "Improve features in project.md"
   ```

### 課題2: マージコンフリクトの解決

1. feature/update-featuresブランチをマージしてコンフリクトを発生させる
   ```bash
   git merge feature/update-features
   ```

2. コンフリクトの状態を確認
   ```bash
   git status
   ```

3. コンフリクトが発生したファイルの内容を確認
   ```bash
   cat project.md
   ```

4. コンフリクトマーカーを理解する
   ```
   <<<<<<< HEAD
   - Improved Feature A
   - Better Feature B
   =======
   - Advanced Feature A
   - Enhanced Feature B
   >>>>>>> feature/update-features
   ```

5. コンフリクトを手動で解決
   ```bash
   # エディタでproject.mdを編集して以下のようにする
   echo "# Sample Project
   This is a sample project for Git practice.

   ## Features
   - Advanced and Improved Feature A
   - Enhanced and Better Feature B" > project.md
   ```

6. 解決したファイルをステージング
   ```bash
   git add project.md
   ```

7. マージを完了
   ```bash
   git commit -m "Merge feature/update-features and resolve conflicts"
   ```

8. ログを確認
   ```bash
   git log --oneline --graph
   ```

### 課題3: 複数ファイルでのコンフリクト

1. 新しいブランチを作成
   ```bash
   git switch -c feature/multiple-changes
   ```

2. 複数ファイルを作成・編集
   ```bash
   echo "Version: 1.0.0" > version.txt
   echo "# Configuration
   database_host=localhost
   database_port=5432" > config.txt
   git add version.txt config.txt
   git commit -m "Add version and config files"
   ```

3. mainブランチで同じファイルを異なる内容で作成
   ```bash
   git switch main
   echo "Version: 2.0.0" > version.txt
   echo "# Configuration
   database_host=production.example.com
   database_port=3306" > config.txt
   git add version.txt config.txt
   git commit -m "Add different version and config files"
   ```

4. マージしてコンフリクトを発生させる
   ```bash
   git merge feature/multiple-changes
   ```

5. 複数のコンフリクトを解決
   ```bash
   # version.txtを解決
   echo "Version: 2.1.0" > version.txt
   
   # config.txtを解決
   echo "# Configuration
   database_host=staging.example.com
   database_port=5432" > config.txt
   
   git add version.txt config.txt
   git commit -m "Merge feature/multiple-changes with resolved conflicts"
   ```

### 課題4: リベースでのコンフリクト解決

1. 新しいブランチを作成
   ```bash
   git switch -c feature/rebase-practice
   ```

2. project.mdに変更を加える
   ```bash
   echo -e "\n## Installation\nRun npm install" >> project.md
   git add project.md
   git commit -m "Add installation instructions"
   ```

3. mainブランチで同じファイルに異なる変更を加える
   ```bash
   git switch main
   echo -e "\n## Usage\nRun npm start" >> project.md
   git add project.md
   git commit -m "Add usage instructions"
   ```

4. feature/rebase-practiceブランチに戻る
   ```bash
   git switch feature/rebase-practice
   ```

5. リベースを実行してコンフリクトを発生させる
   ```bash
   git rebase main
   ```

6. コンフリクトを解決
   ```bash
   # project.mdを編集してコンフリクトを解決
   echo "# Sample Project
   This is a sample project for Git practice.

   ## Features
   - Advanced and Improved Feature A
   - Enhanced and Better Feature B

   ## Installation
   Run npm install

   ## Usage
   Run npm start" > project.md
   ```

7. リベースを続行
   ```bash
   git add project.md
   git rebase --continue
   ```

### 課題5: コンフリクト解決ツールの使用

1. Gitの設定を確認
   ```bash
   git config --list | grep merge
   ```

2. マージツールを設定（vimdiffの例）
   ```bash
   git config merge.tool vimdiff
   ```

3. 新しいコンフリクトを作成してツールを使用
   ```bash
   # 新しいブランチとコンフリクトを意図的に作成
   git switch -c feature/tool-practice
   echo "Tool: Git" >> project.md
   git add project.md
   git commit -m "Add tool info"
   
   git switch main
   echo "Tool: GitHub" >> project.md
   git add project.md
   git commit -m "Add different tool info"
   
   git merge feature/tool-practice
   # コンフリクトが発生
   
   # マージツールを起動
   git mergetool
   ```

## 🛠️ コンフリクト解決のベストプラクティス / Best Practices

### 予防策
1. **頻繁なpull/fetch** - リモートの変更を定期的に取り込む
2. **小さなコミット** - 変更を小さく保つ
3. **明確な役割分担** - ファイルの担当者を明確にする

### 解決時の注意点
1. **両方の変更を理解する** - なぜ変更されたかを確認
2. **テストを実行する** - 解決後に動作確認
3. **チームに相談する** - 不明な場合は関係者に確認

## ✅ チェックポイント / Checkpoint

以下の操作ができればコンフリクト解決をマスターしています：

```bash
# コンフリクトの状態確認
git status

# コンフリクトファイルの確認
git diff

# 解決の完了
git add .
git commit -m "Resolve merge conflicts"
```

## 🚀 次のステップ / Next Steps

コンフリクト解決ができるようになったら、[04_remote_operations](../04_remote_operations/README.md)でリモート操作を学習しましょう。