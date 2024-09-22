import { isEqual, castArray } from 'lodash'
import { set, get } from '@oracly/pm-libs/immutable'

export const updateEntitiesFactory = (
  toEntity,
  getEntityPath = (entity) => [entity.id],
  getEntityBlockNumberPath = (entity) => [entity.id]
) =>
  (state, entities, nextBlockNumber) => {
    entities = castArray(entities).filter(i => i)

    for (const entity of entities) {
      const path = castArray(getEntityPath(entity))
      const blockNumberPath = castArray(getEntityBlockNumberPath(entity))
      const prevEntity = get(state, ['collection', ...path])
      const nextEntity = toEntity(entity, prevEntity?.rewardfunds)
      const prevBlockNumber = get(state, ['blockNumbers', ...blockNumberPath])

      if (nextBlockNumber && (!prevBlockNumber || nextBlockNumber >= prevBlockNumber)) {
        if (!isEqual(prevEntity, nextEntity)) {
          state = set(state, ['collection', ...path], nextEntity)
        }
        state = set(state, ['blockNumbers', ...blockNumberPath], nextBlockNumber)
      } else if (!nextBlockNumber && !prevBlockNumber && !isEqual(prevEntity, nextEntity)) {
        state = set(state, ['collection', ...path], nextEntity)
      }
    }

    return state
  }
