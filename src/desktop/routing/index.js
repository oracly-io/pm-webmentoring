import React from 'react'
import { isAddress } from 'ethers'

import NotFound from '@pages/notfound'
import Master from '@pages/master'
import WebMentoring from '@pages/webmentoring'

export default [
  {
    path: '/',
    element: <Master />,
    children: [
      {
				path: ':mentorid',
				element: <WebMentoring />,
        handle: {
          validator: ({ params: { mentorid } }) => isAddress(mentorid)
        },
			},
      {
        path: '*',
        element: <NotFound />
      }
    ]
  },
]
