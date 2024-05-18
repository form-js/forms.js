<div align="center">

![Forms.js](https://formsjs.io/images/formsjs-banner.png)

</div>

<p align="center">
    <a href="https://formsjs.io/"><b>Website</b></a> •
    <a href="https://formsjs.io/documentation/v1/getting-started"><b>Documentation</b></a>
</p>

# List field for forms.js package

**Forms.js** is an advanced, lightweight JavaScript library designed to ease form creation and management. Utilizing JSON for data input, it generates dynamic, user-centric forms, offering an unparalleled development experience.

[Get Started with Forms.js](https://formsjs.io/documentation/v1/getting-started) ⚡️

<h2 id="instalation">Instalation</h2>

### NPM

```bash
npm i @forms.js/core @forms.js/list-field
```

### JS DELIVR

```html
<link
  href="https://cdn.jsdelivr.net/npm/@forms.js/core/css/index.css"
  rel="stylesheet"
/>
<script src="https://cdn.jsdelivr.net/npm/@forms.js/list-field/lib/index.js"></script>
```

### Usage

app.js
```js
import { Form, usePlugin } from "@forms.js/core";
import { pluginSettings as ListFieldPlugin } from "@forms.js/list-field";

usePlugin(ListFieldPlugin);
window.Form = Form;
```

### For more information:

Dive deeper into Forms.js with the [official documentation](https://formsjs.io/documentation/v1/getting-started)

<h2 id="license">License</h2>

<a href="https://formsjs.io/documentation/v1/licensing" target="_blank">
    Triple licensed. Take a look at licensing on the official documentation.
</a>