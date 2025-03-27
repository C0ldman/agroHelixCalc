<script
  setup>
import {
  computed,
  ref,
  watch,
  watchEffect
} from 'vue'
import {
  useScrapperConveyorStore
} from '@/stores/scrapperConveyor'

const isValid = ref(false)
const productivity = ref(0)
const transporterLength = ref(4)
const conveyorType = ref()
const chainType = ref('')
const reducerType = ref('')
const reducerModel = ref('')
const coverageType = ref([])

const scrapperConveyor = useScrapperConveyorStore();
scrapperConveyor.updateAll();

const availableProductivity = computed(() => {
  let value = [25, 50, 100, 150, 200, 300];
  if (scrapperConveyor.prices.length) {
    value = Array.from(new Set(scrapperConveyor.prices.map((item) => item.productivity)))
  }
  return value
})

const availableByProductivity = computed(() => {
  return scrapperConveyor.prices.filter(
    (item) =>
      item.productivity === productivity.value,
  )
})

const availableConveyorType = computed(() => {
  const list = availableByProductivity.value.map((item) => item.conveyorType.split(',')).flat(Infinity);
  const conveyor = Array.from(new Set(list.map(item => item.trim())));
  return conveyor.map((item) => {
    return {
      value: item,
      name: item === 'solid' ? 'Зварний' : 'Розбірний',
    }
  })
})

const availableByType = computed(() => {
  return availableByProductivity.value.filter(
    (item) => {
      const items = item.conveyorType.split(',').map(item => item.trim())
      return items.includes(conveyorType.value)
    }
  )
})

const availableChain = computed(() => {
  return availableByType.value.filter((item) => item.name.startsWith('ланцюг'))
})

const availableDistributionMechanismLength = computed(() =>
  Array.from(Array(transporterLength.value - 1).keys()).slice(2),
)

const availableReducer = computed(() =>
  Array.from(new Set(scrapperConveyor.mr.map((item) => item.name))),
)

const availableCoverage = computed(() => {
    const Regexp = /емаль|грунт|порошкове|цинк/;
    return availableByType.value.filter((item) => {
      return Regexp.test(item.name)
    })
  }
)

const availableLining = computed(() => {
    const Regexp = /футерува́ння/;
    return availableByType.value.filter((item) => {
      return Regexp.test(item.name)
    })
  }
)

const availableReducerModel = computed(() => {
  const reducers = scrapperConveyor.mr.filter((item) => item.name === reducerType.value)
  return reducers.map((reducer) => {
    return {
      ...reducer,
      description: `${reducer.name} ${reducer.kWt} кВт ${reducer.gab} габарит`,
    }
  })
})

const distributionMechanism = ref({
  included: false,
  length: 2,
})
const lining = ref({
  included: false,
  value: 2,
})

watch(availableReducerModel, () => {
  reducerModel.value = availableReducerModel.value[0]
})

watchEffect(() => {
  if (!scrapperConveyor.isLoading && scrapperConveyor.prices.length > 0) {
    productivity.value =
      availableProductivity.value.length > 0 ? availableProductivity.value[0] : [];
  }
})

watchEffect(() => {
  if (!scrapperConveyor.isLoading && scrapperConveyor.prices.length > 0) {
    conveyorType.value = availableConveyorType.value.length > 0 ? availableConveyorType.value[0].value : '';
    reducerType.value = availableReducer.value[0];
  }
})

watchEffect(() => {
  if (!scrapperConveyor.isLoading && scrapperConveyor.prices.length > 0) {
    chainType.value =
      availableChain.value && availableChain.value.length > 0 ? availableChain.value[0] : null;
  }
})

watchEffect(() => {
  if (!scrapperConveyor.isLoading && scrapperConveyor.prices.length > 0) {
    coverageType.value = availableCoverage.value.length > 0 ? availableCoverage.value[0] : [];
  }
})

watchEffect(() => {
  if (!scrapperConveyor.isLoading && scrapperConveyor.prices.length > 0) {
    lining.value.value = availableLining.value.length > 0 ? availableLining.value[0] : [];
  }
})

const price = computed(() => {
  if (!scrapperConveyor.isLoading && scrapperConveyor.prices.length > 0) {
    let price = 0;
    const tensionSection = availableByType.value.find((item) => item.name.includes('натяжна'));
    const driveSection = availableByType.value.find((item) => item.name.includes('привідна'));
    const tensionSectionPrice = Number(tensionSection.price);
    const driveSectionPrice = Number(driveSection.price);

    price= tensionSectionPrice + driveSectionPrice;
    return price;
  }
  return 0;
})

</script>

<template>
  <v-card
    class="ma-3"
    elevation="10"
    max-width="1200">
    <v-card-title>
      Транспортер
      шкребковий
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          cols="12"
          sm="6">
          <v-img
            alt="Product image"
            src="banner22.jpg"></v-img>
          <div>price : {{price}}</div>
          <div>productivity : <pre>{{productivity}}</pre></div>
          <div>transporterLength: <pre>{{ transporterLength}}</pre></div>
          <div>conveyorType :<pre>{{ conveyorType}}</pre></div>
          <div>chainType: <pre>{{chainType}}</pre></div>
          <div>distributionMechanism: <pre>{{ distributionMechanism }}</pre></div>
          <div>reducerModel: <pre>{{reducerModel}}</pre></div>
          <div>coverageType:<pre>{{coverageType}}</pre></div>
          <div>Lining:<pre>{{lining}}</pre></div>
        </v-col>
        <v-col
          cols="12"
          sm="6">
          <v-skeleton-loader
            v-if="scrapperConveyor.isLoading"
            type="article"></v-skeleton-loader>
          <v-form
            v-else
            v-model="isValid">
            <v-select
              v-model="productivity"
              :items="availableProductivity"
              :rules="[(value) => !!value || 'Обовʼязкове поле']"
              label="Продуктивність транспортера"
            ></v-select>

            <v-text-field
              v-model="transporterLength"
              type="number"
              :rules="[(value) => !!value || 'Обовʼязкове поле', (value) => value >=4 || 'Мінімальна довжина 4', (value) => value <= 100 || 'Максимальна довжина 100', (value) => value === Math.floor(value)|| 'Тільки цілі числа']"
              label="Довжина транспортера"
            ></v-text-field>

            <v-radio-group
              v-model="conveyorType"
              inline>
              <v-radio
                v-for="conveyor in availableConveyorType"
                :label="conveyor.name"
                :value="conveyor.value"></v-radio>
            </v-radio-group>

            <v-select
              v-model="chainType"
              :items="availableChain"
              :rules="[(value) => !!value || 'Обовʼязкове поле']"
              item-title="name"
              return-object
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
                :items="availableDistributionMechanismLength"
                append-icon="d"
                label="Довжина, м"
                prepend-icon="d"
              ></v-select>
            </fieldset>

            <fieldset class="mt-3 mb-3 pa-2">
              <v-radio-group
                v-model="reducerType"
                inline
                label="Тип редуктора">
                <v-radio
                  v-for="reducerItem in availableReducer"
                  :key="reducerItem"
                  :label="reducerItem"
                  :value="reducerItem"
                />
              </v-radio-group>

              <v-select
              v-model="reducerModel"
              :items="availableReducerModel"
              item-title="description"
              return-object
              label="Редуктор"
            ></v-select>
            </fieldset>

            <v-radio-group
              v-if="availableCoverage?.length"
              v-model="coverageType"
              inline
              label="Тип покриття">
              <v-radio
                v-for="coverageItem in availableCoverage"
                :key="coverageItem.name"
                :label="coverageItem.name"
                :value="coverageItem"
              />
            </v-radio-group>

            <fieldset v-if="availableLining?.length">
              <v-checkbox
                v-model="lining.included"
                label="Футерування"
              ></v-checkbox>

              <v-select
                v-model="lining.value"
                :disabled="!lining.included"
                :items="availableLining"
                item-title="name"
                append-icon="d"
                label="Футеруваання"
                return-object
                prepend-icon="d"
              ></v-select>
            </fieldset>
          </v-form>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
