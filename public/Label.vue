<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: false,
  },
});
</script>
<template>
  <div>{{ data }}</div>
</template>
