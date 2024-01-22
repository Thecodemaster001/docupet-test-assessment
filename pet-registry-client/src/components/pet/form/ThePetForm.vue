<template>
  <section
    class="panel"
    aria-labelledby="generic-form-title"
  >
    <template v-if="registeredPet">
      <div
        class="notice notice--success"
        role="status"
      >
        <h1
          id="generic-form-title"
          class="panel-title"
        >
          {{ registeredPet.petName }} is registered
        </h1>
        <p>{{ describePet(registeredPet) }}.</p>
      </div>
      <button
        type="button"
        class="button"
        @click="startOver"
      >
        Register another pet
      </button>
    </template>

    <form
      v-else
      novalidate
      @submit.prevent="register"
    >
      <h1
        id="generic-form-title"
        class="panel-title"
      >
        Tell us about your {{ form.petType || 'pet' }}
      </h1>

      <TagSelect
        v-model="form.petType"
        legend="Type of pet?"
        name="pet-type"
        :options="PET_TYPES"
        :error="fieldErrors.petType"
      />

      <PetInfoSection
        v-model="form.petName"
        :pet-type="form.petType"
        :error="fieldErrors.petName"
      />

      <DropdownSelection
        id="breed"
        v-model="form.breed"
        v-model:not-found="form.breedNotFound"
        label="What breed are they?"
        :options="breeds"
        :not-found-option="BREED_NOT_FOUND"
        :disabled="!form.petType"
        :placeholder="form.petType ? 'Start typing a breed' : 'Choose dog or cat first'"
        :error="fieldErrors.breed"
      />

      <BreedNotFoundOptions
        v-if="form.breedNotFound"
        v-model:fallback="form.breedFallback"
        v-model:mix-description="form.mixDescription"
        :error="fieldErrors.breedFallback || fieldErrors.mixDescription"
      />

      <TagSelect
        v-model="form.gender"
        legend="What gender are they?"
        name="gender"
        :options="GENDERS"
        :error="fieldErrors.gender"
      />

      <p
        v-if="errorMessage"
        class="notice notice--error"
        role="alert"
      >
        {{ errorMessage }}
      </p>

      <div class="actions">
        <button
          class="button"
          type="submit"
          :disabled="!canSubmit"
          :aria-busy="submitting ? 'true' : 'false'"
        >
          {{ submitting ? 'Saving…' : 'Continue' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import DropdownSelection from '../../DropdownSelection.vue'
import TagSelect from '../../TagSelect.vue'
import BreedNotFoundOptions from './BreedNotFoundOptions.vue'
import PetInfoSection from './PetInfoSection.vue'
import { BREED_NOT_FOUND, GENDERS, PET_TYPES, describePet } from '../../../pet/registration'
import { useRegistration } from '../../../pet/useRegistration'

const { form, breeds, canSubmit, submitting, fieldErrors, errorMessage, registeredPet, register, startOver } =
  useRegistration()
</script>
