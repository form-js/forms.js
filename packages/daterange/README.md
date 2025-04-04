<div align="center">

![Forms.js](https://github.com/form-js/forms.js/blob/master/docs/formsjs-banner.png?raw=true)

</div>

<p align="center">
    <a href="https://github.com/form-js/forms.js/tree/master/docs/v1/getting-started"><b>Documentation</b></a>
</p>

# Daterange field for forms.js package

**Forms.js** is an advanced, lightweight JavaScript library designed to ease form creation and management. Utilizing JSON for data input, it generates dynamic, user-centric forms, offering an unparalleled development experience.

[Get Started with Forms.js](https://github.com/form-js/forms.js/tree/master/docs/v1/getting-started) ⚡️

<h2 id="instalation">Instalation</h2>

### Via NPM

```bash
npm i @forms.js/core @forms.js/daterange-field
```

### Usage

app.js
```js
import { Form, usePlugin } from "@forms.js/core";
import { pluginSettings as DateRangeFieldPlugin } from "@forms.js/daterange-field";

usePlugin(DateRangeFieldPlugin);
window.Form = Form;
```

### For more information:

Dive deeper into Forms.js with the [official documentation](https://github.com/form-js/forms.js/tree/master/docs/v1/getting-started)


<h2 id="license">License</h2>

Core bundle released under MIT license. This license permits a wide range of use, including free use in commercial projects, assuming all copyright headers are preserved. [Read the license terms](https://opensource.org/license/mit/)