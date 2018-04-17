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
	 		let slamdata = this.props.data
	 		Object.keys(slamdata).map(function (key) {
				if (slamdata[key] == " ") {
					slamdata[key] = '\xa0';
				}
			})

	 		const {tourney_year, tourney_name, round, data} = slamdata
	 		const {border} = this.props
	 		const borderStyle={borderBottom: "1px solid #a1a1a1"}
	 		return 	<div className='slam-tooltip' style={this.props.position}>
	 			<div className='tooltip-header' style={borderStyle}>{tourney_year} {tourney_name}, {round}</div>
	 			<Bracket data={slamdata} border={border} />


	 		</div>
	 	}
	}
}