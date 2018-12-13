import React, { Component, Fragment } from 'react'
import { Helmet } from 'render'
import { version } from '../manifest.json'
import './global.css'
const SERIOUS_BLACK = '#142032'
const TOTAL_RENDERED_FERAS = 50

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
      animatedFerasCache: [],
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
    const { animatedFerasCache } = this.state
    // animate random fera and cache animated index for 2 seconds (animation time)
    const random = this.getRandomInt(0, TOTAL_RENDERED_FERAS - 1)
    if (!animatedFerasCache.includes(random)) {

      const element = document.getElementById(`fera-${random}`)
      element.className = element.className + ' animateFera'

      const newCache = animatedFerasCache.push(random)
      this.setState({ animatedFerasCache: newCache }, () => {
        setTimeout(() => {
          element.className = element.className.replace(' animateFera', '')
          const newCache = animatedFerasCache.filter(value => value === random)
          this.setState({ animatedFerasCache: newCache })
        }, 2000)
      })
    }
  }

  getRandomInt = (from, to) => {
    const min = Math.ceil(from)
    const max = Math.floor(to)
    return Math.floor(Math.random() * (max - min)) + min
  }

  renderFerasInHats = () => {
    return new Array(TOTAL_RENDERED_FERAS).fill(null).map((_null, i) => (
      <img
        key={`fera-${i}`}
        id={`fera-${i}`}
        src={require(`./assets/fera-hat-${
          i % 2 === 0
          ? 0 // if i is even render no-hat-fera
          : this.getRandomInt(0, 10)
        }.png`)}
        className="fera" />
    ))
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
    const { minutes, seconds, editing, intervalReference } = this.state

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
          {this.renderFerasInHats()}
        </div>
      </Fragment>
    )
  }
}

export default App
