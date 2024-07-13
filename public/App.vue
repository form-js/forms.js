<script setup>
import { markRaw, ref } from "vue";
import FormComponent from "./js/vue/index.js";
import Label from "./Label.vue";

const form = ref(null);

const options = {
  id: "form",
  schema: [
    {
      id: "name",
      label: "Name",
      type: "text",
    },
    {
      id: "static",
      type: "static",
      template: Label,
    },
  ],
};
</script>
<template>
  <div>
    <FormComponent
      ref="form"
      @submitted="(event) => console.log(event)"
      @data-updated="(event) => console.log(event)"
      @resetted="(event) => console.log(event)"
      @validation-failed="(event) => console.log(event)"
      :options="options"
    />
    <span v-if="form">{{ form.errors }}</span>
  </div>
</template>
