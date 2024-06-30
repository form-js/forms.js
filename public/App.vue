<script setup>
import FormComponent from "./js/vue/index.js";

const options = {
  id: "form",
  schema: [
    {
      id: "select",
      type: "select",
      label: "Select",
      required: true,
      change: (value) => {
        console.log(value);
      },
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
  ],
};
</script>
<template>
  <FormComponent :options="options" />
</template>
