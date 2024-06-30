import { Form as FormConstructor, PluginSettings, usePlugin, FormOptions, FormData as Data } from '@forms.js/core';
import { PropType, defineComponent, h } from 'vue';

const Form = defineComponent({
  props: {
    options: {
      type: Object as PropType<FormOptions>,
      required: true,
    },
    plugins: {
      type: Array as PropType<PluginSettings[]> | object as PropType<PluginSettings> | undefined,
      required: false,
    },
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
    initForm() {
      this.formInstance = new FormConstructor(this.$el as HTMLDivElement, this.$props.options);
      const formElement = this.formInstance.getFormElement();
      formElement?.addEventListener('submit', () => {
        this.$emit('submit', this.formData ?? null);
      });
    },
  },

  render() {
    return h('div');
  },

  mounted() {
    usePlugin(this.$props.plugins ?? []);
    this.initForm();
  },

  beforeUnmount() {
    this.formInstance?.destroy();
  },

  watch: {
    options: {
      handler: function () {
        this.formInstance?.destroy();
        this.initForm();
      },
      deep: true,
    },
  },

  computed: {
    formData: function () {
      return this.formInstance?.getData();
    },
  },

  emits: {
    submit: (data: Data | null) => true,
  },
});

export default Form;
