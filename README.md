# EasyApp Chrome Extension 🚀

<p align="center">
  <img src="Logo/easyAppLight.svg" alt="EasyApp Logo" width="400">
</p>

Welcome to **EasyApp**, your one-stop solution for navigating job listings with ease. Job hunting has never been this effortless!

## Table of Contents

- [EasyApp Chrome Extension 🚀](#easyapp-chrome-extension-)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [For Devs](#for-devs)
  - [Dive into Chrome Extensions](#dive-into-chrome-extensions)
  - [License](#license)

## Features

- **Autofill Page**: Instantly fill out job application forms.
- **Navigate Listings**: Manage and navigate through your job listings.
- **Settings**: Customize your personal info for EasyApp to use.

## Getting Started

### Installation

1. Clone this repository:

```bash
git clone https://github.com/EasyApp-RPI/EasyApp.git
```

2. Open the repository on your machine nd install node packages with:

```bash
npm install
```

3. Then build the chrome extension with:

```bash
npm run build
```

4. Open Chrome and navigate to `chrome://extensions/`.
5. Enable "Developer mode" (usually a toggle in the top right).
6. Click on "Load unpacked" and select the `EasyApp/extension` directory.
7. The **EasyApp** extension icon should now appear in your Chrome toolbar. Click on it and enjoy!

### For Devs

If you alter the react chrome extension or autofill script at all make sure to run `npm run build`. If you alter the extension permissions in the manifest make sure to reload the extension.

## Dive into Chrome Extensions

If you're new to Chrome extensions, here are some resources to get you started:

- [Official Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/mv3/getstarted/)
- [Chrome Extension Development for Beginners](https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

A [Rensselaer Center for Open Source](https://new.rcos.io/) project
