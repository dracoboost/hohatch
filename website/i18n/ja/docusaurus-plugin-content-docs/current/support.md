---
sidebar_position: 5
title: サポートとコミュニティ
---

# サポートとコミュニティ

## 🐤 MODコミュニティサーバーに参加しよう！

> 『シャドウバース ワールズビヨンド』のMOD制作コミュニティです。
> MODの共有やインストールのサポートなど、気軽にご参加ください！

**参加リンク:** [https://discord.gg/fEUMrTGb23](https://discord.gg/fEUMrTGb23)

## 🐛 バグ報告

バグを見つけた場合は、[X (@dracoboost)](https://x.com/dracoboost) でDMを送るか、Discordサーバーに参加して報告してください。
あるいは、GitHubで機能を実装することも可能です。

## 今後の展望

- DDS ↔ PNGの変換はまだ実装されていません。
  `texconv` をPNG入力で使用すると、しばしば真っ黒な出力が生成されます。
  この問題を修正するには、変換パイプラインの根本的な変更が必要になる可能性が高いため、現在は延期されています。

## コントリビューターの方へ

HoHatchは現在、個人で開発している。主な機能は既に実装済みですが、もし新しい機能を追加したいかつ、**Python**や**Next.js**を書ける方のコントリビュートを歓迎します！

[GitHub (dracoboost/HoHatch)](https://github.com/dracoboost/hohatch)

アップデートを送信する前に、preflightチェックが通ることを確認してください。
詳細なガイドライン（英語）については、`GEMINI.md` をお読みください。

```sh
# frontendディレクトリから
cd frontend
npm run preflight
```
