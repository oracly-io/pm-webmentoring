import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import cn from 'clsx'
import BalanceCurrency from '@oracly/pm-react-components/app/mobile/components/common/BalanceCurrency'
import Dropdown from '@oracly/pm-react-components/app/mobile/components/common/Dropdown'

import { SET_PAGE_DATA } from '@actions'
import { DEMO_ADDRESS, USDC_ADDRESS, ORCY_ADDRESS } from '@constants'
import { DEMO, ORCY, USDC } from '@constants'
import { ERC20 } from '@constants'
import { connect } from '@state'
import { getPageDataERC20 } from '@state/getters'

import css from './ERC20Dropdown.module.scss'

const options = [
  { label: 'Oracly', currency: ORCY, erc20: ORCY_ADDRESS },
  { label: 'Oracly', currency: DEMO, erc20: DEMO_ADDRESS },
  { label: 'USD Coin', currency: USDC, erc20: USDC_ADDRESS },
]

const OptionRenderer = ({ className, option }) => {
  return (
    <span className={cn(css.optionRenderer, className)}>
      <span className={css.optionIcon}>
        <BalanceCurrency
          currency={ERC20[option.erc20]}
          className={css.optionBalance}
        />
      </span>
      <span className={css.optionLabel}>{option.label}</span>
      <span className={css.optionCurrency}>{`(${option.currency})`}</span>
    </span>
  )
}

const ValueRenderer = ({ option }) => {
  return (
    <BalanceCurrency
      currency={ERC20[option.erc20]}
      className={cn(css.optionBalance, css.optionValue)}
    />
  )
}

const ERC20Dropdown = (props) => {

  const handleChange = useCallback(({ erc20 }) => {
    props.SET_PAGE_DATA({ erc20 })
  }, [])

  const option = options.find((option) => option.erc20 === props.erc20)

  const valueRenderer = useCallback((value) => <ValueRenderer option={value} />, [])
  const optionRenderer = useCallback((option) => <OptionRenderer option={option} />, [])

  return (
    <Dropdown
      containerClassName={props.className}
      headerClassName={css.header}
      iconClassName={css.icon}
      bodyClassName={css.body}
      iconColor="#DCE7CD"
      value={option}
      options={options}
      onChange={handleChange}
      valueRenderer={valueRenderer}
      optionRenderer={optionRenderer}
    />
  )
}

ERC20Dropdown.propTypes = {
  erc20: PropTypes.string,
  className: PropTypes.string,
}

export default connect(
  state => ({ erc20: getPageDataERC20(state) }),
  ({ command }) => [command(SET_PAGE_DATA)]
)(ERC20Dropdown)