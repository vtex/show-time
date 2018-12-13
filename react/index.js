import React, { Component, Fragment } from 'react'
import { Helmet } from 'render'
import { version } from '../manifest.json'
import './global.css'
const SERIOUS_BLACK = '#142032'

const stringifyIntWithTwoDigits = (int) => {
  return ('0' + int).slice(-2)
}

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
      showFera: false,
    }
  }

  componentDidMount() {
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
        this.handleFeraParade()
      } else {
        console.log('pressed unmapped key: ', key)
      }
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
    }
  }

  updateSeconds = (shouldIncrement) => {
    const { seconds } = this.state
    if (seconds < 59 && seconds > 0) {
      this.setState({
        seconds: shouldIncrement ? seconds + 1 : seconds - 1,
      })
    }
  }

  startTimer = () => {
    const { minutes, seconds } = this.state
    const intervalReference = setInterval(() => {
      console.log('callback called!')
      if (seconds === 0) {
        this.setState({
          minutes: minutes - 1,
          seconds: 59,
        })
        return
      }
      this.setState({
        seconds: seconds - 1,
      })
    }, 1000)
    this.setState({ intervalReference })
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

  handleFeraParade = () => {
    this.setState({ showFera: true }, () => setTimeout(() => {
      this.setState({ showFera: false })
    }, 2000))
  }

  renderHelpInfo = () => (
    <div className="absolute bottom-1 left-1 tl h-20">
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
    const { minutes, seconds, editing, intervalReference, showFera } = this.state

    return (
      <Fragment>
        <Helmet>
          <title>Timer Demofriday</title>
        </Helmet>
        <div className="flex relative vh-100 w-100" style={{ backgroundColor: SERIOUS_BLACK }}>
          <div className="absolute w-100 vh-100">
            <div className="flex items-center h-100">
              <span
                className="tc center fw6 white"
                style={{ fontSize: '25.5vw' }}>
                  <span className={intervalReference || editing === 'minutes' ? 'white' : 'c-muted-2'}>
                    {stringifyIntWithTwoDigits(minutes)}
                  </span>:<span className={intervalReference || editing === 'seconds' ? 'white' : 'c-muted-2'}>
                    {stringifyIntWithTwoDigits(seconds)}
                  </span>
                </span>
            </div>
          </div>
          {intervalReference ? null : this.renderHelpInfo()}
          <img src={require(`./assets/fera-hat-${'0'}.png`)}
            className={`fera ${showFera ? 'animateIn' : ''}`} />
        </div>
      </Fragment>
    )
  }
}

export default App
