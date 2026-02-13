# Git Practice Repository

このリポジトリは、Gitの基本操作を練習するためのリポジトリです。  
This repository is designed for practicing Git basic operations.

## 📚 学習内容 / Learning Contents

### 1. Git基本操作 / Basic Git Operations
- `git init` - リポジトリの初期化
- `git add` - ステージング
- `git commit` - コミット
- `git status` - 状態確認
- `git log` - ログ確認

### 2. ブランチ操作 / Branch Operations
- `git branch` - ブランチ作成・一覧
- `git checkout` / `git switch` - ブランチ切り替え
- `git merge` - マージ
- `git rebase` - リベース

### 3. リモート操作 / Remote Operations
- `git clone` - クローン
- `git pull` - プル
- `git push` - プッシュ
- `git fetch` - フェッチ

### 4. コンフリクト解決 / Conflict Resolution
- マージコンフリクトの解決方法
- リベースコンフリクトの解決方法

## 🚀 練習の始め方 / How to Start Practice

### 📋 すぐに始めたい方 / Quick Start
**[📖 クイックスタートガイド (QUICKSTART.md)](QUICKSTART.md)** を参照して、5分で基本操作を体験しましょう！

### 前提条件 / Prerequisites
- Gitがインストールされていること
- 基本的なコマンドライン操作ができること

### 練習手順 / Practice Steps

1. **このリポジトリをクローンする / Clone this repository**
   ```bash
   git clone https://github.com/Taks178/git_practice.git
   cd git_practice
   ```

2. **練習用ディレクトリを確認する / Check practice directories**
   ```bash
   ls -la
   ```

3. **各練習ディレクトリで指示に従って練習する / Practice following instructions in each directory**

## 📁 ディレクトリ構成 / Directory Structure

```
git_practice/
├── README.md                 # このファイル / This file
├── QUICKSTART.md            # クイックスタートガイド / Quick start guide
├── 01_basic_operations/      # 基本操作練習 / Basic operations practice
├── 02_branching/            # ブランチ操作練習 / Branching practice
├── 03_conflicts/            # コンフリクト解決練習 / Conflict resolution practice
├── 04_remote_operations/    # リモート操作練習 / Remote operations practice
├── sample_files/            # 練習用サンプルファイル / Sample files for practice
├── test.txt                 # 練習用テストファイル / Test file for practice
└── .gitignore              # Git無視設定 / Git ignore settings
```

## 💡 練習のヒント / Practice Tips

1. **コミットメッセージは分かりやすく書く**  
   Write clear and descriptive commit messages

2. **小さな変更で頻繁にコミットする**  
   Make frequent commits with small changes

3. **ブランチを活用する**  
   Utilize branches effectively

4. **リモートリポジトリとの同期を意識する**  
   Be mindful of synchronization with remote repositories

## 🆘 困ったときは / When You Need Help

- [Git公式ドキュメント](https://git-scm.com/doc)
- [Git入門](https://www.atlassian.com/ja/git/tutorials)
- `git help <command>` でヘルプを確認

## 🎯 学習目標 / Learning Goals

このリポジトリでの練習を通じて、以下のことができるようになることを目指します：

- [ ] 基本的なGitコマンドを使いこなせる
- [ ] ブランチを使った開発ワークフローを理解できる
- [ ] コンフリクトを適切に解決できる
- [ ] チーム開発でGitを効果的に活用できる

## 📊 Additional Resources / 追加リソース

### Tenstorrent tt-metal vLLM Investigation Report

このリポジトリには、Tenstorrent tt-metalプロジェクトにおけるvLLM統合の調査レポートが含まれています。  
This repository includes an investigation report on vLLM integration with Tenstorrent tt-metal.

📖 **[調査レポート索引 / Investigation Index](INVESTIGATION_INDEX.md)**

主な調査内容 / Main investigation topics:
- Tenstorrent製品でvLLMを稼働できるか / Can vLLM run on Tenstorrent products?
- 外部（Claude Code等）から呼び出せるか / Can it be called from external services?

---

Happy Git practicing! 🎉
