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
    	tooltipStyle: {
    		position: 'absolute',
        display: 'none',
        background: 'white',
        opacity: 0.9
    	},
    	border: '1px solid #a1a1a1',
      topoffset: null
    }
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
    console.log(this.state)
    const divRect = this.divRef.current.getBoundingClientRect();
    const topoffset = divRect.top + window.pageYOffset
    this.setState({topoffset: topoffset})
    console.log(this.state)
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
        .domain(["Hard", "Clay", "Grass"])
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
   		.attr("class", "match-circle")
   		.on("mouseover", d => {
        console.log("over")
            //console.log(d3.select(this).attr("cy"))
        this.setState(prevState => ({
        
            currMatchData: d,
            tooltipStyle: {
              ...prevState.tooltipStyle,
              position: 'absolute',
              display: 'block',
              left: (xMidpoint - 155),
              top: (d3.event.pageY + 30 - this.state.topoffset)
        
            }
          }))
        console.log("setting state")
        console.log(this.state)
   		})
      .on('mouseout', d => {
         console.log("out")
        this.setState(prevState => ({
           
            tooltipStyle: {
              ...prevState.tooltipStyle,
              display: 'none'
            }
          }))
        console.log("setting state")
        console.log(this.state)

      })

    matches.filter(d => d['tourney_level'] == "G")
      .append("circle")
      .attr("r", 12)
      .attr("stroke", d => surfaceScale(d['surface']))
      .attr("fill", "none")
      .attr("class", "slam-outline")


    window.addEventListener('resize', () => {
      const divRect = this.divRef.current.getBoundingClientRect();
      const topoffset = divRect.top + window.pageYOffset
      this.setState({topoffset: topoffset})

      var chart = document.getElementsByClassName('serve-graphic-svg')[0]
      var chartWidth = chart.getAttribute("width")
      var chartHeight = chart.getAttribute("height")
      var aspect = chartWidth / chartHeight
      var parentcontainer = ReactDOM.findDOMNode(this)
      var targetWidth = parentcontainer.offsetWidth;
      if (targetWidth < 700) {
        chart.setAttribute('width', targetWidth)
        chart.setAttribute('height', window.innerHeight)

      } else {
        chart.setAttribute('width', 700)
        chart.setAttribute('height', window.innerHeight)
      }
    })
    
    window.dispatchEvent(new Event('resize'));

  }
  render() {
  	const {data, annotations, width, height, margin} = this.props
  	const {currMatchData, tooltipStyle, border} = this.state
    console.log(tooltipStyle)
   	return <div className="rivalry-container" ref={this.divRef}>
   		<SlamTooltip data={currMatchData} tooltipStyle={tooltipStyle} border={border}/>
   		<svg className="rivalry-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} ref={this.svgRef}>
          <g transform={`translate(${margin.left}, ${margin.top})`} ref={this.gRef} />
        </svg>
   	</div>

  }
}
