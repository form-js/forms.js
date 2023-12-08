<h1 id="introduction">
    <a href="https://formsjs.io/" target="_blank">
        <img alt="Forms.js" style="margin: 0 auto" src="https://formsjs.io/images/banner.png" />
    </a>
</h1>

### Forms.js is a highly versatile, flexible, and lightweight JavaScript library that simplifies the process of form creation and management. Leveraging the power of JSON data input, it programmatically generates dynamic forms, enabling developers to create sophisticated, interactive, and user-friendly forms with ease.

<a href="https://formsjs.io/documentation/v1/getting-started" target="_blank">
    Official documentation
</a>

<h2 id="features">Features</h2>

- **Usability - create complex forms in 5 minutes**
- **High ammount of form fields**
- **Includes smart selects, file inputs, datetime inputs and rich text fields**
- **Conditional logic**
- **Validation**
- **Easy change events**
- **Extensible**
- **Accessable, Clean API...**

<h2 id="instalation">Instalation</h2>

### NPM

```bash
npm i @forms.js/core
```

### JS DELIVR

```html
<link
  href="https://cdn.jsdelivr.net/npm/@forms.js/core/src/css/index.css"
  rel="stylesheet"
/>
<script src="https://cdn.jsdelivr.net/npm/@forms.js/core/lib/index.js"></script>
```

### Usage

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

### CSS

```css
@import '@forms.js/core/css/index.css'
```

<h2 id="license">License</h2>

Core bundle released under MIT license. This license permits a wide range of use, including free use in commercial projects, assuming all copyright headers are preserved. [Read the license terms](https://opensource.org/license/mit/)
