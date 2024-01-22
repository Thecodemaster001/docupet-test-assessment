import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { RegistrationError } from '../src/pet/registration'
import { useRegistration } from '../src/pet/useRegistration'

// The pet type goes first, as in the forms: changing it clears any breed answer.
async function fill(form) {
  form.petType = 'dog'
  await nextTick()
  Object.assign(form, { petName: 'Biscuit', breed: 'Beagle', gender: 'male' })
}

describe('useRegistration', () => {
  it('clears the breed answer when the pet type changes', async () => {
    const { form } = useRegistration(vi.fn())
    await fill(form)
    Object.assign(form, { breedNotFound: true, breedFallback: 'mix', mixDescription: 'Lab cross' })

    form.petType = 'cat'
    await nextTick()

    expect(form).toMatchObject({ breed: '', breedNotFound: false, breedFallback: '', mixDescription: '' })
  })

  it('does not submit an incomplete form', async () => {
    const submit = vi.fn()
    const { register } = useRegistration(submit)

    await register()

    expect(submit).not.toHaveBeenCalled()
  })

  it('stores the registered pet and resets for another one', async () => {
    const pet = { petName: 'Biscuit' }
    const submit = vi.fn().mockResolvedValue(pet)
    const { form, register, registeredPet, startOver } = useRegistration(submit)
    await fill(form)

    await register()

    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ petName: 'Biscuit', breed: 'Beagle' }))
    expect(registeredPet.value).toEqual(pet)

    startOver()
    expect(registeredPet.value).toBeNull()
    expect(form.petName).toBe('')
  })

  it('surfaces API errors per field', async () => {
    const submit = vi.fn().mockRejectedValue(new RegistrationError('Some answers need another look.', { petName: 'Too long.' }))
    const { form, register, errorMessage, fieldErrors, submitting } = useRegistration(submit)
    await fill(form)

    await register()

    expect(errorMessage.value).toBe('Some answers need another look.')
    expect(fieldErrors.value).toEqual({ petName: 'Too long.' })
    expect(submitting.value).toBe(false)
  })

  it('lets unexpected errors propagate instead of hiding them', async () => {
    const submit = vi.fn().mockRejectedValue(new ReferenceError('bug'))
    const { form, register } = useRegistration(submit)
    await fill(form)

    await expect(register()).rejects.toThrow(ReferenceError)
  })
})
