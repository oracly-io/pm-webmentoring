import React from 'react'
import { useTranslate } from '@lib/i18n-utils'

import css from './Notfound.module.scss'

const NotFound = () => {

  const t = useTranslate()

  return (
    <div className={css.container}>
      {t('Oops, page is not found!')}
    </div>
  )

}

export default React.memo(NotFound)
