import { computed, reactive, ref, watch } from 'vue'
import {
  RegistrationError,
  breedsFor,
  emptyRegistration,
  isReadyToSubmit,
  submitRegistration,
  toPayload,
} from './registration'

/**
 * Form state shared by both registration forms, so the Vuetify and the
 * hand-built version can't drift apart in what they send.
 */
export function useRegistration(submit = submitRegistration) {
  const form = reactive(emptyRegistration())
  const submitting = ref(false)
  const fieldErrors = ref({})
  const errorMessage = ref('')
  const registeredPet = ref(null)

  const breeds = computed(() => breedsFor(form.petType))
  const canSubmit = computed(() => isReadyToSubmit(form) && !submitting.value)

  // A breed only makes sense for the pet type it was picked under.
  watch(
    () => form.petType,
    () => {
      form.breed = ''
      form.breedNotFound = false
      form.breedFallback = ''
      form.mixDescription = ''
    },
  )

  async function register() {
    if (!canSubmit.value) {
      return
    }
    submitting.value = true
    fieldErrors.value = {}
    errorMessage.value = ''
    try {
      registeredPet.value = await submit(toPayload(form))
    } catch (error) {
      if (!(error instanceof RegistrationError)) {
        throw error
      }
      errorMessage.value = error.message
      fieldErrors.value = error.fieldErrors
    } finally {
      submitting.value = false
    }
  }

  function startOver() {
    Object.assign(form, emptyRegistration())
    registeredPet.value = null
    fieldErrors.value = {}
    errorMessage.value = ''
  }

  return { form, breeds, canSubmit, submitting, fieldErrors, errorMessage, registeredPet, register, startOver }
}
