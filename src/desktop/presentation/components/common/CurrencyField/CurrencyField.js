import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import cn from 'clsx'
import BalanceCurrency from '@oracly/pm-react-components/app/desktop/components/common/BalanceCurrency'
import { htmlCurrency } from '@oracly/pm-libs/html-utils'

import Spinner from '@components/common/Spinner'

import css from './CurrencyField.module.scss'

const CurrencyField = ({
  labelClassName,
  amountClassName,
  currencyClassName,
  contentClassName,
  spinnerClassName,
  isLoading,
  label,
  amount = 0,
  currency,
  withIcon,
}) => {
  const iconRenderer = useCallback(() => (
    <BalanceCurrency className={css.currencyIcon} currency={currency} />
  ), [currency])

  return (
    <div className={css.container}>
      {withIcon && iconRenderer()}
      <div className={cn(css.content, contentClassName)}>
        <div className={css.top}>
          <span className={cn(css.label, labelClassName)}>{label}</span>
        </div>
        <div className={css.bottom}>
          {isLoading ? (
            <Spinner className={cn(css.spinner, spinnerClassName)} />
          ) : (
            <span className={cn(css.amount, amountClassName)}>{htmlCurrency(amount)}</span>
          )}
          <span className={cn(css.currency, currencyClassName)}>{currency}</span>
        </div>
      </div>
    </div>
  )
}

CurrencyField.propTypes = {
  label: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currency: PropTypes.string,
  labelClassName: PropTypes.string,
  amountClassName: PropTypes.string,
  currencyClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  spinnerClassName: PropTypes.string,
  isLoading: PropTypes.bool,
  withIcon: PropTypes.bool,
}

export default React.memo(CurrencyField)