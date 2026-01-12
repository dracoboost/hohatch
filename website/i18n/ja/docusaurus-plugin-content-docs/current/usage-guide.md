---
sidebar_position: 3
title: 使い方
---

# 使い方

このガイドでは、『シャドウバース ワールズビヨンド』のMOD制作にHoHatchを使用する方法を説明する。

## ➡️ JPGをインジェクトする（ゲームのMOD制作）

このセクションでは、JPG画像をDDSに変換し、ゲームにインジェクトする方法を説明する。

![シャドウバースWBにJPGをインジェクト](/img/guide/inject-jpg-into-shadowversewb.jpg)

1. インジェクト用のJPGを準備する
2. [Special K](https://www.special-k.info/) を使ってシャドウバースWBを起動し、DDSを抽出する*
3. JPGをDDSとしてインジェクトする**
4. 以上！

### *Special KでDDSを抽出する

![Special KでDDSを抽出](/img/guide/extract-dds-with-special-k-1.jpg)

1. Special Kを使ってシャドウバースWBを起動し、`Ctrl+Shift+Backspace` を押して「Special Kコントロールパネル」を開く
2. 「Render Mod Tools」をクリックして「D3D11 Render Mod Toolkit」（DDS抽出ツール）を開く

![Special KでDDSを抽出](/img/guide/extract-dds-with-special-k-2.jpg)

3. 「Refresh Textures」をクリックしてシャドウバースWBのDDS画像を読み込む
4. 「Dump Texture to Disk」をクリックしてDDSを抽出する。以上！

### \*\*HoHatchでJPGをインジェクトする

![HoHatchでJPGをインジェクト](/img/guide/inject-jpg-with-hohatch.jpg)

「置換」ボタンをクリックする

:::note[リロードについて]
画像が読み込まれない場合は、「リロード」ボタンをクリックする
:::

## ⬅️ JPGを抽出する（ゲームアセットの取得）

ゲーム内の画像をJPGファイルとして抽出する方法を説明する。

![シャドウバースWBからJPGを抽出](/img/guide/extract-jpg-from-shadowversewb.jpg)

1. Special Kを使ってシャドウバースWBを起動する
2. MOD制作用にDDSを抽出する\*
3. JPGに変換する\*\*\*

### \*\*\*HoHatchでJPGに変換する

![HoHatchでJPGに変換](/img/guide/convert-to-jpg-with-hohatch.jpg)

「JPGに変換」ボタンをクリックする
