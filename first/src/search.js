import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './search.css'
import './search.less'
import logo from './img/logo.png'

class Home extends React.Component {
  render() {
    return (
      <div className="search">
        hello loader 伍连德世界111111ww水电费水电费
        <div>
          <img src={logo} alt="logo" />
        </div>
        <div className="bg">我的世界</div>
      </div>
    )
  }
}

ReactDOM.render(<Home />, document.querySelector('#root'))
