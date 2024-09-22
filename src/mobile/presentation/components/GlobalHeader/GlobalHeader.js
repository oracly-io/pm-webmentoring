import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { PMGlobalHeader } from '@oracly/pm-react-components/app/mobile'
import { toLower, isEmpty, isString } from 'lodash'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from 'react-redux'
import { useWallet } from '@oracly/pm-libs/crypto-wallet'
import { success, fails } from '@oracly/pm-libs/redux-cqrs'

import { GET_BALANCE, SET_ACCOUNT, UPDATE_NICKNAME } from '@actions'
import { WALLET_CONNECT, SET_PAGE_DATA } from '@actions'
import { RESOVLE_ADDRESS_TO_NICKNAME, REQUEST_AUTHENTICATION_PSIG } from '@actions'
import { SET_SHOW_STATISTICS_BAR } from '@actions'
import config from '@config'
import { ERC20 } from '@constants'
import HeaderContent from '@components/HeaderContent'
import { useScheduledQuery } from '@hooks'
import { useSupportBot } from '@hooks'
import { connect } from '@state'
import { getAccountNickname, getActiveAccountAddress } from '@state/getters'
import { getLatestbcBlockNumber, getNetworkStatus } from '@state/getters'
import { getActiveAccountBalanceERC20, getActiveAuthPersonalSignature } from '@state/getters'
import { getMentorStatistics } from '@state/getters'
import { getPageDataERC20, getBettorStatistics } from '@state/getters'
import { getStakerStatistics, isLoading } from '@state/getters'
import { getStatisticsBarIsOpened } from '@state/getters'
import { getStatisticsBarAccount } from '@state/getters'

const GlobalHeader = (props) => {
  const {
    erc20,
    psig,
    nickname,
    mentor,
    balance,
    isConnecting,
    isStatisticsBarOpened,
    statisticsBarAccount,
    statisticsBarNickname,
    networkStatus,
    predictorStatistics,
    mentorStatistics,
    stakerStatistics,
    is_bc_blockNumberExist,
  } = props

  const navigate = useNavigate()
  const wallet = useWallet()
  const { mentorid } = useParams()
  const isConnected = !!(wallet && wallet.ready && wallet.chain)
  const account = toLower(wallet.account)
  const currency = ERC20[erc20]
  const mustUserLogin = !window.localStorage.getItem('__connector') && !mentorid
  const [injectedProviderType, setInjectedProviderType] = useState()

  const connectors = useMemo(
    () => {
      if (window.ethereum) {
        if (window.ethereum.isMetaMask) {
          return wallet.connectors.filter((con) => con === 'injected')
        }
        if (window.ethereum.isCoinbaseWallet) {
          return wallet.connectors.filter((con) => con === 'coinbase')
        }
        return wallet.connectors.filter((con) => con === 'walletconnect')
      } else {
        return wallet.connectors.filter((con) => con !== 'injected')
      }
    },
    [wallet.connectors]
  )

  useEffect(() => {
    if (connectors.includes('injected')) {
      if (window.ethereum) {
        setInjectedProviderType(window.ethereum?.isUniswapWallet ? 'uniswap' : 'metamask')
      } else {
        setInjectedProviderType('uniswap')
      }
    }
  }, [connectors])

  const statistics = useMemo(() => {
    return {
      predictor: predictorStatistics,
      mentor: mentorStatistics,
      staker: stakerStatistics,
    }
  }, [predictorStatistics, mentorStatistics, stakerStatistics])

  useScheduledQuery((query, state) => {
    if (!is_bc_blockNumberExist) return

    if (wallet.ready && account && erc20) {
      const blockNumber = getLatestbcBlockNumber(state)
      query(GET_BALANCE, { account, erc20, txn: { blockNumber } }, { schedule: 30 })
    }
  }, [is_bc_blockNumberExist, wallet.ready, account, erc20])

  useEffect(() => {
    if (wallet.ready && account) {
      props.SET_ACCOUNT({ account })
    }
  }, [wallet.ready, account])

  useEffect(() => {
    props.WALLET_CONNECT()
    wallet.actions.connectEagerly()
      .then(() => props.WALLET_CONNECT_SUCCESS())
      .catch(() => props.WALLET_CONNECT_FAILS())
  }, [])

  useEffect(() => {
    if (!wallet.ready) return
    if (!wallet.chain) return
    if (!account) return
    if (account !== mentor) return
    if (!isEmpty(psig)) return
    if (!isString(nickname)) return

    props.REQUEST_AUTHENTICATION_PSIG({ nickname, from: account })

  }, [psig, wallet.chain, wallet.ready, account, mentor, nickname])

  useEffect(() => {
    if (!wallet.ready) return
    if (!wallet.chain) return
    if (!account) return
    if (account !== mentor) return
    if (isString(props.nickname)) return

    props.RESOVLE_ADDRESS_TO_NICKNAME({ address: account })

  }, [wallet.chain, wallet.ready, account, mentor, nickname])

  const handleDisconnectClick = useCallback(() => {
    props.SET_SHOW_STATISTICS_BAR({ isOpened: false })
    if (wallet.ready) {
      wallet.actions.disconnect()
      props.SET_ACCOUNT({ account: null })
    }
  }, [wallet])

  const handleProfileClick = useCallback(() => {
    props.SET_SHOW_STATISTICS_BAR({ account, isOpened: true })
  }, [account])

  const handleStatisticsBarCloseClick = useCallback(() => {
    props.SET_SHOW_STATISTICS_BAR({ isOpened: false })
  }, [])

  const store = useStore()

  const handleConnectorClick = useCallback((connectorId) => {
    // NOTE: it's handled via standard async
    // so we HAVE TO call sucess and fails
    props.WALLET_CONNECT(connectorId)
    wallet.actions.connect(connectorId)
      .then(() => {
        props.WALLET_CONNECT_SUCCESS(connectorId)
        navigate(getActiveAccountAddress(store.getState()))
      })
      .catch(() => props.WALLET_CONNECT_FAILS(connectorId))

  }, [])

  const handelProfileIconClick = useCallback(() => {
    props.SET_SHOW_STATISTICS_BAR({ account, isOpened: true })
  }, [account])

  const handleProfileCurrencyChanged = useCallback((currency) => {
    props.SET_PAGE_DATA({ erc20: ERC20.ADDRESS[currency] })
  }, [])

  const handleNicknameChanged = useCallback(({ address, nickname }) => {
    props.UPDATE_NICKNAME({ address, nickname })
  }, [])

  const [handleSupportClick,] = useSupportBot()

  return (
    <PMGlobalHeader
      injectedProviderType={injectedProviderType}
      basepath={config.mt_base_path}
      account={account}
      statisticsAccount={statisticsBarAccount}
      statisticsNickname={statisticsBarNickname}
      mustUserLogin={mustUserLogin}
      connectors={connectors}
      activeNavigationItem="mentoring"
      currencyFill="#23342C"
      maximumFractionDigits={config.maximum_fraction_digits}
      maximumFractionDigitsPrecent={config.maximum_fraction_digits_precent}
      content={(
        <HeaderContent
          isConnected={isConnected}
          balance={balance}
          currency={currency}
          account={account}
          networkStatus={networkStatus}
          onProfileIconClick={handelProfileIconClick}
          onProfileCurrencyChanged={handleProfileCurrencyChanged}
        />
      )}
      isConnected={isConnected}
      isConnecting={isConnecting}
      isStatisticsBarOpened={isStatisticsBarOpened}
      statistics={statistics}
      onConnectorClick={handleConnectorClick}
      onProfileClick={handleProfileClick}
      onDisconnectClick={handleDisconnectClick}
      onStatisticsBarCloseClick={handleStatisticsBarCloseClick}
      onNicknameChanged={handleNicknameChanged}
      onSupportClick={handleSupportClick}
    >
      {props.children}
    </PMGlobalHeader>
  )
}

export default connect(
  state => {
    const erc20 = getPageDataERC20(state)
    const balance = getActiveAccountBalanceERC20(state, erc20)
    const statisticsBarAccount = getStatisticsBarAccount(state)
    const statisticsBarNickname = getAccountNickname(state, statisticsBarAccount)
    const predictorStatistics = getBettorStatistics(state, statisticsBarAccount)
    const stakerStatistics = getStakerStatistics(state, statisticsBarAccount)
    const mentorStatistics = getMentorStatistics(state, statisticsBarAccount)
    const isConnecting = isLoading(state, WALLET_CONNECT)
    const mentor = getActiveAccountAddress(state)
    const nickname = getAccountNickname(state, mentor)
    const psig = getActiveAuthPersonalSignature(state)
    const isStatisticsBarOpened = getStatisticsBarIsOpened(state)
    const is_bc_blockNumberExist = !!getLatestbcBlockNumber(state)
    const networkStatus = getNetworkStatus(state)

    return {
      erc20,
      balance,
      mentor,
      nickname,
      psig,
      isConnecting,
      isStatisticsBarOpened,
      statisticsBarAccount,
      statisticsBarNickname,
      predictorStatistics,
      mentorStatistics,
      stakerStatistics,
      is_bc_blockNumberExist,
      networkStatus,
    }
  },
  ({ query, command }) => [
    command(SET_SHOW_STATISTICS_BAR),
    command(SET_ACCOUNT),
    command(WALLET_CONNECT),
    command(SET_PAGE_DATA),
    command(UPDATE_NICKNAME),
    command(success(WALLET_CONNECT)),
    command(fails(WALLET_CONNECT)),

    query(RESOVLE_ADDRESS_TO_NICKNAME),
    query(REQUEST_AUTHENTICATION_PSIG),
  ]
)(React.memo(GlobalHeader))
