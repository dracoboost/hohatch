---
sidebar_position: 4
---

The application consists of two main screens: the Main screen and the Settings screen.

## Main Screen

The main screen provides image conversion and management features.

* **Dumped DDS images**: Original textures extracted from the game using [Special K](https://www.special-k.info/).
* **Injected DDS images**: Modified textures ready to be injected into the game. (The destination is determined by the filename `XXXXXXXX.dds`)

When you hover over a DDS image, the following action buttons appear:

* **JPG → DDS**: Converts your edited JPG into the DDS format required by the game and automatically places it into the `inject/textures` folder.
* **DDS → JPG**: Converts dumped DDS files into editable JPG images so you can open them in your favorite image editor.

### Batch operations

Click the image name (`XXXXXXXX` part) to multi-select files. Once multiple files are selected, the following buttons appear:

* **Save**: Batch export selected images as JPGs to a folder you choose.
* **Delete**: Batch delete selected images.
  *There is no "undo" function, so please be careful when deleting.*

## Settings Screen (accessible via the gear icon)

From top to bottom:

* **Language**: Choose between Japanese or English.
* **Special K folder path**: Specify the folder where the Special K executable is located.
* **Saved JPG size**: Option to save card images with 53:64 aspect ratio (recommended for cards).
* **System folders**: Quick access buttons to open the cache and log folders.
  *(Useful for troubleshooting — feel free to send them to me via [Discord (HoHatch)](https://discord.gg/fEUMrTGb23) or [X (@dracoboost)](https://x.com/dracoboost) if you encounter issues)*

## Tips

If DDS images do not display thumbnails/previews in Windows Explorer, installing a DDS-compatible image viewer/editor such as [paint.net](https://www.getpaint.net/) usually resolves the issue.
