<h1 id="introduction">
     <img alt="Forms.js" style="margin: 0 auto" src="/images/banner.png" />
</h1>

## Features

-   **Usability - create complex forms in 5 minutes**
-   **High ammount of form fields**
-   **Includes smart selects, file inputs, datetime inputs and rich text fields**
-   **Conditional logic**
-   **Validation**
-   **Easy change events**
-   **Extensible**
-   **Accessable, Clean API...**

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
