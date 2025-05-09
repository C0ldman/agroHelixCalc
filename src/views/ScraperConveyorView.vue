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

const reducerHint = computed(() => {
  const hint = scrapperConveyor.lengthKwt.filter((item) =>
    item.prod === productivity.value && item.l === transporterLength.value);
  return hint.length ? hint[0].kWt : ''
})

const distributionMechanism = ref({
  included: false,
  length: 2,
})

const lining = ref({
  included: false,
  value: 2,
})

  const imageByProductivity = {
    25: 'TSH25.jpg',
    50: 'TSH50.jpg',
    100: 'TSH100.jpg',
    200: 'TSH200.jpg'
  }

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

const tensionSectionPrice = computed(() => {
  const tensionSection = availableByType.value.find((item) => item.name.includes('натяжна'));
  return tensionSection ? tensionSection.price : 0;
})

const driveSectionPrice = computed(() => {
  const driveSection = availableByType.value.find((item) => item.name.includes('привідна'));
  return driveSection ? driveSection.price : 0;
})

const transporterPrice = computed(() => {
  const transporterCost = availableByType.value.find((item) => item.name.includes(conveyorType.value === 'collapsible' ? 'розбірна' : 'зварна'));
  return transporterCost ? transporterCost.price * (transporterLength.value - 1.5) : 0;
})

const chainPrice = computed(() => {
  const chainPrice = chainType.value.price * transporterLength.value * 2
  return chainPrice ? chainPrice : 0;
})

const distributionMechanismPrice = computed(() => {
  let distributionMechanismCost = {price: 0};
  if (distributionMechanism.value.included) distributionMechanismCost = availableByType.value.find((item) => item.name.includes('розподільний механізм'));
  const distributionMechanismPrice = distributionMechanismCost.price * distributionMechanism.value.length;
  return distributionMechanismPrice ? distributionMechanismPrice : 0;
})

const reducerPrice = computed(() => {
  const reducerPrice = reducerModel.value.price;
  return reducerPrice ? reducerPrice : 0;
})

const coveragePrice = computed(() => {
  const coveragePrice = coverageType.value.price * transporterLength.value;
  return coveragePrice ? coveragePrice : 0;
})

const liningPrice = computed(() => {
  let liningCost = {price: 0};
  if (lining.value.included) liningCost = lining.value.value;
  const liningPrice = liningCost.price * transporterLength.value;
  return liningPrice ? liningPrice : 0;
})

const transporterImage = computed(() => {
  return imageByProductivity[productivity.value] || 'banner22.jpg'
})

const price = computed(() => {
  if (!scrapperConveyor.isLoading && scrapperConveyor.prices.length > 0) {
    let price = 0;

    price= tensionSectionPrice.value + driveSectionPrice.value + transporterPrice.value + chainPrice.value + distributionMechanismPrice.value + reducerPrice.value + coveragePrice.value + liningPrice.value;
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
            :src="transporterImage"></v-img>

          <v-table
            class="ma-5 elevation-1"
            density="comfortable"
            hover>
            <tbody>
            <tr>
              <td>Натяжна секція</td>
              <td class="text-center">{{ tensionSectionPrice }}</td>
            </tr>
            <tr>
              <td>Привідна секція</td>
              <td class="text-center">{{ driveSectionPrice }}</td>
            </tr>
            <tr>
              <td>Транспортер</td>
              <td class="text-center">{{ transporterPrice }}</td>
            </tr>
            <tr>
              <td>Ланцюг</td>
              <td class="text-center">{{ chainPrice }}</td>
            </tr>
            <tr v-show="distributionMechanism.included">
              <td>Розподільчий механізм</td>
              <td class="text-center">{{ distributionMechanismPrice }}</td>
            </tr>
            <tr>
              <td>Редуктор</td>
              <td class="text-center">{{ reducerPrice }}</td>
            </tr>
            <tr>
              <td>Покриття</td>
              <td class="text-center">{{ coveragePrice }}</td>
            </tr>
            <tr v-show="lining.included">
              <td>Футерування</td>
              <td class="text-center">{{ liningPrice }}</td>
            </tr>
            <tr>
              <td class="text-body-1">Разом</td>
              <td class="text-center text-body-1">{{ price }}</td>
            </tr>
            </tbody>
          </v-table>
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
              :rules="[(value) => !!value || 'Обовʼязкове поле', (value) => value >=4 || 'Мінімальна довжина 4', (value) => value <= 100 || 'Максимальна довжина 100', (value) => /([0-9]*)$|(^$)/.test(value) || 'Тільки цілі числа']"
              label="Довжина транспортера"
            ></v-text-field>

            <v-radio-group
              v-model="conveyorType"
              inline>
              <v-radio
                v-for="conveyor in availableConveyorType"
                :label="conveyor.name"
                :value="conveyor.value"
                :key="conveyor.value"
              ></v-radio>
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
              <div v-if="reducerHint">Рекомендована потужність: {{reducerHint}}кВт</div>
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
