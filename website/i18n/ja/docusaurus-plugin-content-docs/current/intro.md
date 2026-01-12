---
sidebar_position: 1
---

# HoHatchとは？

**HoHatch**は、Special Kインジェクションツールを使用して[**シャドウバース ワールズビヨンド**](https://shadowverse-wb.com/ja/)（以下「シャドウバースWB」）の  
MOD制作をサポートするために設計されたWindowsデスクトップアプリケーションである。  
JPGとDDS形式間の変換、およびDDSテクスチャファイルの管理に特化している。

シャドウバースWBのMOD制作者にとって、実際のMOD画像制作以外の作業に時間を費やすことは、非常に憂鬱である。  
そのMOD画像を作成するためのワークフローというのは、以下の通りである：

* Special Kを使用してゲームからオリジナルのDDSファイルを抽出する
* それらのDDSファイルを編集可能なJPGに変換する
* JPGを編集・修正する
* 編集したJPGをインジェクションのためにDDS形式に戻す

> [DirectDraw Surface (DDS)](https://ja.wikipedia.org/wiki/DirectDraw_Surface) は、1つのファイル内にミップマップ (異なる解像度の画像) を格納できる画像形式である。

HoHatchは、このワークフローの画像変換とファイル管理の部分をできるだけ効率的かつ直感的にし、  
制作者がMOD画像そのものに集中できるようにするために作成された。

![HoHatchアプリケーションのスクリーンショット](/img/screenshot/hohatch-screenshot-v1.1.0.png)

:::info[Android, iOSでのMODはある？]
一般的に、モバイルOSは強力なセキュリティ制限があるため、アプリのインジェクションは非常に困難である。そのため、現在AndroidおよびiOSでのビヨンドのMOD制作は行われていない。
:::

<details>
  <summary>初リリース日について</summary>
  HoHatchは、2025年8月29日に初めて[GitHubでリリース](https://github.com/dracoboost/hohatch/tree/c94031b6fdacf581d5993a0c7be9bc4df188a04d)され、その後2025年10月5日に[Redditで共有](https://www.reddit.com/r/ShadowverseMods/comments/1naxk3j/hohatch_streamline_shadowversewb_modding/)された。
</details>
