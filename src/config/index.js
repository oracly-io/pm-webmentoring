import { applySearchParams } from '@oracly/pm-libs/script-src'
import uuidv4 from '@oracly/pm-libs/uuidv4'

import logger from '@lib/logger'

import { DEMO_ADDRESS, ORCY_ADDRESS } from '@constants'

import { AUTH, DEMO } from '@constants'

const required = (value) => {
  if (typeof value === 'undefined') {
    throw new Error('Could not find configuration')
  }
  return value
}

let cfg = {
  automount: true,
  app_name: 'pm-webmentoring',
  app_instance_id: 'pm-webmentoring:' + uuidv4(),
  debug: process.env.DEBUG,
  env: required(process.env.NODE_ENV),

  application_relaunch_timeout: 5000,
  application_relaunch_attempts: 10,
  application_relaunch_fallback_path: '/maintenance',

  react_mount_element_id: process.env.REACT_MOUNT_ELEMENT_ID,
  pm_base_path: process.env.PM_BASE_PATH,
  st_base_path: process.env.ST_BASE_PATH,
  mt_base_path: process.env.MT_BASE_PATH,
  userdata_url: process.env.USERDATA_URL || 'https://app.staging.oracly.io/userdata',
  userdata_ava_url: process.env.USERDATA_AVA_URL || 'https://app.staging.oracly.io/ava/output',
  userdata_ava_count: 636,
  chat_ws_url: process.env.CHAT_WS_URL,
  chat_reconnect_period: 3000,
  application_type: process.env.APPLICATION_TYPE,

  // application state version
  state_version: 'v1.0.0.prod',
  shared_state_version: 'v1.0.0.prod',

  analytics_enabled: process.env.ANALYTICS_ENABLED,
  // i18n properties {
  default_locale: 'en',
  locize_default_ns: 'common',
  locize_project_id: process.env.LOCIZE_PROJECT_ID,
  locize_api_key: process.env.LOCIZE_API_KEY,
  locize_dev_mode: process.env.LOCIZE_DEV_MODE,
  localizations_resources_url_template: '',
  // }

  persistence_period_short: 1, // days
  persistence_period_long: 30, // days
  persistence_period_instance: 1, // days

  orcy_address: ORCY_ADDRESS,
  demo_address: DEMO_ADDRESS,
  mentoring_address: '0xda4a5d10fd2525b83558f66a24c0c012d67d45a5',
  staking_address: '0x55135638b6301a700070bf08c9b0ef67caf875e4',
  meta_address: '0x9acff323637f765fa770c3d1cdbc76bfbfdb4fa8',
  oraclyv1_address: '0xf41c3bec833bf3b05834b8459ee70816d167cf37',

  vesting_growth: '0x39ee332b91dc58d6ca668bf874df539cae158016',
  vesting_team: '0xd8708ea8214da5a170edac19d9a50c0fffd1b5dc',
  vesting_seed: '0xdd084b37837eb0da72abd817375045d22bf73e93',

  blockchain_explorer: 'https://polygonscan.com',
  obsolit_data_limit_age: 300,
  default_currency: DEMO,

  maximum_fraction_digits: 3,
  maximum_fraction_digits_precent: 1,

  modal_id: 'app-modal',

  sig_requests: {
    [AUTH]: `
Welcome to Oracly V1!

By signing, you acknowledge the use of the Layer 2 Polygon (PoS) blockchain and Oracly V1 smart contracts, and agree to the game rules outlined in the Oracly Whitepaper (https://oracly.io/?wp=true).
*The signature will be used to authenticate you throughout the system.

By signing this, you confirm that you are at least the legal age required for gambling in your jurisdiction (e.g., 22 years old in Ukraine).

For your security, your authentication status will automatically reset after 30 days.

Rest assured, this signature will not initiate any blockchain transactions or incur any gas fees.

Name
%s

Address
%s

Date
%s
    `.trim(),
  }
}

cfg = applySearchParams(cfg)

cfg.is_development = cfg.env === 'development'
cfg.is_production = cfg.env === 'production'

logger.info('Application Config:', cfg)
export default cfg
