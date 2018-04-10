import React, {Component}  from 'react';
import '../../css/App.css';
import * as d3 from 'd3';
import {json as requestJson} from 'd3-request';
import Bracket from './Bracket';

export default class SlamTooltip extends Component {
	constructor(props){
	  super(props);
  }

  componentDidMount() {

  	//this.tooltipRef.appen
  }

  componentWillReceiveProps() {

  }


	render() {
		if (this.props.data == null) {
			return 	<div className='slam-tooltip'>
	 			<div className='tooltip-header'>&nbsp;</div>
	 			<Bracket />


	 		</div>
	 	} else {
	 		let props = this.props.data
	 		Object.keys(props).map(function (key) {
  			if (props[key] == " ") {
  				props[key] = '\xa0';
  			}
  		})
	 		const {year, slam, result2} = props
	 		return 	<div className='slam-tooltip' style={this.props.position}>
	 			<div className='tooltip-header'>{year} {slam}, {result2}</div>
	 			<Bracket data={this.props.data} />


	 		</div>
	 	}
	}
}