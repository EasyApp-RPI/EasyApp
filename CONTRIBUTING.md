# Contributing to EasyApp Chrome Extension 🚀

Thank you for considering contributing to EasyApp! We welcome contributions from developers like you to make EasyApp even better.

<!-- omit in toc -->

## Table of Contents

- [Contributing to EasyApp Chrome Extension 🚀](#contributing-to-easyapp-chrome-extension-)
  - [Table of Contents](#table-of-contents)
  - [Before You Start](#before-you-start)
    - [External Contributors](#external-contributors)
    - [Internal Contributors](#internal-contributors)
  - [How to contribute](#how-to-contribute)
    - [Building the extension](#building-the-extension)
    - [Issues](#issues)
      - [Creating Issues](#creating-issues)
      - [Bug Reports](#bug-reports)
      - [Feature Requests](#feature-requests)
      - [Enhancement Requests](#enhancement-requests)
      - [Questions](#questions)
  - [Code Contributions](#code-contributions)
  - [Pull Requests](#pull-requests)
  - [Resources](#resources)

## Before You Start

### External Contributors

You are an external contributor if you are not part of the EasyApp organization. If you plan to contribute code continue reading, otherwise you can jump to the [issue section](#issues).

Before you can dive into contributing you must set up your environment. Follow these steps to do so.

- Fork this repository. For more information see [Fork a repo](https://docs.github.com/en/get-started/quickstart/fork-a-repo?tool=webui).

- Clone the forked repository to your local machine:

  ```bash
  git clone https://github.com/YOUR-USERNAME/EasyApp.git
  ```

- Open the directory to ensure you followed the steps correctly. It should look like a 1-1 match with our repository.

- You can now go to [Building the extension](#building-the-extension).

### Internal Contributors

You are an internal contributor if you are part of the EasyApp organization. Follow these steps to set up your

- Clone this repository to your local machine:

  ```bash
  git clone https://github.com/EasyApp-RPI/EasyApp.
  ```

- You can now go to [Building the extension](#building-the-extension)

## How to contribute

There are plenty of ways to contribute to EasyApp! Follow [Building the Extension](building-the-extension) if you plan on contributing code. Make sure you have your dev environment set up. Otherwise checkout [Issues](issues) for non code contributions.

### Building the extension

- **Install Dependencies:** Open the repository on your machine and install node packages with:

  ```bash
  npm install
  ```

- **Build the Extension:** Then build the chrome extension with:

  ```bash
  npm run build
  ```

- **Load the Extension:** Open Google Chrome and go to chrome://extensions/.
- **Enable Developer Mode:** Toggle on "Developer mode" in the top right corner.
- **Load Unpacked:** Click on "Load unpacked" and select the EasyApp/extension directory.
- **Rebuild:** If you make changes to the React Chrome extension or autofill script. Make sure to rebuild the extension.
- **Permissions:** If you modify extension permissions in the manifest, reload the extension.
- **Test and Enjoy:** The EasyApp extension icon should now be in your Chrome toolbar. Click on it and enjoy!

If you plan to contribute code checkout the [code contributions](#code-contributions) section.

### Issues

#### Creating Issues

Thank you for considering contributing to our project! Issues are a valuable way to get involved. Please follow these guidelines when creating issues:

#### Bug Reports

If you encounter a bug, report it! Help us identify and resolve issues by providing the following:

- A clear and concise title summarizing the problem.
- Detailed steps to reproduce the bug.
- Screenshots or error logs, if applicable.

#### Feature Requests

Have a great idea for a new feature? Share it with us by creating a feature request issue:

- Describe the desired functionality in detail.
- Explain why this feature would be valuable to the project.

#### Enhancement Requests

If you want to suggest improvements to existing features, enhancement requests are the way to go:

- Clearly describe the enhancement or optimization you have in mind.
- Explain how it would benefit the project or user experience.

#### Questions

Don't hesitate to ask questions if you're unsure about something. We're here to help!

- Use a descriptive title for your question.
- Provide context and details to help others understand your query.

Feel free to explore existing issues to get a sense of how they're structured. Your contributions and engagement are greatly appreciated!

## Code Contributions

Here is an exhaustive list of ways you can contribute code to the project!

- Fixing Bugs: Identify and fix existing bugs in the codebase. Provide clear explanations of the issue and the solution in your pull request.

- Adding Features: Propose and implement new features that enhance EasyApp's functionality. Clearly outline the feature's purpose and benefits.

- Optimizing Performance: Optimize the codebase for better performance. This can include improving algorithms, reducing resource usage, or enhancing user experience.

- Refactoring: Contribute by refactoring code to make it more maintainable, readable, and adhering to best practices.

- UI/UX Improvements: Enhance the user interface and user experience by improving design, layout, and usability.

- Adding Documentation: Improve code documentation by adding comments, explanations, and guides for developers who work on the project in the future.

- Writing Tests: Contribute by writing test cases to ensure the stability and reliability of EasyApp's codebase.

- Accessibility Enhancements: Make the extension more accessible to a wider audience by ensuring it complies with accessibility standards.

- Security Enhancements: Identify and fix potential security vulnerabilities in the code to ensure user data and privacy are protected.

**Side Note:** We try to keep our codebase as clean as possible so if you do end up committing any code make sure to write comments about its functionality. We also use [prettier](https://prettier.io/) to format our code so before committing anything make sure to run the npm script that will format everything for you.

  ```bash
  npm run format
  ```

## Pull Requests

When you're finished with the changes, create a pull request, also known as a PR.

- Fill out template so that we can review your PR. This template helps reviewers understand your changes as well as the purpose of your pull request.
- Don't forget to [link PR to issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) if you are solving one.
- Enable the checkbox to [allow maintainer edits](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/allowing-changes-to-a-pull-request-branch-created-from-a-fork) so the branch can be updated for a merge.
- We may ask for changes to be made before a PR can be merged, either using [suggested changes](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/incorporating-feedback-in-your-pull-request) or pull request comments. You can make any other changes in your clone, then commit them to the branch.
- As you update your PR and apply changes, mark each conversation as [resolved](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/commenting-on-a-pull-request#resolving-conversations).
- If you run into any merge issues, checkout this [git tutorial](https://github.com/skills/resolve-merge-conflicts) to help you resolve merge conflicts and other issues.

## Resources

If you're new to Chrome extensions, here are some helpful resources:

- [Official Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/mv3/getstarted/)
- [Chrome Extension Development for Beginners](https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/)

If you're new to Typescript, here are some helpful resources:

- [Official Typescript Documentation](https://www.typescriptlang.org/docs/)
- [Typescript for Beginners](https://www.freecodecamp.org/news/learn-typescript-beginners-guide/)

---

We appreciate your contributions to EasyApp!

This project is licensed under the MIT License. See the LICENSE file for details.

A Rensselaer Center for Open Source project.
