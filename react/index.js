import React, { Component, Fragment } from 'react'
import { Helmet } from 'render'
import { Spinner } from 'vtex.styleguide' 
import { version } from '../manifest.json'
import './global.css'
const SERIOUS_BLACK = '#142032'
const REBEL_PINK = '#F71963'
const YOUNG_BLUE = '#00BBD4'
const PERCENTAGE_OF_HATLESS_FERA = 82
const TOTAL_RENDERED_FERAS = 100 // pls don't change this one!
const TOTAL_IMAGES_IN_ASSETS = 11

const stringifyIntWithTwoDigits = (int) => {
  return ('0' + int).slice(-2)
}

const getRandomInt = (from, to) => {
  const min = Math.ceil(from)
  const max = Math.floor(to)
  return Math.floor(Math.random() * (max - min)) + min
}

const FERA_IMAGES = new Array(TOTAL_IMAGES_IN_ASSETS).fill(null).map((_null, i) => require(`./assets/fera-hat-${i}.png`))
const FERAS_IN_HATS = new Array(Math.floor(TOTAL_RENDERED_FERAS / 2)).fill(null).map((_null, i) => {
  const hatIndex = (Math.random() <= PERCENTAGE_OF_HATLESS_FERA / 100) ? Math.random() >= 0.5 ? 0 : 50 : getRandomInt(0, 10)
  return (
    <img
      key={`fera-${i}`}
      id={`fera-${i}`}
      src={FERA_IMAGES[hatIndex]}
      className={`fera ${hatIndex === 0 ? 'hatless' : ''}`} />
  )
})
const MARIANO_IMAGES = new Array(TOTAL_IMAGES_IN_ASSETS).fill(null).map((_null, i) => require(`./assets/mari-hat-${i}.png`))
const MARIANOS_IN_HATS = new Array(Math.floor(TOTAL_RENDERED_FERAS / 2)).fill(null).map((_null, i) => {
  const hatIndex = (Math.random() <= PERCENTAGE_OF_HATLESS_FERA / 100) ? Math.random() >= 0.5 ? 0 : 50 : getRandomInt(0, 10)
  return (
    <img
      key={`fera-${i + Math.floor(TOTAL_RENDERED_FERAS / 2)}`}
      id={`fera-${i + Math.floor(TOTAL_RENDERED_FERAS / 2)}`}
      src={MARIANO_IMAGES[hatIndex]}
      className={`fera ${hatIndex === 0 ? 'hatless' : ''}`} />
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
      showHelperInfo: false,
      loading: true,
    }
  }

  componentDidMount() {
    this.setState({ loading: false }, () => {
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
          this.animateRandomFera(true)
        } else if (key === 'z' || key === 'Z') {
          this.animateRandomFera()
        } else if (key === 'h' || key === 'H') {
          this.handleShowHelperInfo()
        } else if (key === '1') {
          this.setDemoPreset(5)
        } else if (key === '2') {
          this.setDemoPreset(10)
        } else if (key === '3') {
          this.setDemoPreset(15)
        } else if (key === '4') {
          this.setDemoPreset(20)
        } else if (key === '0') {
          this.setState({
            minutes: 5,
            initialMinutes: 5,
            seconds: 0,
            initialSeconds: 0,
            timeEnded: true,
          })
        }
      })
    })
  }

  componentWillUnmount() {
    const { intervalReference } = this.state
    clearInterval(intervalReference)
  }

  handleShowHelperInfo = () => {
    const { showHelperInfo } = this.state
    if (!showHelperInfo) {
      this.setState(previousState => {
        return {
          ...previousState,
          showHelperInfo: true,
        }
      }, () => {
        setTimeout(() => {
          this.setState({ showHelperInfo: false })
        }, 25000)
      })
    } else {
      this.setState({ showHelperInfo: false })
    }
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

  setDemoPreset = (m) => {
    this.setState({
      minutes: m,
      initialMinutes: m,
      seconds: 0,
      initialSeconds: 0,
      timeEnded: false,
    })
  }

  startTimer = () => {
    const { intervalReference } = this.state
    if (!intervalReference) {
      const intervalReference = setInterval(() => {
        const { seconds, timeEnded } = this.state
        if (timeEnded) {
          if (seconds === 59) {
            this.setState(previousState => {
              return {
                ...previousState,
                seconds: 0,
                minutes: previousState.minutes + 1,
              }
            })
          } else {
            this.setState(previousState => {
              return {
                ...previousState,
                seconds: previousState.seconds + 1,
              }
            })
          }
        } else {
          if (seconds === 0) {
            this.setState(previousState => {
              const { minutes, intervalReference } = previousState
              const shouldTimeEnded = !!intervalReference && minutes === 0
              return {
                ...previousState,
                seconds: shouldTimeEnded ? 0 : 59,
                minutes: shouldTimeEnded ? 0 : minutes - 1,
                timeEnded: shouldTimeEnded,
              }
            })
          } else {
            this.setState(previousState => {
              return {
                ...previousState,
                seconds: previousState.seconds - 1,
              }
            })
          }
        }
      }, 1000)
      this.setState({
        intervalReference,
        initialMinutes: this.state.minutes,
        initialSeconds: this.state.seconds,
      })
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
      timeEnded: false,
      minutes: initialMinutes,
      seconds: initialSeconds,
    })
  }

  animateRandomFera = (forceNoHat = false) => {
    let element
    if (forceNoHat) {
      const hatlessCount = document.getElementsByClassName('hatless').length
      element = document.getElementsByClassName('hatless')[getRandomInt(0, hatlessCount - 1)]
    } else {
      const random = getRandomInt(0, TOTAL_RENDERED_FERAS - 1)
      element = document.getElementById(`fera-${random}`)
    }
    element.className = element.className + ' animateFera'
    setTimeout(() => {
      element.className = element.className.replace(' animateFera', '')
    }, 2000)
  }

  renderHelpInfo = () => (
    <div className={`absolute bottom-1 left-1 tl h-20 dn dib-ns ${
      this.state.showHelperInfo
        ? 'animateHelper'
        : ''
      } helperInfo`}>
      <ul className="white f5 list">
        <li>
          <p><span className="b">Arrow Keys</span> to set timer</p>
        </li>
        <li>
          <p><span className="b">Space/Enter</span> to start or stop</p>
        </li>
        <li>
          <p><span className="b">R</span> to reset</p>
        </li>
        <li>
          <p>v{version}</p>
        </li>
      </ul>
    </div>
  )

  render() {
    const { minutes, initialMinutes, seconds, initialSeconds, editing, intervalReference, timeEnded, loading } = this.state
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

    if (timeEnded) {
      const rand = getRandomInt(0,20)
      const randMs = (Math.random() * 100) + 10
      if (minutes === 0 && rand % 20 === 0) {
        this.animateRandomFera(true)
      } else if (minutes === 1 && rand % 10 === 0) {
        setTimeout(() => this.animateRandomFera(true), randMs + 250)
        setTimeout(() => this.animateRandomFera(true), randMs + 500)
      } else if (minutes === 2 && rand % 5 === 0) {
        setTimeout(() => this.animateRandomFera(true), randMs + 13)
        setTimeout(() => this.animateRandomFera(), randMs + 270)
        setTimeout(() => this.animateRandomFera(), randMs + 500)
      } else if (minutes === 3 && rand % 4 === 0) {
        setTimeout(() => this.animateRandomFera(), randMs + 13)
        setTimeout(() => this.animateRandomFera(), randMs + 500)
        setTimeout(() => this.animateRandomFera(), randMs + 750)
      } else if (minutes === 4 && rand % 2 === 0) {
        setTimeout(() => this.animateRandomFera(), randMs + 10)
        setTimeout(() => this.animateRandomFera(), randMs + 500)
        setTimeout(() => this.animateRandomFera(), randMs + 750)
      } else if (minutes > 4) {
        setTimeout(() => this.animateRandomFera(), randMs + 10)
        setTimeout(() => this.animateRandomFera(), randMs + 250)
        setTimeout(() => this.animateRandomFera(), randMs + 500)
        setTimeout(() => this.animateRandomFera(), randMs + 750)
      }
    }

    const totalTime = (initialMinutes * 60) + initialSeconds
    const remainingTime = (minutes * 60) + seconds
    const isRunning = !!intervalReference

    return (
      <Fragment>
        <Helmet>
          <title>Timer Demofriday</title>
          <link href="https://fonts.googleapis.com/css?family=B612+Mono" rel="stylesheet"></link>
        </Helmet>
        <div className="flex relative overflow-hidden vh-100 w-100" style={{ backgroundColor: SERIOUS_BLACK }}>
          <div className="flex absolute h-100 w-100" style={{
              backgroundColor: REBEL_PINK,
              top:0,
              left:0,
              right:0,
              left:0,
              transform: isRunning && !timeEnded ? `scale(1, ${remainingTime/totalTime})` : 'scale(1,0)',
              transformOrigin: '50% 100%',
              transition: 'transform 1s, background 1s',
            }} />
          <div className="absolute w-100 vh-100">
            <div className="flex items-center h-100">
              <span
                className="tc center fw6 white"
                style={{
                  fontSize: '25.5vw',
                  color: 'white',
                  animation: timeEnded ? 'pink-blink 1s steps(5, start) infinite' : null,
                }}>
                  <span className={`timerFont b ${intervalReference || editing === 'minutes' ? '' : 'c-muted-2'}`}>
                    {`${timeEnded ? '-' : ''}${stringifyIntWithTwoDigits(minutes)}`}
                  </span>:<span className={`timerFont b ${intervalReference || editing === 'seconds' ? '' : 'c-muted-2'}`}>
                    {stringifyIntWithTwoDigits(seconds)}
                  </span>
                </span>
            </div>
          </div>
          {intervalReference ? null : this.renderHelpInfo()}
          {FERAS_IN_HATS}
          {MARIANOS_IN_HATS}
        </div>
      </Fragment>
    )
  }
}

export default App
