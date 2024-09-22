import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHref, useNavigate, useParams } from 'react-router-dom'
import { PMGlobalHeader } from '@oracly/pm-react-components/app/desktop'
import { toLower, isEmpty, isString } from 'lodash'
import { useStore } from 'react-redux'
import { useWallet } from '@oracly/pm-libs/crypto-wallet'
import { nowUnixTS } from '@oracly/pm-libs/date-utils'
import { success, fails } from '@oracly/pm-libs/redux-cqrs'

import { SET_SHOW_STATISTICS_BAR } from '@actions'
import { GET_BALANCE, SET_ACCOUNT } from '@actions'
import { SET_PAGE_DATA, WALLET_CONNECT, UPDATE_NICKNAME } from '@actions'
import { RESOVLE_ADDRESS_TO_NICKNAME, REQUEST_AUTHENTICATION_PSIG } from '@actions'
import { CHAT_SEND, SET_NETWORK_MODAL_OPEN } from '@actions'
import { CHAT_ENGLISH, NICKNAME_MSG, UNPUBLISHED } from '@constants'
import { SUBSCRIBE_MSG, ERC20, } from '@constants'
import config from '@config'
import HeaderContent from '@components/HeaderContent'
import { useScheduledQuery } from '@hooks'
import { useSupportBot } from '@hooks'
import { connect } from '@state'
import { getAccountNickname, getActiveAccountAddress } from '@state/getters'
import { getNetworkStatus, getLatestbcBlockNumber } from '@state/getters'
import { getActiveAccountBalanceERC20, isAccountNicknameStatus } from '@state/getters'
import { getActiveAuthPersonalSignature, getPageDataERC20 } from '@state/getters'
import { getMentorStatistics, getBettorStatistics } from '@state/getters'
import { getStakerStatistics, isLoading } from '@state/getters'
import { isChatConnected, isChatReady } from '@state/getters'
import { getStatisticsBarIsOpened } from '@state/getters'
import { getStatisticsBarAccount } from '@state/getters'

const GlobalHeader = (props) => {
  const {
    erc20,
    nickname,
    mentor,
    psig,
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
  const href = useHref()
  const wallet = useWallet()
  const { mentorid } = useParams()
  const account = toLower(wallet.account)
  const mustUserLogin = !window.localStorage.getItem('__connector') && !mentorid

  const [injectedProviderType, setInjectedProviderType] = useState()

  useEffect(() => {
    if (wallet.connectors.includes('injected')) {
      if (window.ethereum) {
        setInjectedProviderType(window.ethereum?.isUniswapWallet ? 'uniswap' : 'metamask')

      } else {
        setInjectedProviderType('uniswap')
      }
    }
  }, [wallet.connectors])

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

  useEffect(() => {
    if (!props.isChatConnected) return
    if (isEmpty(props.psig)) return
    if (props.isChatReady) return

    props.CHAT_SEND({
      sender: props.mentor,
      nickname: props.nickname,
      channel: CHAT_ENGLISH,
      type: SUBSCRIBE_MSG,
      cts: nowUnixTS(),
      psig: props.psig,
    })

  }, [
    props.mentor,
    props.nickname,
    props.isChatConnected,
    props.isChatReady,
    props.psig,
  ])

  useEffect(() => {
    if (!props.isChatConnected) return
    if (!props.isChatReady) return
    if (!wallet.ready) return
    if (!wallet.chain) return
    if (!account) return
    if (account !== props.mentor) return
    if (isEmpty(psig)) return
    if (!props.unpublishedNickname) return

    // commiting new nickname by share via chat
    props.CHAT_SEND({
      sender: props.mentor,
      nickname: props.nickname,
      channel: CHAT_ENGLISH,
      type: NICKNAME_MSG,
      cts: nowUnixTS(),
      psig: props.psig,
    })

  }, [
    props.psig,
    wallet.chain,
    wallet.ready,
    account,
    props.mentor,
    props.nickname,
    props.unpublishedNickname,
    props.isChatConnected,
    props.isChatReady,
  ])

  const store = useStore()

  const handleConnectorClick = useCallback((connectorId) => {
    // NOTE: it's handled via standard async
    // so we HAVE TO call sucess and fails
    props.WALLET_CONNECT()
    wallet.actions.connect(connectorId)
      .then(() => {
        props.WALLET_CONNECT_SUCCESS()
        navigate(getActiveAccountAddress(store.getState()))
      })
      .catch(() => props.WALLET_CONNECT_FAILS())

  }, [])
  const handleProfileClick = useCallback((address) => {
    if (href !== `/${address}`) navigate(address)
  }, [href])
  const handleDisconnectClick = useCallback(() => {
    props.SET_SHOW_STATISTICS_BAR({ isOpened: false })
    if (wallet.ready) {
      wallet.actions.disconnect()
      props.SET_ACCOUNT({ account: null })
    }
  }, [wallet])

  const handleProfileIconClick = useCallback(() => {
    props.SET_SHOW_STATISTICS_BAR({ account, isOpened: true })
  }, [account])

  const handleStatisticsBarCloseClick = useCallback(() => {
    props.SET_SHOW_STATISTICS_BAR({ isOpened: false })
  }, [])

  const handleCurrencyChanged = useCallback(currency => {
    props.SET_PAGE_DATA({ erc20: ERC20.ADDRESS[currency] })
  }, [])

  const handleNicknameChanged = useCallback(({ address, nickname }) => {
    props.UPDATE_NICKNAME({ address, nickname })
  }, [])

  const handleNetworkStatusClick = useCallback(() => {
    props.SET_NETWORK_MODAL_OPEN({ isOpened: true })
  }, [])

  const [handleSupportClick,] = useSupportBot()

  return (
    <PMGlobalHeader
      injectedProviderType={injectedProviderType}
      basepath={config.mt_base_path}
      logoFill="#D0F3E7"
      logoLabelFill="#D0F3E7"
      currencyFill="#242821"
      maximumFractionDigits={config.maximum_fraction_digits}
      maximumFractionDigitsPrecent={config.maximum_fraction_digits_precent}
      content={<HeaderContent />}
      mustUserLogin={mustUserLogin}
      isConnected={!!(wallet && wallet.ready && wallet.chain)}
      isConnecting={isConnecting}
      isStatisticsBarOpened={isStatisticsBarOpened}
      account={account}
      balance={balance}
      statisticsAccount={statisticsBarAccount}
      statisticsNickname={statisticsBarNickname}
      nickname={nickname}
      currency={ERC20[erc20]}
      chainName={wallet.chain?.chainName}
      connectors={wallet.connectors}
      activeNavigationItem="mentoring"
      statistics={statistics}
      networkStatus={networkStatus}
      onNetworkStatusClick={handleNetworkStatusClick}
      onConnectorClick={handleConnectorClick}
      onDisconnectClick={handleDisconnectClick}
      onProfileClick={handleProfileClick}
      onProfileIconClick={handleProfileIconClick}
      onStatisticsBarCloseClick={handleStatisticsBarCloseClick}
      onCurrencyChanged={handleCurrencyChanged}
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
    const unpublishedNickname = isAccountNicknameStatus(state, mentor, UNPUBLISHED)
    const isStatisticsBarOpened = getStatisticsBarIsOpened(state)
    const is_bc_blockNumberExist = !!getLatestbcBlockNumber(state)
    const networkStatus = getNetworkStatus(state)

    return {
      erc20,
      balance,
      nickname,
      psig,
      mentor,
      isConnecting,
      unpublishedNickname,
      predictorStatistics,
      mentorStatistics,
      stakerStatistics,
      isStatisticsBarOpened,
      statisticsBarAccount,
      statisticsBarNickname,
      isChatConnected: isChatConnected(state),
      isChatReady: isChatReady(state),
      is_bc_blockNumberExist,
      networkStatus,
    }
  },
  ({ query, command }) => [
    command(SET_SHOW_STATISTICS_BAR),
    command(SET_NETWORK_MODAL_OPEN),
    command(SET_ACCOUNT),
    command(SET_PAGE_DATA),
    command(WALLET_CONNECT),
    command(success(WALLET_CONNECT)),
    command(fails(WALLET_CONNECT)),
    command(UPDATE_NICKNAME),
    command(CHAT_SEND),

    query(RESOVLE_ADDRESS_TO_NICKNAME),
    query(REQUEST_AUTHENTICATION_PSIG),
  ]
)(React.memo(GlobalHeader))
