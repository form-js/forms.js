<script setup>
import { ref } from "vue";
import FormComponent from "./js/vue/index.js";

const form = ref(null);

const options = {
  id: "form",
  schema: [
    {
      id: "select",
      type: "select",
      label: "Select",
      required: true,
      optionsList: [
        {
          value: "vincent_van_gogh",
          label: "Vincent van Gogh",
          group: "painters",
        },
        { value: "pablo_picasso", label: "Pablo Picasso", group: "painters" },
      ],
    },
    {
      id: "password",
      type: "password",
      allowPeek: true,
      label: "Pasword",
      required: true,
    },
    {
      id: "submit",
      type: "button",
      templete: "Test",
    },
    {
      id: "reset",
      type: "button",
      template: "Reset",
      buttonType: "button",
      click: () => {
        console.log(form.value?.getId());
      },
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
    <span v-if="form">{{ form.formData }}</span>
  </div>
</template>
