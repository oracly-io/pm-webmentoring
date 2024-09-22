import { isNumber } from 'lodash'

export function hash(
  value,
  decimalScale = 2,
  zeroDecimalScale = 0,
  currencyPrefix = '$'
) {
  if (!isNumber(value)) return 'N/A'

  if (value < 1 && decimalScale === 0 && zeroDecimalScale > 0)
    decimalScale = zeroDecimalScale

  if (!value) return valueTemplate(0, currencyPrefix)
  if (decimalScale > 0)
    return valueTemplate(value.toFixed(decimalScale).replace(/\d(?=(\d{3})+\.)/g, '$&,'), currencyPrefix)
  else {
    const resultValue = value.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    return valueTemplate(resultValue.substr(0, resultValue.length - 2), currencyPrefix)
  }
}

function valueTemplate(resultValue, currencyPrefix) {
  return `${currencyPrefix}${resultValue}`
}
