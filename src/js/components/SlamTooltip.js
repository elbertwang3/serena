import React, {Component}  from 'react';
import '../../css/App.css';
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
	 		const {year, tourney_name, round, style} = props
	 		console.log(style)
	 		return 	<div className='slam-tooltip' style={this.props.position}>
	 			<div className='tooltip-header'>{year} {tourney_name}, {round}</div>
	 			<Bracket data={this.props.data} />


	 		</div>
	 	}
	}
}