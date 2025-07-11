<template>
  <div class="space-y-2">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <textarea
        v-if="type === 'textarea'"
        :id="inputId"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        :class="inputClasses"
        @input="handleInput"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      <input
        v-else
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="inputClasses"
        @input="handleInput"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
    </div>
    <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    <p v-else-if="hint" class="text-sm text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'password' | 'email' | 'number' | 'textarea'
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  hint?: string
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  rows: 4,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => {
  const baseClasses = [
    'block w-full rounded-md border-0 py-1.5 px-3',
    'text-gray-900 dark:text-gray-100',
    'bg-white dark:bg-gray-800',
    'ring-1 ring-inset ring-gray-300 dark:ring-gray-600',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    'focus:ring-2 focus:ring-inset focus:ring-primary-600 dark:focus:ring-primary-500',
    'disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-900',
    'disabled:text-gray-500 dark:disabled:text-gray-400',
    'transition-colors duration-200',
  ]

  if (props.error) {
    baseClasses.push('ring-red-500 focus:ring-red-500')
  }

  if (props.type === 'textarea') {
    baseClasses.push('resize-vertical min-h-[100px]')
  }

  return baseClasses.join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}
</script>
