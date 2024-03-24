<div align="center">

![Forms.js](https://formsjs.io/images/formsjs-banner.png)

</div>

## Features

- **Rapid Development**: Create complex, interactive forms in minutes.
- **Comprehensive Field Types**: Includes text, file, date/time, rich text, and more.
- **Conditional Logic & Validation**: Tailor form behavior and validation to user input.
- **Event Handling**: Simplified event management for dynamic user experiences.
- **Extensibility**: Designed for customization and extension.
- **Accessibility & Clean API**: Ensures ease of use for developers and accessibility for users.

## Installation

### NPM

```shell
$ npm i @forms.js/core
```

### JS DELIVR

```html
<link
  href="https://cdn.jsdelivr.net/npm/@forms.js/core/css/index.css"
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

<iframe height="400" style="width: 100%;" scrolling="no" title="forms.js - login form" src="https://codepen.io/trilmatic/embed/yLZrNQJ?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/trilmatic/pen/yLZrNQJ">
  forms.js - login form</a> by Trilmatic (<a href="https://codepen.io/trilmatic">@trilmatic</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Individual plugins

`This part of documentation is still in progress.`

## Plugins List

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Functionality</th>
      <th>Links</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="font-bold">@formsjs/core</span></td>
      <td>Offers the Form, Group, Button classes and base form fields.</td>
      <td><a class="link" href="https://www.npmjs.com/package/@forms.js/core" target="_blank">https://www.npmjs.com/package/@forms.js/core</a></td>
    </tr>
    <tr>
      <td><span class="font-bold">@formsjs/vue</span></td>
      <td>Vue component for Forms.js.</td>
      <td><a class="link" href="https://www.npmjs.com/package/@forms.js/vue" target="_blank">https://www.npmjs.com/package/@forms.js/vue</a></td>
    </tr>
  </tbody>
</table>
