import React, {Component}  from 'react';
import '../../css/App.css';
import Player from './Player';


export default class PlayerRow extends Component {


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
		  	const {seed, score1, score2, score3, name, ioc, border, top} = this.props
		  	const borderStyle={borderRight: this.props.border}
		  	const borderStyle2={borderTop: this.props.border}
		  	if (top) {
		  		return <div className="player-row" style={borderStyle2}>
		  		<div className="seed" style={borderStyle}>{seed}</div>
		  		<Player name={name} ioc={ioc} border={border}/>
		  		<div className="score" style={borderStyle}>{score1} </div>
		  		<div className="score" style={borderStyle}>{score2}</div>
		  		<div className="score" style={borderStyle}>{score3}</div>
		  	</div>

		  	} else {
		  		return <div className="player-row">
		  		<div className="seed" style={borderStyle}>{seed}</div>
		  		<Player name={name} ioc={ioc} border={border}/>
		  		<div className="score" style={borderStyle}>{score1} </div>
		  		<div className="score" style={borderStyle}>{score2}</div>
		  		<div className="score" style={borderStyle}>{score3}</div>
		  	</div>
		  	}

		  }
  	}
 }
