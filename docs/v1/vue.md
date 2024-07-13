# Vue Component

Forms.js integrates with the Vue JavaScript framework. It provides a component that mathces the Form class.

### Instalation

```shell
$ npm i @forms.js/core @forms.js/vue
```

### Usage

```vue
<script>
import Form from "@forms.js/vue";

export default {
  components: {
    "forms-js": Form,
  },
  data: function () {
    return {
      options: {
        id: "demo-form",
        schema: [
          {
            id: "name",
            label: "Name",
            type: "text",
          },
        ],
      },
    };
  },
  methods: {
    handleFailedValidation() {
      //do stuff
    },
  },
};
</script>

<template>
  <div>
    <h1>Demo Form</h1>
    <forms-js :options="options" @validation-failed="handleFailedValidation" />
  </div>
</template>
```

### Props

- `options: FormOptions` - <span class="badge warning">required</span> The form options (<a href="https://formsjs.io/documentation/v1/form">see more</a>).
- `plugins: PluginSettings | PluginSettings[]` - if form needs to use any plugins you can pass them into the form through this options.
- `licenseKey: string` - if you want to use premium features you can assign your license key through this prop.

### Example

<iframe height="400" style="width: 100%;" scrolling="no" title="forms.js - vue example" src="https://codepen.io/trilmatic/embed/KKEGNjp?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/trilmatic/pen/KKEGNjp">
  forms.js - vue example</a> by Trilmatic (<a href="https://codepen.io/trilmatic">@trilmatic</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Component support

Vue component also brings a component support for some form element traits. You can now pass a vue component into field and group `label` option and also on static fields and buttons `template` option. You can see this in the example above. Reactive prop `formData` is passed into each component.

## Reference

You can access methods and variables through the component instance.

### Data

<table>
  <thead>
    <tr>
      <th>name</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>formData</code></td>
      <td>Reactive variable containing formData.</td>
    </tr>
    <tr>
      <td><code>formInstance</code></td>
      <td>Variable containing form instance.</td>
    </tr>
  </tbody>
</table>

### Supported methods

<table>
  <thead>
    <tr>
      <th>Function</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>getField(id)</code></td>
      <td>Fetches a specified field from the form by ID.</td>
    </tr>
    <tr>
      <td><code>getFormElement()</code></td>
      <td>Gets the main form element.</td>
    </tr>
    <tr>
      <td><code>getId()</code></td>
      <td>Gets the ID of the form.</td>
    </tr>
    <tr>
      <td><code>getData()</code></td>
      <td>Retrieves all data from the form.</td>
    </tr>
    <tr>
      <td><code>getButtons()</code></td>
      <td>Retrieves all buttons from the form.</td>
    </tr>
    <tr>
      <td><code>getButton(id)</code></td>
      <td>Fetches a specified button from the form by ID.</td>
    </tr>
    <tr>
      <td><code>getGroups()</code></td>
      <td>Fetches all groups present in the form.</td>
    </tr>
    <tr>
      <td><code>getGroup(id)</code></td>
      <td>Fetches a specified group from the form by ID.</td>
    </tr>
    <tr>
      <td><code>isValid()</code></td>
      <td>Returns <code>boolean</code> of current form validity state.</td>
    </tr>
    <tr>
      <td><code>reset(event)</code></td>
      <td>Resets all elements of the form.</td>
    </tr>
    <tr>
      <td><code>submit(event?)</code></td>
      <td>Submits the form manually.</td>
    </tr>
    <tr>
      <td><code>validate()</code></td>
      <td>Validates all fields of the form.</td>
    </tr>
    <tr>
      <td><code>getErrors()</code></td>
      <td>Returns array of ids of fields where are errors.</td>
    </tr>
  </tbody>
</table>

### Emits

<table>
  <thead>
    <tr>
      <th>Event</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>submitted</code></td>
      <td>Emits when form is submitted. Form data are passed as parameter.</td>
    </tr>
    <tr>
      <td><code>resetted</code></td>
      <td>Emits when form is resetted.</td>
    </tr>
    <tr>
      <td><code>dataUpdated</code></td>
      <td>Emits when form data are changed. Form data are passed as parameter.</td>
    </tr>
    <tr>
      <td><code>validationFailed</code></td>
      <td>Emits when form validation failed on form submit.</td>
    </tr>
  </tbody>
</table>

<h2 id="license">License</h2>

MIT. See more at <a href="https://formsjs.io/documentation/v1/licensing">licensing page</a>.
