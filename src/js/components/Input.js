import React, { Component } from 'react';
import '../../css/App.css';
import '../../css/awesomplete.css';
import Rivalry from './Rivalry.js';
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
  	const {data} = this.props
  	let playerNames = [...data.map(item => item['winner_name']), ...data.map(item => item['loser_name'])];
  	playerNames = [...new Set(playerNames)]
	  awesomplete(input, {
	    list: playerNames
	  });


	   document.getElementById('myinput').addEventListener("awesomplete-select", function(event) {

	   	const opponent = event.text.label
	   	if (opponent === 'Serena Williams') {
	   		//console.log("Serena has never played herself, tennis critics have often said she needed to overcome herself")
        that.setState({currOpponentData: "Serena Williams"})
	   	} else {
	   		const matches = data.filter(d => d['winner_name'] === opponent || d['loser_name'] === opponent)
		   	that.setState({currOpponentData: matches})
	   	}


	   })

  }

	render() {
		const {currOpponentData} = this.state
		if (currOpponentData != null) {
      if (currOpponentData === "Serena Williams") {
        return <div>
  				<input id="myinput" className="awesomplete" placeholder="Enter a player..."></input>
            <p className="prose">Although Serena has never played herself, tennis commentators have often said that
            Serena is her own worst enemy. </p>
  			</div>

      } else {
  			return <div>
  				<input id="myinput" className="awesomplete" placeholder="Enter a player..."></input>
  				<Rivalry data={currOpponentData} margin={{top:25, bottom: 25, right: 25, left: 25}} />
  			</div>
      }
		} else {
			return <div>
				<input id="myinput" className="awesomplete" placeholder="Enter a player..."></input>
			</div>
		}
	}
}
