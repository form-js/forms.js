<h1 id="introduction">
    <a href="https://formsjs.io/" target="_blank">
        <img alt="Forms.js" style="margin: 0 auto" src="https://formsjs.io/images/banner.png" />
    </a>
</h1>

### Forms.js Vue Component

The official <a href="https://vuejs.org/" target="_blank">Vue</a> component for <a href="https://formsjs.io/" target="_blank">Forms.js</a>

<a href="https://formsjs.io/documentation/v1/getting-started" target="_blank">
    Official documentation
</a>

<h2 id="instalation">Instalation</h2>

### NPM

```bash
npm i @forms.js/core @forms.js/vue
```

### Usage

```vue
<script>
import Form from '@forms.js/vue';

export default {
  components: {
    Form,
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
    <Form :options="options" />
  </div>
</template>
```

### For more information:

<a href="https://formsjs.io/documentation/v1/getting-started" target="_blank">
    Take a look at official documentation!
</a>

### Support the project:

<p><a href="https://ko-fi.com/formsjs"> <img align="left" src="https://cdn.ko-fi.com/cdn/kofi3.png?v=3" height="50" width="210" alt="myaccount" /></a></p

<h2 id="license">License</h2>

Core bundle released under MIT license. This license permits a wide range of use, including free use in commercial projects, assuming all copyright headers are preserved. [Read the license terms](https://opensource.org/license/mit/)

