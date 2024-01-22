<template>
  <div
    class="field combobox"
    @focusout="onFocusOut"
  >
    <label
      :for="id"
      class="field-label"
    >{{ label }}</label>
    <input
      :id="id"
      class="text-input"
      type="text"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-controls="`${id}-listbox`"
      :aria-activedescendant="activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined"
      :aria-invalid="error ? 'true' : undefined"
      :disabled="disabled"
      :placeholder="placeholder"
      :value="query"
      @input="onInput($event.target.value)"
      @focus="isOpen = true"
      @keydown.down.prevent="move(1)"
      @keydown.up.prevent="move(-1)"
      @keydown.enter="onEnter"
      @keydown.esc="isOpen = false"
    >
    <ul
      v-show="isOpen && !disabled"
      :id="`${id}-listbox`"
      class="combobox-list"
      role="listbox"
      :aria-label="label"
    >
      <li
        v-for="(item, index) in items"
        :id="`${id}-option-${index}`"
        :key="item"
        role="option"
        class="combobox-option"
        :class="{ 'is-active': index === activeIndex, 'is-fallback': item === notFoundOption }"
        :aria-selected="index === activeIndex ? 'true' : 'false'"
        @mousedown.prevent="choose(item)"
      >
        {{ item }}
      </li>
    </ul>
    <p
      v-if="error"
      class="field-error"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  options: { type: Array, default: () => [] },
  modelValue: { type: String, default: '' },
  notFound: { type: Boolean, default: false },
  notFoundOption: { type: String, default: "Can't find it?" },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'update:notFound'])

const query = ref(props.notFound ? props.notFoundOption : props.modelValue)
const isOpen = ref(false)
const activeIndex = ref(-1)

const items = computed(() => {
  const needle = query.value.trim().toLowerCase()
  const matches = needle && query.value !== props.notFoundOption
    ? props.options.filter((option) => option.toLowerCase().includes(needle))
    : props.options

  return [...matches, props.notFoundOption]
})

// A new pet type means a new breed list; drop whatever was typed for the old one.
watch(() => props.options, () => {
  query.value = ''
})

function onInput(value) {
  const exact = props.options.find((option) => option.toLowerCase() === value.trim().toLowerCase())
  query.value = value
  isOpen.value = !exact
  activeIndex.value = -1
  emit('update:modelValue', exact ?? '')
  emit('update:notFound', false)
}

function choose(item) {
  const notFound = item === props.notFoundOption
  query.value = item
  isOpen.value = false
  activeIndex.value = -1
  emit('update:modelValue', notFound ? '' : item)
  emit('update:notFound', notFound)
}

function move(step) {
  isOpen.value = true
  const count = items.value.length
  activeIndex.value = (activeIndex.value + step + count) % count
}

function onEnter(event) {
  if (isOpen.value && activeIndex.value >= 0) {
    event.preventDefault()
    choose(items.value[activeIndex.value])
  }
}

function onFocusOut(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    isOpen.value = false
  }
}
</script>
