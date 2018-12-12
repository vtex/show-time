import React, { Component, Fragment } from 'react'
import { Helmet } from 'render'
import { Spinner } from 'vtex.styleguide'
import { version } from '../manifest.json'
const SERIOUS_BLACK = '#142032'

class App extends Component {
  constructor() {
    super()

    this.state = {
      min: '00',
      sec: '00',
    }
  }

  render() {
    const { min, sec } = this.state

    return (
      <Fragment>
        <Helmet>
          <title>Demo Friday Timer</title>
        </Helmet>
        <div className="flex vh-100 w-100 white" style={{ backgroundColor: SERIOUS_BLACK }}>
          <div className="absolute w-100 vh-100">
            <div className="flex items-center h-100">
              <span
                className="tc center fw6"
                style={{ fontSize: '25.5vw' }}>{min}:{sec}</span>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default App
