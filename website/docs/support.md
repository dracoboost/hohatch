---
sidebar_position: 5
---

# Support & Community

## 🐤 Join the MOD Community Server!

:::note[About Discord server]
This is a community for applying and creating mods for Shadowverse: Worlds Beyond.
We share mods and provide support for installation. Feel free to join!

[Discord Join Link](https://discord.gg/fEUMrTGb23)
:::

## 🐛 Bug Report

If you find a bug, please send a DM on [X (@dracoboost)](https://x.com/dracoboost),  
or join our Discord server to report it.

## Future Plans

- DDS ↔ PNG conversion is not yet implemented.
  When using [Texconv](https://github.com/microsoft/DirectXTex) with PNG input, it often produces completely black output.

:::note[What is Texconv?]
Texconv is a command-line utility developed as part of the Microsoft DirectXTex library.  
It is primarily used for converting and processing texture files for use in Direct3D applications.
:::

  Fixing this issue would likely require a fundamental change  
  to the conversion pipeline, so it has been postponed for now.

<details>
  <summary>For Contributors</summary>

  HoHatch is currently being developed by an individual.  
  While the main features are already implemented,  
  contributions are welcome from those who want to add new features  
  and are comfortable writing [Python](https://www.python.org) and/or [Next.js](https://nextjs.org).

  [HoHatch on GitHub (dracoboost/HoHatch)](https://github.com/dracoboost/hohatch)

  :::note[Application Development Guidelines]
  Please make sure that the preflight check passes before submitting a pull request.

  ```sh
  # From the frontend directory
  cd frontend
  npm run preflight
  ```

  For detailed guidelines, please read `GEMINI.md`.

  :::
</details>
