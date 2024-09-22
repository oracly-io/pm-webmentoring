import React from 'react'
import cn from 'clsx'

import css from './Button.module.scss'

const Button = (props) => {

  return (
    <a
      className={cn(css.button, { [css.disabled]: props.disabled }, props.className)}
      onClick={props.onClick}
      href={props.href}
    >
      {props.children}
    </a>
  )

}

export default React.memo(Button)
