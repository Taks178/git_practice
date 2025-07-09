# 🚀 クイックスタートガイド / Quick Start Guide

Gitの練習をすぐに始めたい方向けのガイドです。

## 📋 前提条件 / Prerequisites

1. **Gitのインストール確認**
   ```bash
   git --version
   ```

2. **ユーザー設定（初回のみ）**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

## 🎯 5分でできる基本練習 / 5-Minute Basic Practice

### ステップ1: 練習用ディレクトリを作成
```bash
mkdir git-practice-session
cd git-practice-session
git init
```

### ステップ2: 最初のファイルを作成・コミット
```bash
echo "# My Git Practice" > README.md
git add README.md
git status
git commit -m "Initial commit"
```

### ステップ3: ファイルを編集・再コミット
```bash
echo "## Learning Git basics" >> README.md
git diff
git add README.md
git commit -m "Add learning section"
```

### ステップ4: 履歴を確認
```bash
git log --oneline
```

## 📚 次にやること / What's Next

基本操作ができたら、以下の順番で練習を進めてください：

1. **[01_basic_operations](01_basic_operations/README.md)** - Git基本操作をマスター
2. **[02_branching](02_branching/README.md)** - ブランチ操作を学習
3. **[03_conflicts](03_conflicts/README.md)** - コンフリクト解決を練習
4. **[04_remote_operations](04_remote_operations/README.md)** - リモート操作を習得

## 💡 練習のコツ / Practice Tips

- **小さく始める**: 最初は簡単なコマンドから
- **実際に手を動かす**: 読むだけでなく実際にコマンドを実行
- **エラーを恐れない**: 失敗も大切な学習の一部
- **定期的に練習**: 継続が最も重要

## 🆘 困った時は / When You Need Help

- `git help <command>` でヘルプを確認
- [Git公式ドキュメント](https://git-scm.com/doc)
- 各練習ディレクトリのREADMEを参照

---

**頑張って練習しましょう！ / Happy practicing!** 🎉