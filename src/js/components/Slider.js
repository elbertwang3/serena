import React, { Component } from 'react';
import '../../css/App.css';

export default class Slider extends Component {

	render() {
		const {type, min, max, value} = this.props
		return <div className='slider'><input type={type} min={min} max={max} value={value}></input></div>
	}
}