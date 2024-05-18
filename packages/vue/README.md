<div align="center">

![Forms.js](https://formsjs.io/images/formsjs-banner.png)

</div>

<p align="center">
    <a href="https://formsjs.io/"><b>Website</b></a> •
    <a href="https://formsjs.io/documentation/v1/getting-started"><b>Documentation</b></a>
</p>

# Forms.js Vue Component

The official <a href="https://vuejs.org/" target="_blank">Vue</a> component for <a href="https://formsjs.io/" target="_blank">Forms.js</a>

[Get Started with Forms.js](https://formsjs.io/documentation/v1/getting-started) ⚡️

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

Dive deeper into Forms.js with the [official documentation](https://formsjs.io/documentation/v1/getting-started)

### Support Forms.js Development:

Purchase an software [license](https://formsjs.io/pricing).


## Contributing

If you want to contribute look at <a class="link" target="_blank" href="https://github.com/form-js/forms.js/blob/master/CONTRIBUTING.md">CONTRIBUTING.md</a>.

## License

Core bundle released under MIT license. This license permits a wide range of use, including free use in commercial projects, assuming all copyright headers are preserved. [Read the license terms](https://opensource.org/license/mit/)

