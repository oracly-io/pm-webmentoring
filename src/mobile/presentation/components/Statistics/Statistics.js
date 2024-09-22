import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { usePopper } from 'react-popper'
import { add, sub } from '@oracly/pm-libs/calc-utils'
import { htmlCurrency } from '@oracly/pm-libs/html-utils'
import { get } from '@oracly/pm-libs/immutable'

import { ERC20 } from '@constants'
import StatisticIcon from '@components/SVG/StatisticIcon'
import Spinner from '@components/common/Spinner'
import AmountField from '@components/common/AmountField'
import { connect } from '@state'
import { getPageDataERC20 } from '@state/getters'
import { getStatisticsBlockNumber } from '@state/getters'
import { getMentoringStat, getMentoringFundERC20 } from '@state/getters'

import css from './Statistics.module.scss'

const Row = ({ name, isLoading, children }) => {
  return (
    <div className={css.row}>
      <div className={css.name}>{name}</div>
      {isLoading ? <Spinner /> : children}
    </div>
  )
}

const Statistics = (props) => {

  const { erc20, isLoading, stat, fund, blockNumber } = props

  const direct = get(fund, ['direct']) || 0
  const indirect = get(fund, ['indirect']) || 0
  const claimed = get(fund, ['claimed']) || 0
  const collected = add(direct, indirect)
  const unclaimed = sub(collected, claimed)
  const mentors = get(stat, ['mentors']) || 0
  const proteges = get(stat, ['proteges']) || 0

  const [isOpen, setIsOpen] = useState(false)
  const containerElement = useRef(null)
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const modifiers = useMemo(() => [
    {
      name: 'toggle',
      enabled: true,
      phase: 'beforeWrite',
      requires: ['computeStyles'],
      fn: ({ state }) => {
        state.styles.popper.visibility = isOpen ? 'visible' : 'hidden'
        state.styles.popper.pointerEvents = isOpen ? 'all' : 'none'
      },
    },
    {
      name: 'styles',
      enabled: true,
      phase: 'beforeWrite',
      requires: ['computeStyles'],
      fn: ({ state }) => {
        state.styles.popper.left = '8px'
        state.styles.popper.width = 'calc(100% - 16px)'
      },
    },
    { name: 'offset', options: { offset: [0, 8] } },
  ], [isOpen])
  const { styles, attributes } = usePopper(referenceElement, popperElement, { modifiers, placement: 'bottom' })

  useEffect(() => {
    const handler = (e) => {
      if (containerElement.current && !containerElement.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    window.addEventListener('click', handler)
    return () => {
      window.removeEventListener('click', handler)
    }
  }, [])

  const handleClick = useCallback(() => {
    setIsOpen((isOpen) => !isOpen)
  }, [])

  return (
    <div ref={containerElement} className={css.container}>
      <div className={css.header} ref={setReferenceElement} onClick={handleClick}>
        <StatisticIcon />
      </div>

      <div className={css.body} ref={setPopperElement} style={styles.popper} {...attributes.popper}>
        <div className={css.title}>Contract stats</div>
        <div className={css.content}>

          <Row name="Collected" isLoading={isLoading}>
            <AmountField
              iconClassName={css.amountIcon}
              currency={ERC20[erc20]}
              amount={htmlCurrency(collected)}
            />
          </Row>

          <div className={css.divider} />

          <Row name="Claimed" isLoading={isLoading}>
            <AmountField
              iconClassName={css.amountIcon}
              currency={ERC20[erc20]}
              amount={htmlCurrency(claimed)}
            />
          </Row>

          <div className={css.divider} />

          <Row name="Unclaimed" isLoading={isLoading}>
            <AmountField
              iconClassName={css.amountIcon}
              currency={ERC20[erc20]}
              amount={htmlCurrency(unclaimed)}
            />
          </Row>

          <div className={css.divider} />

          <Row name="Mentors" isLoading={isLoading}>
            <span className={css.value}>{mentors}</span>
          </Row>

          <div className={css.divider} />

          <Row name="Proteges" isLoading={isLoading}>
            <span className={css.value}>{proteges}</span>
          </Row>

          <div className={css.divider} />

          <Row name="Block Number" isLoading={isLoading}>
            <span className={css.value}>{blockNumber}</span>
          </Row>

        </div>
      </div>
    </div>
  )
}

export default connect(
  (state) => {
    const erc20 = getPageDataERC20(state)
    const stat = getMentoringStat(state)
    const fund = getMentoringFundERC20(state, erc20)
    const blockNumber = getStatisticsBlockNumber(state)

    return {
      erc20,
      stat,
      fund,
      blockNumber,
    }
  }
)(Statistics)