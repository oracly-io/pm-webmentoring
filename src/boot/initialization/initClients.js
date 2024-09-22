import { UserApi } from '@oracly/pm-libs/pm-api-client'

import config from '@config'
import logger from '@lib/logger'

export default function initClients () {
  logger.info('Init clients')

  UserApi.baseUrl = config.userdata_url

}