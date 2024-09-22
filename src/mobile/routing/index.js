import React from 'react'
import { isAddress } from 'ethers'

import NotFound from '@pages/notfound'
import Master from '@pages/master'
import MentorPage from '@pages/MentorPage'

export default [
  {
    path: '/',
    element: <Master />,
    children: [
      {
				path: ':mentorid',
				element: <MentorPage />,
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
