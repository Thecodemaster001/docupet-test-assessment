import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import VuetifyPetForm from '../src/components/VuetifyPetForm.vue'

const mountForm = () =>
  mount(VuetifyPetForm, {
    global: { plugins: [createVuetify({ components })] },
    attachTo: document.body,
  })

describe('VuetifyPetForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('asks for the pet type before offering breeds', () => {
    const wrapper = mountForm()

    expect(wrapper.text()).toContain('Choose dog or cat first')
    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('submits the shared payload and confirms the registration', async () => {
    const pet = { petType: 'dog', petName: 'Biscuit', breed: 'Beagle', breedFallback: null, mixDescription: null, gender: 'female' }
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201, json: () => Promise.resolve({ pet }) })
    vi.stubGlobal('fetch', fetchMock)
    const wrapper = mountForm()

    const toggles = wrapper.findAll('.v-btn-toggle button')
    await toggles.find((b) => b.text() === 'dog').trigger('click')
    await wrapper.get('input[type="text"]').setValue('Biscuit')
    // Picking from the autocomplete menu needs layout jsdom doesn't have; emit the selection instead.
    wrapper.findComponent({ name: 'VAutocomplete' }).vm.$emit('update:modelValue', 'Beagle')
    await wrapper.findAll('.v-btn-toggle button').find((b) => b.text() === 'female').trigger('click')
    await flushPromises()

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(pet)
    expect(wrapper.text()).toContain('Biscuit is registered')
  })
})
