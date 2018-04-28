import React, { Component } from 'react';
import '../../css/App.css';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import {scroller} from '../scripts/scroller.js';
import * as _ from 'lodash';


export default class UnderPressure extends Component {
  constructor(props){

    super(props);
   

    

    this.state = {

    }
   }

    componentDidMount() {
    	const that = this
    	const {players, matches} = this.props

    	console.log(players)
    	console.log(matches)

    	console.log(ReactDOM.findDOMNode(this))
    	window.addEventListener('scroll', (event) => {
	      const divRect = ReactDOM.findDOMNode(this).parentNode.parentNode.getBoundingClientRect();
	      const topoffset = divRect.top + window.pageYOffset
	      const bottomoffset = divRect.bottom + window.pageYOffset
	      if (window.pageYOffset >= topoffset && window.pageYOffset <= bottomoffset - window.innerHeight) {
	        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_fixed", true)
	        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_unfixed", false)
	        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_bottom", false)
	      } else if (window.pageYOffset > bottomoffset - window.innerHeight) {
	        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_fixed", false)
	        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_unfixed", false)
	        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_bottom", true)
	      } else {
	        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_fixed", false)
	        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_unfixed", true)
	        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_bottom", false)
	      } 
	      
	  
	    })

    	function winloss() {

    	}

    	function threesets() {

    	}

    	function downaset() {

    	}

    	function tiebreak() {

    	}
	    const activateFunctions = [];
	    for (var i = 0; i < d3.selectAll('#sections6 .step').size(); i++) {
	      activateFunctions[i] = function () {};
	    }
	    activateFunctions[0] = winloss;
	    activateFunctions[1] = threesets;
	    activateFunctions[2] = downaset;
	    activateFunctions[3] = tiebreak;

	    var scroll = scroller()
	      .container(d3.select('#graphic6'));

	    scroll(d3.selectAll('#sections5 .step'), 'scroller6'); 


	    

	    scroll.on('active', function (index) {
	      // highlight current step text
	      d3.selectAll('#sections5 .step')
	        .style('opacity', function (d, i) { 
	          if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 600) {
	              return i === index ? 0.8 : 0.1; 
	          } else {
	            return i === index ? 1 : 0.1; 
	          }
	        });
	        activate(index);

	    })
	    
	    function activate(index) {
	    
	      that.setState({activeIndex: index});
	      var sign = (that.state.activeIndex - that.state.lastIndex) < 0 ? -1 : 1;
	      var scrolledSections = d3.range(that.state.lastIndex + sign, that.state.activeIndex + sign, sign);
	      scrolledSections.forEach(function (i) {
	        activateFunctions[i]();
	      });
	      that.setState({lastIndex: that.state.activeIndex});
	  	};

    }

  
  render() {
  	return <div className="pressurecontainer"></div>
  }
}

