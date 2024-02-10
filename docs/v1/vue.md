# Vue Component

Forms.js integrates with the Vue JavaScript framework. It provides a component that mathces the Form class.

### Usage

```javascript
<script>
import Form from '@forms.js/vue';

export default {
  components: {
    'forms-js': Form,
  },
  data: function () {
    return {
      options: {
        id: 'demo-form',
        schema: [
          {
            id: 'name',
            label: 'Name',
            type: 'text',
          },
        ],
      },
    };
  },
};
</script>

<template>
  <div>
    <h1>Demo Form</h1>
    <forms-js :options="options" />
  </div>
</template>
```

### Props
The component supports two props:

-   `options: FormOptions` - <span class="badge warning">required</span> The form options (<a href="https://formsjs.io/documentation/v1/form">see more</a>).
-   `plugins: PluginSettings | PluginSettings[]` - if form needs to use any plugins you can pass them into the form through this options.

### Example

<iframe height="400" style="width: 100%;" scrolling="no" title="forms.js - vue example" src="https://codepen.io/trilmatic/embed/KKEGNjp?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/trilmatic/pen/KKEGNjp">
  forms.js - vue example</a> by Trilmatic (<a href="https://codepen.io/trilmatic">@trilmatic</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

Vue component currently does not support templating, the feature is being developed.

<h2 id="license">License</h2>

MIT. See more at <a href="https://formsjs.io/documentation/v1/licensing">licensing page</a>.