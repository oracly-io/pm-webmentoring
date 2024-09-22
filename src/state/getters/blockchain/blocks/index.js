import { get } from '@oracly/pm-libs/immutable'

function getBlocks(state) {
  return get(state, ['blockchain', 'blocks'])
}

export function getLatestbcBlock(state) {
  return get(getBlocks(state), ['latest_bc'])
}

export function getLatestbcBlockNumber(state) {
  return get(getLatestbcBlock(state), ['number'])
}

export function getLatestbcBlockTimestamp(state) {
  return get(getLatestbcBlock(state), ['timestamp'])
}