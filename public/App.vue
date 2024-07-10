<script setup>
import { markRaw, ref } from "vue";
import FormComponent from "./js/vue/index.js";
import Label from "./Label.vue";

const form = ref(null);

const options = {
  id: "form",
  schema: [
    {
      id: "group",
      type: "group",
      label: Label,
    },
    {
      id: "select",
      type: "select",
      label: Label,
      conditions: (value, data) => {
        return data.password;
      },
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
        console.log(form.value?.reset());
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
    <span v-if="form">{{ form.errors }}</span>
  </div>
</template>
