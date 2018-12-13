import React, { Component, Fragment } from 'react'
import { Helmet } from 'render'
import { Spinner } from 'vtex.styleguide' 
import { version } from '../manifest.json'
import './global.css'
const SERIOUS_BLACK = '#142032'
const PERCENTAGE_OF_HATLESS_FERA = 82
const TOTAL_RENDERED_FERAS = 100
const TOTAL_IMAGES_IN_ASSETS = 11

const stringifyIntWithTwoDigits = (int) => {
  return ('0' + int).slice(-2)
}

const getRandomInt = (from, to) => {
  const min = Math.ceil(from)
  const max = Math.floor(to)
  return Math.floor(Math.random() * (max - min)) + min
}

const IMAGES = new Array(TOTAL_IMAGES_IN_ASSETS).fill(null).map((_null, i) => require(`./assets/fera-hat-${i}.png`))
const FERAS_IN_HATS = new Array(TOTAL_RENDERED_FERAS).fill(null).map((_null, i) => {
  const hatIndex = (Math.random() <= PERCENTAGE_OF_HATLESS_FERA / 100) ? 0 : getRandomInt(0, 10)
  return (
    <img
      key={`fera-${i}`}
      id={`fera-${i}`}
      src={IMAGES[hatIndex]}
      className="fera" />
  )
})

class App extends Component {
  constructor() {
    super()

    this.state = {
      minutes: 10,
      seconds: 0,
      initialMinutes: 10,
      initialSeconds: 0,
      editing: 'minutes',
      intervalReference: null,
      timeEnded: false,
      firstTimeZero: true,
      showHelperInfo: false,
      loading: true,
    }
  }

  componentDidMount() {
    this.setState({ loading: false }, () => {
      setTimeout(() => this.setState({ showHelperInfo: true }), 420000)
      document && document.addEventListener('keyup', (event) => {
        const { key } = event
        const { intervalReference, editing } = this.state
        if (key === ' ' || key === 'Enter') {
          intervalReference ? this.pauseTimer() : this.startTimer()
        } else if (key === 'ArrowRight') {
          this.toggleEdit('seconds')
        } else if (key === 'ArrowLeft') {
          this.toggleEdit('minutes')
        } else if (key === 'ArrowUp') {
          editing === 'minutes' ? this.updateMinutes(true) : this.updateSeconds(true)
        } else if (key === 'ArrowDown') {
          editing === 'minutes' ? this.updateMinutes(false) : this.updateSeconds(false)
        } else if (key === 'r' || key === 'R') {
          this.resetTimer()
        } else if (key === 'v' || key === 'V') {
          this.animateRandomFera()
        } else {
          console.log('pressed unmapped key: ', key)
        }
      })
    })
  }

  componentWillUnmount() {
    const { intervalReference } = this.state
    clearInterval(intervalReference)
  }

  toggleEdit = (editing) => {
    this.setState({ editing })
  }

  updateMinutes = (shouldIncrement) => {
    const { minutes } = this.state
    if (minutes < 99 && minutes > 0) {
      this.setState({
        minutes: shouldIncrement ? minutes + 1 : minutes - 1,
      })
    } else if (minutes <= 0 && shouldIncrement) {
      this.setState({ minutes: minutes + 1, timeEnded: false })
    } else if (minutes === 99 && !shouldIncrement) {
      this.setState({ minutes: minutes - 1 })
    }
  }

  updateSeconds = (shouldIncrement) => {
    const { seconds } = this.state
    if (seconds < 59 && seconds > 0) {
      this.setState({
        seconds: shouldIncrement ? seconds + 1 : seconds - 1,
      })
    } else if (seconds === 0 && shouldIncrement) {
      this.setState({ seconds: seconds + 1 })
    } else if (seconds === 59 && !shouldIncrement) {
      this.setState({ seconds: seconds - 1 })
    }
  }

  startTimer = () => {
    const { intervalReference } = this.state
    if (!intervalReference) {
      const intervalReference = setInterval(() => {
        const { seconds } = this.state
        if (seconds === 0) {
          this.setState(previousState => {
            const { minutes, intervalReference, timeEnded } = previousState
            return {
              ...previousState,
              seconds: 59,
              minutes: minutes - 1,
              timeEnded: !!intervalReference && minutes === 0,
              firstTimeZero: !!intervalReference && minutes === 0 && !timeEnded,
            }
          })
        } else {
          this.setState(previousState => {
            const { minute, firstTimeZero } = previousState
            if (minute === 0 && seconds === 1 && firstTimeZero) {
              return {
                ...previousState,
                seconds: previousState.seconds - 1,
                minutes: 0,
                timeEnded: true,
                firstTimeZero: false,
              }
            } else {
              return {
                ...previousState,
                seconds: previousState.seconds - 1,
              }
            }
          })
        }
      }, 1000)
      this.setState({ intervalReference })
    }
  }

  pauseTimer = () => {
    const { intervalReference } = this.state
    clearInterval(intervalReference)
    this.setState({ intervalReference: null })
  }

  resetTimer = () => {
    const { intervalReference, initialMinutes, initialSeconds } = this.state
    clearInterval(intervalReference)
    this.setState({
      intervalReference: null,
      minutes: initialMinutes,
      seconds: initialSeconds,
    })
  }

  animateRandomFera = (forceNoHat = false) => {
    const random = forceNoHat ? 0 : getRandomInt(0, TOTAL_RENDERED_FERAS - 1)
    const element = document.getElementById(`fera-${random}`)
    element.className = element.className + ' animateFera'
    setTimeout(() => {
      element.className = element.className.replace(' animateFera', '')
    }, 2000)
  }

  renderHelpInfo = () => this.state.showHelperInfo && (
    <div className="absolute bottom-1 left-1 tl h-20 dn dib-ns">
      <ul className="white f5 list">
        <li>
          <p><span className="b">arrow keys</span> to set timer</p>
        </li>
        <li>
          <p><span className="b">space/enter</span> to start or stop</p>
        </li>
        <li>
          <p><span className="b">r</span> to reset</p>
        </li>
        <li>
          <p>v{version}</p>
        </li>
      </ul>
    </div>
  )

  render() {
    const { minutes, seconds, editing, intervalReference, timeEnded, firstTimeZero, loading } = this.state
    if (loading) {
      return <div className="flex flex-column overflow-hidden">
        <div className="center mv10" style={{ transform: 'scale(5)' }}>
          <Spinner />
        </div>
        <p className="w-100 center tc c-muted-1 fw3 f3 fw5-ns f1-ns mh7">
            Fetching data from outside the orbit...
          </p>
      </div>
    }

    if (minutes <= 0 && !firstTimeZero) {
      if (timeEnded && Math.random() >= 0.420) {
        this.animateRandomFera()
      }
    }

    return (
      <Fragment>
        <Helmet>
          <title>Timer Demofriday</title>
        </Helmet>
        <div className="flex relative overflow-hidden vh-100 w-100" style={{ backgroundColor: SERIOUS_BLACK }}>
          <div className="absolute w-100 vh-100">
            <div className="flex items-center h-100">
              <span
                className="tc center fw6 white"
                style={{ fontSize: '25.5vw' }}>
                  <span className={intervalReference || editing === 'minutes' ? 'white' : 'c-muted-2'}>
                    {minutes === 0 && firstTimeZero ? '-00' : stringifyIntWithTwoDigits(minutes)}
                  </span>:<span className={intervalReference || editing === 'seconds' ? 'white' : 'c-muted-2'}>
                    {stringifyIntWithTwoDigits(seconds)}
                  </span>
                </span>
            </div>
          </div>
          {intervalReference ? null : this.renderHelpInfo()}
          {FERAS_IN_HATS}
        </div>
      </Fragment>
    )
  }
}

export default App
