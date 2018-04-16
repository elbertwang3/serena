import React, { Component } from 'react';
import '../../css/App.css';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import {swoopyArrow} from '../scripts/swoopyArrow';
import SlamTooltip from './SlamTooltip.js';


export default class Rivalry extends Component {
  constructor(props){
    super(props);
    this.divRef = React.createRef(); 
    this.gRef = React.createRef();
    this.svgRef = React.createRef();
    this.state = {
    	profiles: null
    };
  }
  importAllFlags(r) {
 
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }

  componentWillMount() {
  	const profiles = this.importAllFlags(require.context('../../images/profiles', false, /\.(gif|svg)$/));
  }

  componentDidMount() {
  	const {data, annotations, width, height, margin} = this.props
  	const innerWidth = width - margin.left - margin.right
    const innerHeight =  height - margin.top - margin.bottom
    const g = d3.select(this.gRef.current)
    console.log(g);
    const parseDate = d3.timeParse('%Y-%m-%d');
   	const yExtent = d3.extent(data, d => 
        parseDate(d['tourney_date'])
      );



    const yScale = d3.scaleTime()
      .domain(yExtent)
      .range([0, innerHeight]);


    const xMidpoint = innerWidth / 2
    console.log(xMidpoint)
    const players = d3.nest()
		  .key(function(d) { return d['winner_name']; })
		  .rollup(function(v) { return v.length; })
  		.entries(data);

    console.log(players)
    const xScale = d3.scaleOrdinal()
    	.domain([players[0], players[1]])
    	.range([xMidpoint - 60, xMidpoint + 60])

    const surfaceScale = d3.scaleOrdinal()
        .domain(["Hard, Clay, Grass"])
        .range(["#91ceff", "#f28b02", "#4ec291"])

    const profiles = g.selectAll(".players")
    	.data(players)
    	.enter()
    	.append('g')
    	.attr("transform", (d,i) => `translate(${xScale(d)}, ${0})`)


     /*profiles.append("svg:image")
     .attr("xlink:href", d => {
     		return `${d}.gif`
      })
      .attr("width", 30)

    profiles.append('text')
    	.text(d => )*/
  

    g.append("line")
    	.attr("class", "middle-line")
    	.attr("x1", xMidpoint)
    	.attr("x2", xMidpoint)
    	.attr("y1", 0)
    	.attr("y2", innerHeight)

   	const matches = g.selectAll(".matches")
   		.data(data)
   		.enter()
   		.append("g")
   		.attr("class", "match-g")
   		.attr("transform", (d,i) => {
   			return `translate(${xScale(d['winner_name'])}, ${25 * i})`
   		})

   	matches.append("circle")
   		.attr("fill", d => surfaceScale(d['surface']))
   		.attr("r", 10)
   		//.attr()
   		.attr("class", "match-circle")
    
  }
  render() {
  	const {data, annotations, width, height, margin} = this.props
   	return <div className="rivalry-container" ref={this.divRef}>
   		{<svg className="rivalry-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} ref={this.svgRef}>
          <g transform={`translate(${margin.left}, ${margin.top})`} ref={this.gRef} />
        </svg>}
   	</div>

  }
}
