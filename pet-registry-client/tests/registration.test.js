import { describe, expect, it, vi } from 'vitest'
import {
  RegistrationError,
  breedsFor,
  describePet,
  emptyRegistration,
  isReadyToSubmit,
  submitRegistration,
  toPayload,
} from '../src/pet/registration'

const complete = (overrides = {}) => ({
  ...emptyRegistration(),
  petType: 'dog',
  petName: 'Biscuit',
  breed: 'Beagle',
  gender: 'female',
  ...overrides,
})

const jsonResponse = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(body),
})

describe('breedsFor', () => {
  it('returns the list for the chosen pet type and nothing before one is chosen', () => {
    expect(breedsFor('cat')).toContain('Maine Coon')
    expect(breedsFor('dog')).not.toContain('Maine Coon')
    expect(breedsFor('')).toEqual([])
  })
})

describe('isReadyToSubmit', () => {
  it('accepts a complete answer with a breed', () => {
    expect(isReadyToSubmit(complete())).toBe(true)
  })

  it.each([
    ['pet type', { petType: '' }],
    ['name', { petName: '   ' }],
    ['gender', { gender: '' }],
    ['breed', { breed: '' }],
    ['fallback once the breed was not found', { breed: '', breedNotFound: true }],
  ])('waits for the %s', (_, overrides) => {
    expect(isReadyToSubmit(complete(overrides))).toBe(false)
  })

  it('accepts a fallback instead of a breed', () => {
    expect(isReadyToSubmit(complete({ breed: '', breedNotFound: true, breedFallback: 'unknown' }))).toBe(true)
  })
})

describe('toPayload', () => {
  it('trims the name and sends the breed when one was picked', () => {
    expect(toPayload(complete({ petName: '  Biscuit ' }))).toEqual({
      petType: 'dog',
      petName: 'Biscuit',
      breed: 'Beagle',
      breedFallback: null,
      mixDescription: null,
      gender: 'female',
    })
  })

  it('sends the fallback and mix description instead of a breed', () => {
    const payload = toPayload(
      complete({ breed: 'Beagle', breedNotFound: true, breedFallback: 'mix', mixDescription: ' Lab cross ' }),
    )

    expect(payload).toMatchObject({ breed: null, breedFallback: 'mix', mixDescription: 'Lab cross' })
  })

  it('drops a mix description when the breed is unknown', () => {
    const payload = toPayload(complete({ breedNotFound: true, breedFallback: 'unknown', mixDescription: 'Lab' }))

    expect(payload.mixDescription).toBeNull()
  })
})

describe('submitRegistration', () => {
  const payload = toPayload(complete())

  it('posts JSON to the pet endpoint and resolves with the stored pet', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(201, { message: 'Pet registered.', pet: payload }))

    await expect(submitRegistration(payload, fetchMock)).resolves.toEqual(payload)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/api/v1/pet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
  })

  it('maps 422 violations onto fields, keeping the first message per field', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(422, {
        violations: [
          { propertyPath: 'petName', title: 'Name is empty.' },
          { propertyPath: 'petName', title: 'Second message.' },
          { propertyPath: 'gender', title: 'Choose female or male.' },
        ],
      }),
    )

    const error = await submitRegistration(payload, fetchMock).catch((e) => e)

    expect(error).toBeInstanceOf(RegistrationError)
    expect(error.fieldErrors).toEqual({ petName: 'Name is empty.', gender: 'Choose female or male.' })
  })

  it('explains an unreachable API', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(submitRegistration(payload, fetchMock)).rejects.toThrow("Couldn't reach the pet registry")
  })

  it('reports other HTTP errors with their status', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500, json: () => Promise.reject(new SyntaxError()) })

    await expect(submitRegistration(payload, fetchMock)).rejects.toThrow('HTTP 500')
  })
})

describe('describePet', () => {
  it('names the breed, the mix or the unknown breed', () => {
    const pet = { petName: 'Biscuit', petType: 'dog', gender: 'female', breed: 'Beagle' }

    expect(describePet(pet)).toBe('Biscuit, a female dog (Beagle)')
    expect(describePet({ ...pet, breed: null, breedFallback: 'mix', mixDescription: null })).toContain('(mixed breed)')
    expect(describePet({ ...pet, breed: null, breedFallback: 'unknown' })).toContain('(breed unknown)')
  })
})
