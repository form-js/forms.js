import { FormOptions } from '@forms.js/core/lib/interfaces';
import { Form as FormConstructor, PluginSettings, usePlugin } from '@forms.js/core';
import { PropType, defineComponent, h } from 'vue';

const Form = defineComponent({
    props: {
        options: {
            type: Object as PropType<FormOptions>,
            required: true
        }
    },

    data() {
        return {
            formInstance: null as FormConstructor | null
        }
    },

    methods: {
        getForm(): FormConstructor | null {
            return this.formInstance as FormConstructor | null;
        },
        usePlugin(pluginSettings: PluginSettings | PluginSettings[]) {
            usePlugin(pluginSettings);
        }
    },

    render() {
        return h('div', {
            attrs: { 'data-formsjs-id': this.$props.options.id }
        })
    },

    mounted() {
        this.formInstance = new FormConstructor(this.$el as HTMLElement, this.$props.options);
    },

    beforeUnmount() {
        const form = this.getForm();
        form.destroy();
    },

    watch: {
        // check for option changes and rerender form
    },
})

export default Form