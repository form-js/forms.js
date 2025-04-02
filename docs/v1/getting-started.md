<div align="center">

![Forms.js](https://github.com/form-js/forms.js/tree/master/docs/formsjs-banner.png)

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
@import "@forms.js/core/css/index.css";
```

<iframe height="400" style="width: 100%;" scrolling="no" title="forms.js - login form" src="https://codepen.io/trilmatic/embed/yLZrNQJ?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/trilmatic/pen/yLZrNQJ">
  forms.js - login form</a> by Trilmatic (<a href="https://codepen.io/trilmatic">@trilmatic</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Individual plugins

You can use any or every one of the premium packages. The premium packages require a license, but they are free for non profit projects.

app.js

```js
import { Form, usePlugin, setLicenseKey } from "@forms.js/core";
import { pluginSettings as DateRangePlugin } from "@forms.js/daterange-field";
import { pluginSettings as RatingPlugin } from "@forms.js/rating-field";

setLicenseKey("license");

usePlugin([DateRangePlugin, RatingPlugin]);
window.Form = Form;
```

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
    <tr>
      <td><span class="font-bold">@formsjs/daterange-field</span></td>
      <td>Date Range field for Forms.js.</td>
      <td><a class="link" href="https://www.npmjs.com/package/@forms.js/daterange-field" target="_blank">https://www.npmjs.com/package/@forms.js/daterange-field</a></td>
    </tr>
    <tr>
      <td><span class="font-bold">@formsjs/list-field</span></td>
      <td>List field for Forms.js.</td>
      <td><a class="link" href="https://www.npmjs.com/package/@forms.js/daterange-field" target="_blank">https://www.npmjs.com/package/@forms.js/list-field</a></td>
    </tr>
    <tr>
      <td><span class="font-bold">@formsjs/rating-field</span></td>
      <td>Rating field for Forms.js.</td>
      <td><a class="link" href="https://www.npmjs.com/package/@forms.js/daterange-field" target="_blank">https://www.npmjs.com/package/@forms.js/rating-field</a></td>
    </tr>
    <tr>
      <td><span class="font-bold">@formsjs/richtext-field</span></td>
      <td>Ritch Text field for Forms.js.</td>
      <td><a class="link" href="https://www.npmjs.com/package/@forms.js/daterange-field" target="_blank">https://www.npmjs.com/package/@forms.js/richtext-field</a></td>
    </tr>
    <tr>
      <td><span class="font-bold">@formsjs/tabs</span></td>
      <td>Tabs component for Forms.js.</td>
      <td><a class="link" href="https://www.npmjs.com/package/@forms.js/daterange-field" target="_blank">https://www.npmjs.com/package/@forms.js/tabs</a></td>
    </tr>
  </tbody>
</table>
