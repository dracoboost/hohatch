---
sidebar_position: 3
title: 使い方
---

# 使い方

このガイドでは、『シャドウバース ワールズビヨンド』のMOD制作にHoHatchを使用する方法を説明します。

## ➡️ JPGをインジェクトする（ゲームのMOD制作）

このセクションでは、JPG画像をDDSに変換し、ゲームにインジェクトする方法を説明します。

![シャドウバースWBにJPGをインジェクト](/img/guide/inject-jpg-into-shadowversewb.jpg)

1. インジェクト用のJPGを準備する
2. [Special K](https://www.special-k.info/) を使ってシャドウバースWBを起動し、DDSを抽出する*
3. JPGをDDSとしてインジェクトする**
4.完了です！お楽しみください！

### *Special KでDDSを抽出する

![Special KでDDSを抽出](/img/guide/extract-dds-with-special-k-1.jpg)

1. Special Kを使ってシャドウバースWBを起動し、`Ctrl+Shift+Backspace` を押して「Special Kコントロールパネル」を開きます
2. 「Render Mod Tools」をクリックして「D3D11 Render Mod Toolkit」（DDS抽出ツール）を開きます

![Special KでDDSを抽出](/img/guide/extract-dds-with-special-k-2.jpg)

3. 「Refresh Textures」をクリックしてシャドウバースWBのDDS画像を読み込みます
4. 「Dump Texture to Disk」をクリックしてDDSを抽出します — これで完了です！

### **HoHatchでJPGをインジェクトする

![HoHatchでJPGをインジェクト](/img/guide/inject-jpg-with-hohatch.jpg)

「置換」ボタンをクリックするだけです
（画像が読み込まれない場合は、「リロード」ボタンをクリックしてください）

## ⬅️ JPGを抽出する（ゲームアセットの取得）

このセクションでは、ゲーム内の画像をJPGファイルとして抽出する方法を説明します。

![シャドウバースWBからJPGを抽出](/img/guide/extract-jpg-from-shadowversewb.jpg)

1. Special Kを使ってシャドウバースWBを起動する
2. MOD制作用にDDSを抽出する*
3. JPGに変換する***

### ***HoHatchでJPGに変換する

![HoHatchでJPGに変換](/img/guide/convert-to-jpg-with-hohatch.jpg)

「JPGに変換」ボタンをクリックするだけです
（画像が読み込まれない場合は、「リロード」ボタンをクリックしてください）
