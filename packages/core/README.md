<div align="center">

![Forms.js](https://github.com/form-js/forms.js/tree/master/docs/formsjs-banner.png)

</div>

<p align="center">
    <a href="https://github.com/form-js/forms.js/tree/master/docs/v1/getting-started"><b>Documentation</b></a>
</p>

<div align="center">

[![Npm package total downloads](https://badgen.net/npm/dt/@forms.js/core)](https://npmjs.com/package/@forms.js/core)
[![Code Coverage](https://img.shields.io/badge/code_coverage-99%25-brightgreen)](https://github.com/form-js/forms.js)
[![GitHub issues](https://img.shields.io/github/issues/form-js/forms.js)](https://github.com/form-js/forms.js/issues)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/form-js/forms.js)](https://github.com/form-js/forms.js/stargazers)  
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/form-js/forms.js/pulls)
[![Node.js Version](https://img.shields.io/node/v/@forms.js/core)](https://nodejs.org/en/)
[![Maintenance](https://img.shields.io/maintenance/yes/2024)](https://github.com/form-js/forms.js)
[![TypeScript Supported](https://img.shields.io/badge/TypeScript-Supported-blue.svg)](https://www.typescriptlang.org/)

</div>

# Forms.js - Streamline web forms

**Forms.js** is an advanced, lightweight JavaScript library designed to ease form creation and management. Utilizing JSON for data input, it generates dynamic, user-centric forms, offering an unparalleled development experience.

[Get Started with Forms.js](https://github.com/form-js/forms.js/tree/master/docs/v1/getting-started) ⚡️

## Features at a Glance

- **Rapid Development**: Create complex, interactive forms in minutes.
- **Comprehensive Field Types**: Includes text, file, date/time, rich text, and more.
- **Conditional Logic & Validation**: Tailor form behavior and validation to user input.
- **Event Handling**: Simplified event management for dynamic user experiences.
- **Extensibility**: Designed for customization and extension.
- **Accessibility & Clean API**: Ensures ease of use for developers and accessibility for users.

## Installation

### Via NPM

```bash
npm i @forms.js/core
```

### Quick start

```js
import { Form } from '@forms.js/core';

const options = {
    id: "form",
    schema: [
        ...
    ],
}

const form = new Form("form-element", options);

```

### Requires css

```css
@import '@forms.js/core/css/index.css';
```

Dive deeper into Forms.js with the [official documentation](https://github.com/form-js/forms.js/tree/master/docs/v1/getting-started)

## Contributing

If you want to contribute look at <a class="link" target="_blank" href="https://github.com/form-js/forms.js/blob/master/CONTRIBUTING.md">CONTRIBUTING.md</a>.

## License

Core bundle released under MIT license. This license permits a wide range of use, including free use in commercial projects, assuming all copyright headers are preserved. [Read the license terms](https://opensource.org/license/mit/)
