<template>
  <fieldset class="field breed-fallback">
    <legend class="field-label">
      No match? Tell us what you know
    </legend>
    <label class="choice">
      <input
        type="radio"
        name="breed-fallback"
        value="unknown"
        :checked="fallback === 'unknown'"
        @change="emit('update:fallback', 'unknown')"
      >
      I don't know
    </label>
    <label class="choice">
      <input
        type="radio"
        name="breed-fallback"
        value="mix"
        :checked="fallback === 'mix'"
        @change="emit('update:fallback', 'mix')"
      >
      It's a mix
    </label>
    <div
      v-if="fallback === 'mix'"
      class="mix-details"
    >
      <label
        for="mix-description"
        class="field-label field-label--small"
      >Which breeds, if you know? (optional)</label>
      <input
        id="mix-description"
        class="text-input"
        type="text"
        maxlength="100"
        :value="mixDescription"
        @input="emit('update:mixDescription', $event.target.value)"
      >
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
  fallback: { type: String, default: '' },
  mixDescription: { type: String, default: '' },
  error: { type: String, default: '' },
})

const emit = defineEmits(['update:fallback', 'update:mixDescription'])
</script>
