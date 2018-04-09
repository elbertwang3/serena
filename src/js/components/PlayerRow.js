import React, {Component}  from 'react';
import '../../css/App.css';
import Player from './Player';


export default class PlayerRow extends Component {
	constructor(props){
	  super(props);
  	}

  	render() {
  		if (this.props == null) {
	  		return <div className="player-row">
		  		<div className="seed"></div>
		  		<Player />
		  		<div className="score"></div>
		  		<div className="score"></div>
		  		<div className="score"></div>
		  	</div>
		  } else {
		  	const {seed, score1, score2, score3, name, ioc} = this.props
		  	return <div className="player-row">
		  		<div className="seed">{seed}</div>
		  		<Player name={name} ioc={ioc}/>
		  		<div className="score">{score1}</div>
		  		<div className="score">{score2}</div>
		  		<div className="score">{score3}</div>
		  	</div>
		  }
  	}
 }