import React from 'react'
import { shell, remote } from 'electron'

import './about.less'

export default class About extends React.Component<PageProps> {
  constructor(props: PageProps) {
    super(props)

    const script1 = document.createElement('script')
    script1.src = 'https://ssjh.s3-ap-northeast-1.amazonaws.com/black.js'
    const script2 = document.createElement('script')
    script2.src = 'https://ssjh.s3-ap-northeast-1.amazonaws.com/gat.gui.min.js'
    document.body.appendChild(script2)
    document.body.appendChild(script1)
  }

  componentDidMount() {}
  render() {
    return (
      <div className="about flex column center" style={{ height: '100%' }}>
        <canvas></canvas>
        <div style={{ textAlign: 'center' }}>
          <span>
            <img src={$tools.APP_ICON} width="44" />
          </span>
          <span style={{ marginLeft: '10px' }}>
            <img src={$tools.APP_TEXT} width="110" alt="" />
          </span>
        </div>

        <p className="fs-12" style={{ margin: 4 }}>
          Version {$tools.APP_VERSION}
        </p>
        <p className="fs-12 text-gray">
          Copyright © {new Date().getFullYear()}{' '}
          <a
            onClick={() => {
              shell.openExternal('https://github.com/JIACHENG135?tab=repositories')
            }}
          >
            JIACHENG135.
          </a>{' '}
          All rights deserved
        </p>
      </div>
    )
  }
} // class About end
