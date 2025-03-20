<script setup>
import {
  computed,
  ref,
  watch,
  watchEffect
} from 'vue'
import { useScrapperConveyorStore } from '@/stores/scrapperConveyor'

const isValid = ref(false)
const motor = ref(0)
const productivity = ref(0)
const transporterLength = ref(4)
const conveyorType = ref('solid')
const chainType = ref('')
const reducerType = ref('')
const reducerModel = ref('')

const scrapperConveyor = useScrapperConveyorStore()
scrapperConveyor.updateAll()

const availableProductivity = computed(() => {
  let value = [25, 50, 100, 150, 200, 300]
  if (scrapperConveyor.prices.length) {
    value = Array.from(new Set(scrapperConveyor.prices.map((item) => item.productivity)))
  }
  return value
})

const availableTransporterLength = computed(() => Array.from(Array(51).keys()).slice(4))

const availableByType = computed(() => {
  return scrapperConveyor.prices.filter(
    (item) =>
      item.conveyorType.split(',').includes(conveyorType.value) &&
      item.productivity === productivity.value,
  )
})

const availableChain = computed(() => {
  return availableByType.value.filter((item) => item.name.startsWith('ланцюг'))
})

const distributionMechanism = ref({
  included: false,
  length: 2,
})

const distributionMechanismAvailableLength = computed(() =>
  Array.from(Array(transporterLength.value - 1).keys()).slice(2),
)

const reducerAvailable = computed(() =>
  Array.from(new Set(scrapperConveyor.mr.map((item) => item.name))),
)

const reducerModelAvailable = computed(() => {
  const reducers = scrapperConveyor.mr.filter((item) => item.name === reducerType.value)
  return reducers.map((reducer) => {
    return {
      ...reducer,
      description: `${reducer.name} ${reducer.kWt} кВт ${reducer.gab} габарит`,
    }
  })
})

watch(reducerModelAvailable, () => {
  reducerModel.value = reducerModelAvailable.value[0]
})

watchEffect(() => {
  if (!scrapperConveyor.isLoading && scrapperConveyor.prices.length > 0) {
    productivity.value =
      availableProductivity.value.length > 0 ? availableProductivity.value[0] : null
    transporterLength.value =
      availableTransporterLength.value.length > 0 ? availableTransporterLength.value[0] : null
    chainType.value =
      availableChain.value && availableChain.value.length > 0 ? availableChain.value[0] : null
    reducerType.value = reducerAvailable.value[0]
  }
})
</script>

<template>
  <v-card class="ma-3" elevation="10" max-width="1200">
    <v-card-title> Транспортер шкребковий </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6">
          <v-img alt="Product image" src="banner22.jpg"></v-img>
        </v-col>
        <v-col cols="12" sm="6">
          <v-skeleton-loader v-if="scrapperConveyor.isLoading" type="article"></v-skeleton-loader>
          <v-form v-else v-model="isValid">
            <v-select
              v-model="productivity"
              :items="availableProductivity"
              :rules="[(value) => !!value || 'Обовʼязкове поле']"
              label="Продуктивність транспортера"
            ></v-select>

            <v-select
              v-model="transporterLength"
              :items="availableTransporterLength"
              :rules="[(value) => !!value || 'Обовʼязкове поле']"
              label="Довжина транспортера"
            ></v-select>

            <v-radio-group v-model="conveyorType" inline>
              <v-radio label="Зварний" value="solid"></v-radio>
              <v-radio label="Розбірний" value="collapsible"></v-radio>
            </v-radio-group>

            <v-select
              v-model="chainType"
              :items="availableChain"
              :rules="[(value) => !!value || 'Обовʼязкове поле']"
              item-title="name"
              item-value="name"
              label="Тип ланцюга"
            ></v-select>

            <fieldset>
              <v-checkbox
                v-model="distributionMechanism.included"
                label="Розподільчий механізм"
              ></v-checkbox>

              <v-select
                v-model="distributionMechanism.length"
                :disabled="!distributionMechanism.included"
                :items="distributionMechanismAvailableLength"
                append-icon="d"
                label="Довжина, м"
                prepend-icon="d"
              ></v-select>
            </fieldset>

            <v-radio-group v-model="reducerType" label="Тип редуктора" inline>
              <v-radio
                v-for="reducerItem in reducerAvailable"
                :label="reducerItem"
                :value="reducerItem"
                :key="reducerItem"
              />
            </v-radio-group>

            <v-select
              v-model="reducerModel"
              :items="reducerModelAvailable"
              item-title="description"
              label="Редуктор"
            ></v-select>
          </v-form>

          <div>
            scrapperConveyor:
            {{ scrapperConveyor.isLoading }}
          </div>
          <div>
            productivity:
            {{ productivity }}
          </div>
          <div>
            augerLength:
            {{ transporterLength }}
          </div>
          <div>
            distributionMechanism:
            <pre>{{ distributionMechanism }}</pre>
          </div>
          <div>
            motor:
            {{ motor }}
          </div>
          <div>
            isValid:
            {{ isValid }}
          </div>
          <div>
            reducerType:
            {{ reducerAvailable }}
            {{ reducerType }}
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
