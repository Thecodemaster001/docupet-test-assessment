<template>
  <v-sheet
    class="panel"
    tag="section"
    aria-labelledby="vuetify-form-title"
  >
    <template v-if="registeredPet">
      <v-alert
        type="success"
        variant="tonal"
        role="status"
        class="mb-4"
      >
        <h1
          id="vuetify-form-title"
          class="panel-title"
        >
          {{ registeredPet.petName }} is registered
        </h1>
        {{ describePet(registeredPet) }}.
      </v-alert>
      <v-btn
        color="primary"
        @click="startOver"
      >
        Register another pet
      </v-btn>
    </template>

    <v-form
      v-else
      @submit.prevent="register"
    >
      <h1
        id="vuetify-form-title"
        class="panel-title"
      >
        Tell us about your {{ form.petType || 'pet' }}
      </h1>

      <fieldset class="field">
        <legend class="field-label">
          Type of pet?
        </legend>
        <v-btn-toggle
          v-model="form.petType"
          variant="outlined"
          selected-class="bg-primary"
          divided
        >
          <v-btn
            v-for="type in PET_TYPES"
            :key="type"
            :value="type"
          >
            {{ capitalise(type) }}
          </v-btn>
        </v-btn-toggle>
        <p
          v-if="fieldErrors.petType"
          class="field-error"
        >
          {{ fieldErrors.petType }}
        </p>
      </fieldset>

      <v-text-field
        v-model="form.petName"
        :label="`What is your ${form.petType || 'pet'}'s name?`"
        variant="outlined"
        maxlength="50"
        :error-messages="fieldErrors.petName"
      />

      <v-autocomplete
        v-model="breedChoice"
        label="What breed are they?"
        :items="[...breeds, BREED_NOT_FOUND]"
        :disabled="!form.petType"
        :hint="form.petType ? '' : 'Choose dog or cat first'"
        persistent-hint
        variant="outlined"
        :error-messages="fieldErrors.breed"
      />

      <template v-if="form.breedNotFound">
        <v-radio-group
          v-model="form.breedFallback"
          label="No match? Tell us what you know"
          :error-messages="fieldErrors.breedFallback"
        >
          <v-radio
            label="I don't know"
            value="unknown"
          />
          <v-radio
            label="It's a mix"
            value="mix"
          />
        </v-radio-group>
        <v-text-field
          v-if="form.breedFallback === 'mix'"
          v-model="form.mixDescription"
          label="Which breeds, if you know? (optional)"
          variant="outlined"
          maxlength="100"
          :error-messages="fieldErrors.mixDescription"
        />
      </template>

      <fieldset class="field">
        <legend class="field-label">
          What gender are they?
        </legend>
        <v-btn-toggle
          v-model="form.gender"
          variant="outlined"
          selected-class="bg-primary"
          divided
        >
          <v-btn
            v-for="gender in GENDERS"
            :key="gender"
            :value="gender"
          >
            {{ capitalise(gender) }}
          </v-btn>
        </v-btn-toggle>
        <p
          v-if="fieldErrors.gender"
          class="field-error"
        >
          {{ fieldErrors.gender }}
        </p>
      </fieldset>

      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        role="alert"
        class="mb-4"
      >
        {{ errorMessage }}
      </v-alert>

      <div class="actions">
        <v-btn
          type="submit"
          color="primary"
          size="large"
          :disabled="!canSubmit"
          :loading="submitting"
        >
          Continue
        </v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>

<script setup>
import { computed } from 'vue'
import { BREED_NOT_FOUND, GENDERS, PET_TYPES, capitalise, describePet } from '../pet/registration'
import { useRegistration } from '../pet/useRegistration'

const { form, breeds, canSubmit, submitting, fieldErrors, errorMessage, registeredPet, register, startOver } =
  useRegistration()

const breedChoice = computed({
  get: () => (form.breedNotFound ? BREED_NOT_FOUND : form.breed || null),
  set: (value) => {
    form.breedNotFound = value === BREED_NOT_FOUND
    form.breed = form.breedNotFound ? '' : value ?? ''
    if (!form.breedNotFound) {
      form.breedFallback = ''
      form.mixDescription = ''
    }
  },
})
</script>
