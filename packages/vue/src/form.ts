import {
  Form,
  PluginSettings,
  usePlugin,
  FormOptions,
  FormData as Data,
  FormEvents,
  setLicenseKey,
} from '@forms.js/core';
import { PropType, defineComponent, h, createApp, Component, ref } from 'vue';

const formData = ref<null | Data>(null);

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
      processedOptions: {} as FormOptions,
      disableOptionUpdates: false,
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
    getErrors() {
      return this.formInstance?.getErrors();
    },
    async initForm() {
      this.disableOptionUpdates = true;
      this.processedOptions = (await this.resolveVNodes({ ...this.$props.options })) as unknown as FormOptions;
      this.formInstance = new Form(this.$el as HTMLDivElement, this.processedOptions);
      this.disableOptionUpdates = false;
      formData.value = { ...this.formInstance?.getData() };
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
          formData.value = { ...this.formInstance?.getData() } ?? null;
          this.$emit('dataUpdated', formData.value ?? null);
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
    isRenderable(param: unknown) {
      return param && typeof param === 'object' && Object.prototype.hasOwnProperty.call(param, 'render');
    },
    acceptVNode(key: string, record: Record<string, unknown>, mutator: string = '') {
      if (record.id && this.isRenderable(record[key])) {
        const renderer = record[key] as Component;
        record[key] = () => {
          const div = document.createElement('div');
          createApp({
            render: () => h(renderer, { formData: formData.value }),
          }).mount(div);
          return div;
        };
      }
    },
    async resolveVNodes(parent: Record<string, unknown>) {
      if (parent.schema) {
        const schema = parent.schema as Record<string, unknown>[];
        parent.schema = await Promise.all(
          schema.map(async (record: Record<string, unknown>) => {
            this.acceptVNode('label', record, '_label');
            this.acceptVNode('template', record);
            if (record.shcema) {
              record = await this.resolveVNodes(record);
            }
            return record;
          }),
        );
      }
      return parent;
    },
  },

  render() {
    return h('div');
  },

  computed: {
    data() {
      return formData.value;
    },
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
        if (this.disableOptionUpdates) return;
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
