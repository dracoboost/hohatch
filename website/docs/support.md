---
sidebar_position: 5
title: Support & Community
---

# Support & Community

## 🐤 Join the MOD Community Server!

> This is a community for applying and creating mods for "Shadowverse: Worlds Beyond."
> We share mods and provide support for installation. Feel free to join!

**[Join Link](https://discord.gg/fEUMrTGb23)**

## 🐛 Bug Report

If you find a bug, please send a DM on [X (@dracoboost)](https://x.com/dracoboost), or join our Discord server to report it.
Alternatively, you can implement the feature on GitHub.

## Future Plans

- DDS ↔ PNG conversion is not yet implemented.
  When using [Texconv](https://github.com/microsoft/DirectXTex) with PNG input, it often produces completely black output.

:::note[What is Texconv?]
Texconv is a command-line utility developed as part of the Microsoft DirectXTex library. It is primarily used for converting and processing texture files for use in Direct3D applications.
:::

  Fixing this issue would likely require a fundamental change to the conversion pipeline, so it has been postponed for now.

<details>
  <summary>For Contributors</summary>

  HoHatch is currently being developed by an individual. While the main features are already implemented, contributions are welcome from those who want to add new features and are comfortable writing **Python** and/or **Next.js**.

  [HoHatch on GitHub (dracoboost/HoHatch)](https://github.com/dracoboost/hohatch)

  :::note[Application Creation Guidelines]
  Please make sure that the preflight check passes before submitting a pull request.
  For detailed guidelines (in English), please read `GEMINI.md`.

  ```sh
  # From the frontend directory
  cd frontend
  npm run preflight
  ```
  :::
</details>
