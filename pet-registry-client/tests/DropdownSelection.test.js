import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DropdownSelection from '../src/components/DropdownSelection.vue'

const options = ['Beagle', 'Bulldog', 'Poodle']

function mountPicker(props = {}) {
  return mount(DropdownSelection, {
    props: { id: 'breed', label: 'What breed are they?', options, ...props },
    attachTo: document.body,
  })
}

const visibleOptions = (wrapper) => wrapper.findAll('[role="option"]').map((option) => option.text())

describe('DropdownSelection', () => {
  it('filters options as you type and always offers the not-found choice', async () => {
    const wrapper = mountPicker()

    await wrapper.get('input').setValue('bul')

    expect(visibleOptions(wrapper)).toEqual(['Bulldog', "Can't find it?"])
    expect(wrapper.get('input').attributes('aria-expanded')).toBe('true')
  })

  it('commits a typed breed only when it matches exactly', async () => {
    const wrapper = mountPicker()
    const input = wrapper.get('input')

    await input.setValue('Beag')
    await input.setValue('beagle')

    expect(wrapper.emitted('update:modelValue')).toEqual([[''], ['Beagle']])
  })

  it('selects with the arrow keys and Enter', async () => {
    const wrapper = mountPicker()
    const input = wrapper.get('input')

    await input.setValue('o')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(input.attributes('aria-activedescendant')).toBe('breed-option-1')

    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['Poodle'])
    expect(input.element.value).toBe('Poodle')
    expect(input.attributes('aria-expanded')).toBe('false')
  })

  it('reports the not-found choice instead of using it as a breed', async () => {
    const wrapper = mountPicker()

    await wrapper.get('input').trigger('focus')
    await wrapper.findAll('[role="option"]').at(-1).trigger('mousedown')

    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([''])
    expect(wrapper.emitted('update:notFound').at(-1)).toEqual([true])
  })

  it('clears the text when the option list changes', async () => {
    const wrapper = mountPicker()
    await wrapper.get('input').setValue('Beagle')

    await wrapper.setProps({ options: ['Persian'] })

    expect(wrapper.get('input').element.value).toBe('')
  })
})
