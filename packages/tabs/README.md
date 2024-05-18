<div align="center">

![Forms.js](https://formsjs.io/images/formsjs-banner.png)

</div>

<p align="center">
    <a href="https://formsjs.io/"><b>Website</b></a> •
    <a href="https://formsjs.io/documentation/v1/getting-started"><b>Documentation</b></a>
</p>

# Tabs component for forms.js package

**Forms.js** is an advanced, lightweight JavaScript library designed to ease form creation and management. Utilizing JSON for data input, it generates dynamic, user-centric forms, offering an unparalleled development experience.

[Get Started with Forms.js](https://formsjs.io/documentation/v1/getting-started) ⚡️

<h2 id="instalation">Instalation</h2>

### NPM

```bash
npm i @forms.js/core @forms.js/tabs
```

### JS DELIVR

```html
<link
  href="https://cdn.jsdelivr.net/npm/@forms.js/core/css/index.css"
  rel="stylesheet"
/>
<script src="https://cdn.jsdelivr.net/npm/@forms.js/tabs/lib/index.js"></script>
```

### Usage

app.js
```js
import { Form, usePlugin } from "@forms.js/core";
import { pluginSettings as TabsPlugin } from "@forms.js/tabs";

usePlugin(TabsPlugin);
window.Form = Form;
```

### For more information:

<a href="https://formsjs.io/documentation/v1/getting-started" target="_blank">
    Take a look at official documentation!
</a>

<h2 id="license">License</h2>

<a href="https://formsjs.io/documentation/v1/licensing" target="_blank">
    Triple licensed. Take a look at licensing on the official documentation.
</a>