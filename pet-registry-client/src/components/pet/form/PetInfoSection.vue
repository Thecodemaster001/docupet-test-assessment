<template>
  <div class="field">
    <label
      for="pet-name"
      class="field-label"
    >What is your {{ petType || 'pet' }}'s name?</label>
    <input
      id="pet-name"
      class="text-input"
      type="text"
      autocomplete="off"
      maxlength="50"
      :value="modelValue"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? 'pet-name-error' : undefined"
      @input="emit('update:modelValue', $event.target.value)"
    >
    <p
      v-if="error"
      id="pet-name-error"
      class="field-error"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  petType: { type: String, default: '' },
  error: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])
</script>
