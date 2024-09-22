import React from 'react'

// import Statistics from '@components/Statistics'

import css from './HeaderContent.module.scss'

const HeaderContent = () => {
  return (
    <div className={css.header}>
      <p className={css.title}>Mentoring</p>
      <div className={css.content}>
        {/* <div className={css.dropdowns}>
          <Statistics />
        </div> */}
      </div>
    </div>
  )
}

export default React.memo(HeaderContent)
