<template>
  <fieldset class="field">
    <legend class="field-label">
      {{ legend }}
    </legend>
    <div class="segmented">
      <label
        v-for="option in options"
        :key="option"
        class="segment"
        :class="{ 'is-selected': option === modelValue }"
      >
        <input
          type="radio"
          class="visually-hidden"
          :name="name"
          :value="option"
          :checked="option === modelValue"
          @change="emit('update:modelValue', option)"
        >
        {{ option.charAt(0).toUpperCase() + option.slice(1) }}
      </label>
    </div>
    <p
      v-if="error"
      class="field-error"
    >
      {{ error }}
    </p>
  </fieldset>
</template>

<script setup>
defineProps({
  legend: { type: String, required: true },
  name: { type: String, required: true },
  options: { type: Array, required: true },
  modelValue: { type: String, default: '' },
  error: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])
</script>
