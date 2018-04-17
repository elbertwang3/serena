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
    	profileimages: null,
    	currMatchData: null,
    };
  }
  importAllFlags(r) {
 
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }

  componentWillMount() {
  	const profileimages = this.importAllFlags(require.context('../../images/profiles', false, /\.(gif|svg)$/));
  	this.setState({profileimages: profileimages})
  }

  componentDidMount() {
  	const {data, annotations, width, height, margin} = this.props
  	const {profileimages} = this.state
  	const innerWidth = width - margin.left - margin.right
    const innerHeight =  height - margin.top - margin.bottom
    const g = d3.select(this.gRef.current)
    const parseDate = d3.timeParse('%Y-%m-%d');
   	const yExtent = d3.extent(data, d => 
        parseDate(d['tourney_date'])
      );



    const yScale = d3.scaleTime()
      .domain(yExtent)
      .range([0, innerHeight]);


    const xMidpoint = innerWidth / 2
    const players = d3.nest()
		  .key(function(d) { return d['winner_name']; })
		  .rollup(function(v) { return v.length; })
  		.entries(data);

    const xScale = d3.scaleOrdinal()
    	.domain([players[0], players[1]])
    	.range([xMidpoint - 60, xMidpoint + 60])


    const surfaceScale = d3.scaleOrdinal()
        .domain(["Hard, Clay, Grass"])
        .range(["#91ceff", "#f28b02", "#4ec291"])

    const profiles = g.selectAll(".profile")
    	.data(players)
    	.enter()
    	.append('g')
    	.attr("class", "profile")
    	.attr("transform", (d,i) => `translate(${xScale(d['key'])}, ${0})`)


    profiles.append("svg:image")
     	.attr("xlink:href", d => {
     		return profileimages[`${d['key']}.gif`]
      })
      .attr("width", 50)
      .attr("x", -25)


    profiles.append('text')
    	.text(d => d['value'])
    	.attr("class", "numwins")
    	.attr("text-anchor", "middle")
    	.attr("transform", "translate(0,70)")

    profiles.append('text')
    	.text(d => d['key'])
    	.attr("class", "player-name")
    	.attr("text-anchor", (d,i) => i == 1 ? "end" : "start")
    	.attr("x", (d,i) => i == 1 ? -30 : 30)
    	.attr("y", 30)
  

    g.append("line")
    	.attr("class", "middle-line")
    	.attr("x1", xMidpoint)
    	.attr("x2", xMidpoint)
    	.attr("y1", 0)
    	.attr("y2", innerHeight)

    /*const yearticks = g.append("g")
    	.attr("class", "year-ticks")

    const tickValues = yScale.ticks(d3.timeYear)
   	const yearFormat = d3.timeFormat("%Y")

    console.log(tickValues)

    yearticks.selectAll(".year-tick")
    	.data(tickValues)
    	.enter()
    	.append("text")
    	.attr("x", xMidpoint)
    	.attr("y", d => yScale(d))
    	.text(d => yearFormat(d))
    	.attr("text-anchor", "middle")*/

   	const matches = g.append("g")
   		.attr("transform", "translate(0,100)")
   		.selectAll(".matches")
   		.data(data)
   		.enter()
   		.append("g")
   		.attr("class", "match-g")
   		.attr("transform", (d,i) => {
   			return `translate(${xScale(d['winner_name'])}, ${30 * i})`
   		})

   	matches.append("circle")
   		.attr("fill", d => surfaceScale(d['surface']))
   		.attr("r", 10)
   		//.attr()
   		.attr("class", "match-circle")
   		.on("mouseover", d => {
   			this.setState({currMatchData: d})
   		})

  }
  render() {
  	const {data, annotations, width, height, margin} = this.props
  	const {currMatchData} = this.state
   	return <div className="rivalry-container" ref={this.divRef}>
   		<SlamTooltip data={currMatchData} />
   		<svg className="rivalry-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} ref={this.svgRef}>
          <g transform={`translate(${margin.left}, ${margin.top})`} ref={this.gRef} />
        </svg>
   	</div>

  }
}
