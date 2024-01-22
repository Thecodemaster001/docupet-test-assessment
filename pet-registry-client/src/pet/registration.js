export const PET_TYPES = ['dog', 'cat']
export const GENDERS = ['female', 'male']
export const BREED_NOT_FOUND = "Can't find it?"

export const BREEDS = {
  dog: [
    'Beagle',
    'Bulldog',
    'Dachshund',
    'German Shepherd',
    'Golden Retriever',
    'Labrador Retriever',
    'Poodle',
    'Rottweiler',
    'Shih Tzu',
    'Siberian Husky',
  ],
  cat: [
    'Abyssinian',
    'Bengal',
    'British Shorthair',
    'Maine Coon',
    'Norwegian Forest',
    'Persian',
    'Ragdoll',
    'Scottish Fold',
    'Siamese',
    'Sphynx',
  ],
}

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export function emptyRegistration() {
  return {
    petType: '',
    petName: '',
    breed: '',
    breedNotFound: false,
    breedFallback: '',
    mixDescription: '',
    gender: '',
  }
}

export function capitalise(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function breedsFor(petType) {
  return BREEDS[petType] ?? []
}

export function isReadyToSubmit(form) {
  const hasBreedAnswer = form.breedNotFound ? Boolean(form.breedFallback) : Boolean(form.breed)

  return Boolean(form.petType && form.petName.trim() && form.gender && hasBreedAnswer)
}

export function toPayload(form) {
  const isMix = form.breedNotFound && form.breedFallback === 'mix'

  return {
    petType: form.petType,
    petName: form.petName.trim(),
    breed: form.breedNotFound ? null : form.breed,
    breedFallback: form.breedNotFound ? form.breedFallback : null,
    mixDescription: isMix ? form.mixDescription.trim() || null : null,
    gender: form.gender,
  }
}

export class RegistrationError extends Error {
  constructor(message, fieldErrors = {}) {
    super(message)
    this.name = 'RegistrationError'
    this.fieldErrors = fieldErrors
  }
}

/**
 * Posts a registration to the API and resolves with the stored pet.
 * Rejects with a RegistrationError whose fieldErrors map API property paths to messages.
 */
export async function submitRegistration(payload, fetchImpl = globalThis.fetch) {
  let response
  try {
    response = await fetchImpl(`${API_URL}/api/v1/pet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new RegistrationError(`Couldn't reach the pet registry at ${API_URL}. Check that the API is running.`)
  }

  const body = await response.json().catch(() => ({}))

  if (response.ok) {
    return body.pet
  }

  if (response.status === 422 && Array.isArray(body.violations)) {
    const fieldErrors = {}
    for (const violation of body.violations) {
      fieldErrors[violation.propertyPath] ??= violation.title
    }
    throw new RegistrationError('Some answers need another look.', fieldErrors)
  }

  throw new RegistrationError(`The registry answered with an error (HTTP ${response.status}). Please try again.`)
}

export function describePet(pet) {
  const breed = pet.breed ?? (pet.breedFallback === 'mix' ? pet.mixDescription || 'mixed breed' : 'breed unknown')

  return `${pet.petName}, a ${pet.gender} ${pet.petType} (${breed})`
}
