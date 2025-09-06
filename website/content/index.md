## 📥 Download

To use HoHatch, download the [latest HoHatch (v1.0.4)](https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v1.0.4.zip).  
(For older versions, visit the [releases page](https://github.com/dracoboost/hohatch/releases).)

## 🛠️ Usage Guide

This guide explains how to use HoHatch for modding Shadowverse: Worlds Beyond.

### ➡️ Injecting JPGs (Modding the Game)

This section explains how to convert a JPG image to DDS and inject it into the game.

![Inject JPG into ShadowverseWB](/images/guide/inject-jpg-into-shadowversewb.png)

1. Prepare the JPG for injection
2. Launch ShadowverseWB with [Special K](https://www.special-k.info/), then extract the DDS*
3. Inject the JPG as DDS**
4. Done! Enjoy!

#### \*Extract DDS with Special K

![Extract DDS with Special K](/images/guide/extract-dds-with-special-k-1.png)

1. Launch ShadowverseWB with Special K, then press `Ctrl+Shift+Backspace` to open the "Special K Control Panel"
2. Click "Render Mod Tools" to open the "D3D11 Render Mod Toolkit" (DDS extractor)

![Extract DDS with Special K](/images/guide/extract-dds-with-special-k-2.png)

3. Click "Refresh Textures" to load ShadowverseWB DDS images
4. Click "Dump Texture to Disk" to extract DDS — done!

#### \*\*Inject JPG with HoHatch

![Inject JPG with HoHatch](/images/guide/inject-jpg-with-hohatch.png)

Just click the "Replace" button
(If images don't load, click the "Reload" button)

### ⬅️ Extracting JPGs (Getting Game Assets)

This section explains how to extract in-game images as JPG files.

![Extract JPG from ShadowverseWB](/images/guide/extract-jpg-from-shadowversewb.png)

1. Launch ShadowverseWB with Special K
2. Extract the DDS* for modding
3. Convert to JPG***

#### \*\*\*Convert to JPG with HoHatch

![Convert to JPG with HoHatch](/images/guide/convert-to-jpg-with-hohatch.png)

Just click the "Convert to JPG" button
(If images don't load, click the "Reload" button)

## ✨ Features

### 🖼️ Main Screen

On the main screen, thumbnails of both "dumped" DDS images (extracted from the game) and "injected" DDS images (converted from JPGs for modding) are displayed.  
You can perform individual actions on each image or select multiple for batch processing. The table below summarizes the key features available for managing these images.

| Feature | Description |
|---|---|
| Convert to JPG | Convert a single DDS image to JPG format and save it to a chosen location. |
| Replace DDS | Replace an existing DDS file with a new JPG image, converting it to DDS during the process. |
| Delete DDS | Permanently delete a single DDS file from its respective folder. |

### ⚙️ Settings Screen

On the settings screen, you can configure various settings for the application.

| Feature | Description |
|---|---|
| Language Selection | Toggle between English (en) and Japanese (ja) for the application's UI. |
| Special K Folder Path | Specify the installation directory of Special K. Includes a "Download" button to easily download the Special K setup application. |
| DDS to JPG Output Resolution | Set the desired height for JPG output when converting DDS files. The corresponding width is automatically calculated (53/64 of the height) and displayed. |

## 🐤 Join Modding Community Server!

> A community for modding Shadowverse: World Beyond.
> Join us to share mods, get mod installation support, and discuss advanced customization!

**Join:** <https://discord.gg/fEUMrTGb23>

## 🐛 Bug Report

If you find a bug, please send a DM on [X (@dracoboost)](https://x.com/dracoboost), or join our Discord server to report it.
Alternatively, you can implement the feature on GitHub.
