---
sidebar_position: 5
---

# サポートとコミュニティ

## 🐤 MODコミュニティサーバーに参加しよう！

:::note[Discordサーバーについて]
シャドウバース ワールズビヨンドのMOD制作コミュニティ。
MODの共有やインストールのサポートを行っている。

[Discord参加リンク](https://discord.gg/fEUMrTGb23)
:::

## 🐛 バグ報告

バグを見つけた場合は、[X (@dracoboost)](https://x.com/dracoboost) でDMを送るか、  
Discordサーバーに参加して報告してほしい。

## 今後の展望

- DDS ↔ PNGの変換はまだ実装されていません。
  画像変換器 [Texconv](https://github.com/microsoft/DirectXTex) をPNG入力で使用すると、しばしば真っ黒な出力が生成されてしまう。
  この問題を修正するには、変換パイプラインの根本的な変更が必要になる可能性が高いため、現在は行っていない。

<details>
  <summary>コントリビューターの方へ</summary>

  HoHatchは現在、個人で開発している。主な機能は既に実装済みだが、新しい機能を追加したいかつ、[Python](https://www.python.org)や[Next.js](https://nextjs.org)を書ける方のコントリビュートを歓迎する！

  [HoHatch on GitHub (dracoboost/HoHatch)](https://github.com/dracoboost/hohatch)

  :::note[アプリ開発のガイドライン]
  アップデートを送信する前に、preflightチェックが通ることを確認してほしい。

  ```sh
  # frontendディレクトリから
  cd frontend
  npm run preflight
  ```

  詳細なガイドライン (英語) については、`GEMINI.md` を読んでほしい。
  :::
</details>
