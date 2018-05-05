import React, {Component}  from 'react';
import '../../css/App.css';
import Bracket from './Bracket';

export default class SlamTooltip extends Component {
	constructor(props){
	  super(props);
	  this.state = {
	  	style: this.props.tooltipStyle
	  }

  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
  	this.setState({style: nextProps.tooltipStyle})
  	//console.log(this.state)

  }


	render() {
		if (this.props.data == null) {
			return 	<div className='slam-tooltip' style={this.props.tooltipStyle}>
	 			<div className='tooltip-header'>&nbsp;</div>
	 			<Bracket />


	 		</div>
	 	} else {
	 		let slamdata = this.props.data
	 		Object.keys(slamdata).map(function (key) {
				if (slamdata[key] === " ") {
					slamdata[key] = '\xa0';
				}
			})

	 		const {tourney_id, tourney_name, round} = slamdata
	 		const tourney_year = tourney_id.slice(0,4)
	 		const {border} = this.props
	 		const borderStyle={borderBottom: "1px solid #a1a1a1"}
	 		return 	<div className='slam-tooltip' style={this.props.tooltipStyle}>
	 			<div className='tooltip-header' style={borderStyle}>{tourney_year} {tourney_name}, {round}</div>
	 			<Bracket data={slamdata} border={border} />


	 		</div>
	 	}
	}
}
