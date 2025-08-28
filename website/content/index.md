## 📥 Download

To use HoHatch, download the [latest executable](https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch.exe). For older versions, visit the [releases page](https://github.com/dracoboost/hohatch/releases).

## ✨ Features

### 🖥️ Main Screen

| Feature | Description |
|---|---|
| Image Thumbnail Display | View thumbnails of both "dumped" DDS images (extracted from the game) and "injected" DDS images (converted from JPGs for modding). |
| Selective Batch Processing | Select multiple images from either section to perform batch operations like downloading them as JPGs or deleting them. |
| Individual Image Actions | Each image thumbnail has quick actions to download as JPG, replace with a new JPG, or delete the file. |
| Pagination | Images in both "dumped" and "injected" sections are paginated for easier navigation. |

### ⚙️ Settings Screen

| Feature | Description |
|---|---|
| Language Selection | Toggle between English (en) and Japanese (ja) for the application's UI. |
| Special K Folder Path | Specify the installation directory of Special K. Includes a "Download" button to easily download the Special K setup application. |
| Texconv Executable Path | Specify the path to the Texconv executable. Includes a "Download" button to easily download Texconv. |
| DDS to JPG Output Resolution | Set the desired height for JPG output when converting DDS files. The corresponding width is automatically calculated (53/64 of the height) and displayed. |

## 🛠️ Usage Procedures

### 📝 Common Steps

1. **Install Special K**: Special K is a modding tool used for dumping in-game images and extracting card images.
2. **Dump images using Special K**

Tips

> - For followers, you need to press the evolution button.
> - Non-evolved follower cards and non-follower cards end with 0, while evolved followers uniquely end with 1.

### ➡️ JPG to DDS: Inject

1. Obtain the modified illustration.
2. Dump the illustration you want to replace using Special K.
3. Launch HoHatch and select the illustration you want to replace from the dumped image list displayed.
4. By selecting the modified illustration, the modified illustration will be stored in DDS format in the inject folder.

If you want to further replace an already injected image, you can select it from the images already displayed in the inject image list.

### ⬅️ DDS to JPG: Extract

There are options for single image extraction and extracting all images.

1. In the image list, click the "JPG" button located at the bottom left of each image extracted by Special K.
2. Clicking the "All Dumped DDS to JPG" button will open a pop-up window to select an output folder, and convert all DDS files in the dump folder to JPG and save them to the selected folder.

## 💬 Join Modding Community Server!

> A community for modding Shadowverse: World Beyond.
> Join us to share mods, get support, and discuss advanced customization!

**Join:** <https://discord.gg/fEUMrTGb23>

## 🐛 Bug Report

If you find a bug, please send a DM on [X (@dracoboost)](https://x.com/dracoboost), or join our Discord server to report it.
Alternatively, you can implement the feature on GitHub.

## 💻 Source Code

The source code of HoHatch is licensed under MIT and can be found on [GitHub](https://github.com/dracoboost/hohatch).
