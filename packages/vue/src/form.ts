import {
  Form,
  PluginSettings,
  usePlugin,
  FormOptions,
  FormData as Data,
  FormEvents,
  setLicenseKey,
} from '@forms.js/core';
import { PropType, defineComponent, h } from 'vue';

const FormComponent = defineComponent({
  props: {
    options: {
      type: Object as PropType<FormOptions>,
      required: true,
    },
    plugins: {
      type: Array as PropType<PluginSettings[]> | object as PropType<PluginSettings> | undefined,
      required: false,
      default: [],
    },
    licenseKey: {
      type: String as PropType<string | null>,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      formInstance: null as Form | null,
      formData: null as Data | null,
    };
  },

  methods: {
    reset() {
      this.formInstance?.reset();
    },
    validate() {
      this.formInstance?.validate();
    },
    submit() {
      this.formInstance?.submit();
    },
    getForm(): Form | null {
      return this.formInstance as Form | null;
    },
    getField(id: string) {
      return this.formInstance?.getField(id);
    },
    getGroup(id: string) {
      return this.formInstance?.getGroup(id);
    },
    getGroups() {
      return this.formInstance?.getGroups();
    },
    getButton(id: string) {
      return this.formInstance?.getButton(id);
    },
    getButtons() {
      return this.formInstance?.getButtons();
    },
    getData() {
      return this.formInstance?.getData();
    },
    getId() {
      return this.formInstance?.getId();
    },
    getFormElement() {
      return this.formInstance?.getFormElement();
    },
    isValid() {
      return this.formInstance?.isValid();
    },
    initForm() {
      this.formInstance = new Form(this.$el as HTMLDivElement, this.$props.options);
      this.formData = this.formInstance?.getData();
      this.formInstance?.on(
        FormEvents.Submitted,
        () => {
          this.$emit('submitted', this.formInstance?.getData() ?? null);
        },
        true,
      );
      this.formInstance?.on(
        FormEvents.Resetted,
        () => {
          this.$emit('resetted');
        },
        true,
      );
      this.formInstance?.on(
        FormEvents.DataUpdated,
        () => {
          this.formData = this.formInstance?.getData() ?? null;
          this.$emit('dataUpdated', this.formInstance?.getData() ?? null);
        },
        true,
      );
      this.formInstance?.on(
        FormEvents.ValidationFailed,
        () => {
          this.$emit('validationFailed');
        },
        true,
      );
    },
  },

  render() {
    return h('div');
  },

  mounted() {
    usePlugin(this.$props.plugins ?? []);
    if (this.$props.licenseKey) {
      setLicenseKey(this.$props.licenseKey);
    }
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

  emits: {
    submitted: (data: Data | null) => true,
    resetted: () => true,
    dataUpdated: (data: Data | null) => true,
    validationFailed: () => true,
  },
});

export default FormComponent;
