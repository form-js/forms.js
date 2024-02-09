import { FormOptions } from '@forms.js/core/lib/interfaces';
import { Form as FormConstructor, PluginSettings, usePlugin } from '@forms.js/core';
import { PropType, defineComponent, h } from 'vue';

const Form = defineComponent({
  props: {
    options: {
      type: Object as PropType<FormOptions>,
      required: true,
    },
    plugins: {
        type: Array as PropType<PluginSettings[]> | Object as PropType<PluginSettings>,
        default: [],
        required: false
    }
  },

  data() {
    return {
      formInstance: null as FormConstructor | null,
    };
  },

  methods: {
    getForm(): FormConstructor | null {
      return this.formInstance as FormConstructor | null;
    },
  },

  render() {
    return h('div', {
      attrs: { 'data-formsjs-id': this.$props.options.id },
    });
  },

  mounted() {
    usePlugin(this.$props.plugins);
    this.formInstance = new FormConstructor(this.$el as HTMLElement, this.$props.options);
  },

  beforeUnmount() {
    const form = this.getForm();
    form?.destroy();
  },

  watch: {
    // check for option changes and rerender form
  },
});

export default Form;
