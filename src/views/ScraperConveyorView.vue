
<script setup>
import { computed, ref } from 'vue'

const availableProductivity = ref([25, 50, 100, 150, 200])
const availableAugerLength = computed(() => Array.from(Array(51).keys()).slice(3))
const availableMotors = [
  {
    title: 'Без двигуна',
    value: 0,
  },
  {
    title: '1.1 кВт',
    value: 1,
  },
]

const distributionMechanism = ref({
  included: false,
  length: 0,
  type: null,
})

const isValid = ref(false)
const motor = ref(0)
const productivity = ref()
const augerLength = ref()

const price = computed(() => {
  if (isValid.value) return productivity.value + augerLength.value
  return false
})



</script>

<template>
  <v-card class="ma-3" elevation="10" max-width="1200">
    <v-card-title>Транспортер шкребковий</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6">
          <v-img src="" alt="Product image"></v-img>
        </v-col>
        <v-col cols="12" sm="6">
          <v-form v-model="isValid">
            <v-select
              v-model="productivity"
              label="Продуктивність"
              :items="availableProductivity"
              :rules="[(value) => !!value || 'Обовʼязкове поле']"
            ></v-select>
            <v-select
              v-model="augerLength"
              label="Довжина шнеку"
              :items="availableAugerLength"
              :rules="[(value) => !!value || 'Обовʼязкове поле']"
            ></v-select>
            <fieldset>
              <v-checkbox
                v-model="distributionMechanism.included"
                label="Розподільчий механізм"
              ></v-checkbox>
              <v-text-field
                v-model="distributionMechanism.length"
                label="Довжина, м"
                :disabled="!distributionMechanism.included"
                prepend-icon="d"
                append-icon="d"
              ></v-text-field>
              <v-radio-group
                v-model="distributionMechanism.type"
                :disabled="!distributionMechanism.included"
              >
                <v-radio label="Оцинкований" value="zink"></v-radio>
                <v-radio label="Нержавіюча сталь" value="steel"></v-radio>
                <v-radio label="Порошкова покраска" value="paint"></v-radio>
              </v-radio-group>
            </fieldset>

            <v-select
              v-model="motor"
              :items="availableMotors"
              title-text="text"
              item-value="value"
              label="Мотор редуктор"
              class="mt-4"
            ></v-select>
          </v-form>

          <div>productivity: {{ productivity }}</div>
          <div>augerLength: {{ augerLength }}</div>
          <div>
            distributionMechanism:
            <pre>{{ distributionMechanism }}</pre>
          </div>
          <div>motor: {{ motor }}</div>
          <div>isValid: {{ isValid }}</div>
          <div>price: {{ price }}</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
