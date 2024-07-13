<script setup>
const props = defineProps({
  formData: {
    type: Object,
    required: false,
  },
});
</script>
<template>
  <div>{{ formData }}</div>
</template>
