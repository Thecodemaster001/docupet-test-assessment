import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ThePetForm from '../src/components/pet/form/ThePetForm.vue'

function respondWith(status, body) {
  const fetchMock = vi.fn().mockResolvedValue({ ok: status < 300, status, json: () => Promise.resolve(body) })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

async function fillIn(wrapper) {
  await wrapper.get('input[name="pet-type"][value="cat"]').setValue(true)
  await wrapper.get('#pet-name').setValue('Pickle')
  const breed = wrapper.get('#breed')
  await breed.trigger('focus')
  await wrapper.findAll('[role="option"]').at(-1).trigger('mousedown')
  await wrapper.get('input[name="breed-fallback"][value="mix"]').setValue(true)
  await wrapper.get('#mix-description').setValue('Tabby and Siamese')
  await wrapper.get('input[name="gender"][value="male"]').setValue(true)
}

describe('ThePetForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('keeps Continue disabled until every question is answered', async () => {
    const wrapper = mount(ThePetForm, { attachTo: document.body })
    const submit = () => wrapper.get('button[type="submit"]')

    expect(submit().attributes('disabled')).toBeDefined()
    expect(wrapper.get('#breed').attributes('disabled')).toBeDefined()

    await fillIn(wrapper)

    expect(submit().attributes('disabled')).toBeUndefined()
    expect(wrapper.get('h1').text()).toBe('Tell us about your cat')
  })

  it('posts a mixed-breed cat and shows the confirmation', async () => {
    const pet = {
      petType: 'cat',
      petName: 'Pickle',
      breed: null,
      breedFallback: 'mix',
      mixDescription: 'Tabby and Siamese',
      gender: 'male',
    }
    const fetchMock = respondWith(201, { message: 'Pet registered.', pet })
    const wrapper = mount(ThePetForm, { attachTo: document.body })
    await fillIn(wrapper)

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(pet)
    expect(wrapper.get('[role="status"]').text()).toContain('Pickle is registered')
    expect(wrapper.text()).toContain('Pickle, a male cat (Tabby and Siamese)')
  })

  it('shows API validation messages next to the form', async () => {
    respondWith(422, { violations: [{ propertyPath: 'gender', title: 'Choose female or male.' }] })
    const wrapper = mount(ThePetForm, { attachTo: document.body })
    await fillIn(wrapper)

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toBe('Some answers need another look.')
    expect(wrapper.text()).toContain('Choose female or male.')
  })
})
