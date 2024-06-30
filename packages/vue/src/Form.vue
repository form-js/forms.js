<script setup lang="ts">
import { Form as FormConstructor, PluginSettings, usePlugin, FormOptions } from '@forms.js/core';
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';

//Labels etc. as components, define emits

interface Props {
  options: FormOptions;
  plugins?: PluginSettings | PluginSettings[];
}

const props = withDefaults(defineProps<Props>(), {
  plugins: undefined,
});


const formInstance = ref<null | FormConstructor>(null);
const formContainer = ref<HTMLDivElement>();

const formData = computed(() => {
    if(!formInstance.value) return null;
    return formInstance.value.getData();
})

watch(()=> props.options, async () => {
    formInstance.value?.destroy();
    initForm();
},  { deep: true });

function initForm(){
    if(!formContainer.value) return;
    formInstance.value = new FormConstructor(formContainer.value, props.options);
}

onMounted(() => {
    usePlugin(props.plugins ?? []);
    initForm();
}),

onBeforeUnmount(() => {
    formInstance.value?.destroy();
}),
</script>
<template>
  <div ref="formContainer" class=""></div>
</template>
