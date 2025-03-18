import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useScrapperConveyorStore = defineStore('Scrapper conveyor', () => {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
  const pricesSpreadsheetId = import.meta.env.VITE_PRICES_SPREADSHEET_ID
  const pricesSheetName = import.meta.env.VITE_PRICES_SHEET_NAME
  const lengthKwtSpreadsheetId = import.meta.env.VITE_LENGTH_KWT_SPREADSHEET_ID
  const lengthKwtSheetName = import.meta.env.VITE_LENGTH_KWT_SHEET_NAME
  const mrSpreadsheetId = import.meta.env.VITE_MR_SPREADSHEET_ID
  const mrSheetName = import.meta.env.VITE_MR_SHEET_NAME

  const prices = ref([])
  const lengthKwt = ref([])
  const mr = ref([])

  function updatePrices() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${pricesSpreadsheetId}/values/${pricesSheetName}?key=${apiKey}`

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        prices.value = data.values.map((line) => {
          return {
            productivity: line[0],
            conveyorType: line[1],
            name: line[2],
            calkPosition: line[3],
            price: line[4],
          }
        })
      })
      .catch((error) => console.error('Error:', error))
  }

  function updateLengthKwt() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${lengthKwtSpreadsheetId}/values/${lengthKwtSheetName}?key=${apiKey}`

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        lengthKwt.value = data.values.map((line) => {
          return {
            prod: line[0],
            l: line[1],
            kWt: line[2],
          }
        })
      })
      .catch((error) => console.error('Error:', error))
  }

  function updateMr() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${mrSpreadsheetId}/values/${mrSheetName}?key=${apiKey}`

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        mr.value = data.values.map((line) => {
          return {
            name: line[0],
            kWt: line[1],
            gab: line[2],
            price: line[3],
          }
        })
      })
      .catch((error) => console.error('Error:', error))
  }

  function updateAll() {
    updatePrices()
    updateLengthKwt()
    updateMr()
  }

  return { prices, lengthKwt, mr, updateLengthKwt, updatePrices, updateMr, updateAll }
})
