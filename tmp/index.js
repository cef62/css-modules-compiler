import styles from './index.css'

import React from 'react'
import { render } from 'react-dom'

render(
  <div className={styles.main}>
    <i className="icon-geocoding"></i> Hello world
  </div>,
  document.getElementById('root')
)
