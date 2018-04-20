import React, { Component } from 'react';
import '../../css/App.css';
import '../../css/awesomplete.css';
import ReactDOM from 'react-dom';
import Rivalry from './Rivalry.js';
import * as d3 from 'd3';
import {awesomplete} from '../scripts/awesomplete';
export default class ServeBreak extends Component {
  constructor(props){

	  super(props);
	  this.state = {
	  	//currOpponentData: null,

	  }
  }
  
  componentDidMount() {
  	const that = this
  	const input = document.getElementById('myinput')
  	console.log(input)
  	const {data} = this.props
  	let playerNames = [...data.map(item => item['winner_name']), ...data.map(item => item['loser_name'])];
  	playerNames = [...new Set(playerNames)]
	  const awesompleteinput = awesomplete(input, {
	    list: playerNames
	  });


	   document.getElementById('myinput').addEventListener("awesomplete-select", function(event) {
	   
	   	const opponent = event.text.label
	   	console.log(opponent)
	   	const matches = data.filter(d => d['winner_name'] == opponent || d['loser_name'] == opponent)
	   	console.log(matches)
	   	that.setState({currOpponentData: matches})

	   })

  }

	render() {
		const {currOpponentData} = this.state
		if (currOpponentData != null) {
			return <div>
				<input id="myinput" className="awesomplete" placeholder="Enter a term..."></input>
				<Rivalry data={currOpponentData} margin={{top:25, bottom: 25, right: 25, left: 25}} />
			</div>
		} else {
			return <div>
				<input id="myinput" className="awesomplete" placeholder="Enter a term..."></input>
			</div>
		}
	}
}