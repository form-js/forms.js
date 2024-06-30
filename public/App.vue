<script setup>
import { onMounted, ref } from "vue";
import FormComponent from "./js/vue/index.js";

const options = {
  id: "form",
  submit: () => {
    console.log("second submit");
  },
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
    },
    {
      id: "submit",
      type: "button",
      templete: "Test",
    },
  ],
};

const form = ref(null);

onMounted(() => {
  console.log(form.value);
});
</script>
<template>
  <div>
    <FormComponent
      ref="form"
      @submit="console.log('submit')"
      :options="options"
    />
    {{ form?.formData }}
  </div>
</template>
