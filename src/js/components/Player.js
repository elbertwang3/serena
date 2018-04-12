import React, {Component}  from 'react';
import '../../css/App.css';


export default class PlayerRow extends Component {
	constructor(props){
	  super(props);
    this.state = {
      flags: null
    }
  }

  importAllFlags(r) {
 
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  componentWillMount() {
    const flags = this.importAllFlags(require.context('../../images/flags', false, /\.(png|jpe?g|svg)$/));
    this.setState({flags: flags})
  }

  render() {
    if (this.props != null) {
      const {name, ioc} = this.props
      return <div className="player">
        <div className='flag-container'>
      
          <img className='flag' src={this.state.flags[`${ioc}.png`]} alt="flag"></img>
        </div>
        <div className="player-name">{name}</div>
      </div>
    } else 
      return <div className="player">
        <div className='flag-container'>
          <img className='flag' src='' alt="flag"></img>
        </div>
    		<div className="player-name"></div>
      </div>
    }
 }