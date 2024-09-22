import React from 'react'
import PropTypes from 'prop-types'
import cn from 'clsx'
import BalanceCurrency from '@oracly/pm-react-components/app/mobile/components/common/BalanceCurrency'
import { htmlCurrency } from '@oracly/pm-libs/html-utils'

import css from './AmountField.module.scss'

const AmountField = ({
  className,
  amountClassName,
  iconClassName,
  amount,
  currency,
  iconSize,
  iconFill,
  placement = 'right',
}) => {
  return (
    <div className={cn(
      css.container,
      { [css.reverse]: placement === 'right' },
      className,
    )}>
      <BalanceCurrency
        className={cn(
          css.icon,
          { [css.left]: placement === 'left', [css.right]: placement === 'right'},
          iconClassName,
        )}
        currency={currency}
        size={iconSize}
        fill={iconFill}
      />
      <span className={cn(css.amount, amountClassName)}>
        {htmlCurrency(amount)}
      </span>
    </div>
  )
}

AmountField.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currency: PropTypes.string,
  className: PropTypes.string,
  amountClassName: PropTypes.string,
  iconClassName: PropTypes.string,
  iconSize: PropTypes.number,
  iconFill: PropTypes.string,
}

export default AmountField