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
        opacity: 0.9,
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

        this.setState(prevState => ({
        
            currMatchData: d,
            tooltipStyle: {
              ...prevState.tooltipStyle,
              position: 'absolute',
              display: 'block',
              left: (window.innerWidth/2 - 155),
              top: (d3.event.pageY + 30 - this.state.topoffset)
        
            }
          }))
    
   		})
      .on('mouseout', d => {
   
        this.setState(prevState => ({
           
            tooltipStyle: {
              ...prevState.tooltipStyle,
              display: 'none'
            }
          }))
 

      })

    matches.filter(d => d['tourney_level'] == "G")
      .append("circle")
      .attr("r", 12)
      .attr("stroke", d => surfaceScale(d['surface']))
      .attr("fill", "none")
      .attr("class", "slam-outline")

    var swoopy = swoopyArrow()
        .angle(Math.PI/4)
        .x(function(d) { return d[0]; })
        .y(function(d) { return d[1]; });

    const ranking_annotation = d3.select(this.gRef.current)
        .append("g")
        .attr("class", "rivalry-anntoations")
        .selectAll(".rivalry-annotation")
        .data(annotations)
        .enter()
        .append("g")
        .attr("class", "rivalry-annotation")
        .attr("transform", d => {
          return `translate(${d['x1']}, ${d['y1']})`
        })


    ranking_annotation.append("text")
      .text(function(d) { return d['annotation']})
     
      // .attr("x", d => d['x1'])
      // .attr("y", d => d['y1'])
      .attr("x", d => (d['x1'] > d['x2'] ? 10 : -10))
      
        //(d['y1'] > d['y2']) ? -d3.select(this).node().getBBox().height : d3.select(this).node().getBBox().height )
      .attr("dy", "1.25em")
      .attr("text-anchor", d => (d['x1'] > d['x2'] ? "start" : "end"))
      .call(this.wrap, 130)

    ranking_annotation.selectAll("text")
      .attr("y", function(d) {
        return -d3.select(this).node().getBBox().height/2;
      })
 

    ranking_annotation.append("path")
      .attr('marker-end', 'url(#arrowhead2)')
      .datum(function(d) {
        return [[0,0], [d['x2']-d['x1'], d['y2']-d['y1']]]
      })
      .attr("d", swoopy)
      .attr("class", "swoopy-arrow")

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


    const numwins = profiles.append('text')
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

    window.addEventListener('resize', () => {
      const divRect = this.divRef.current.getBoundingClientRect();
      const topoffset = divRect.top + window.pageYOffset
      this.setState({topoffset: topoffset})

      var chart = this.svgRef.current
      var chartWidth = chart.getAttribute("width")
      var chartHeight = chart.getAttribute("height")

      var aspect = chartWidth / chartHeight
      var parentcontainer = ReactDOM.findDOMNode(this)
      if (parentcontainer.offsetWidth >= 600) {
        var targetWidth = 600
        chart.setAttribute('width', targetWidth)
        chart.setAttribute('height', targetWidth/aspect)
      } else {
        var targetWidth = parentcontainer.offsetWidth
        chart.setAttribute('width', targetWidth)
        chart.setAttribute('height', targetWidth/aspect)
      }
     

     
    })
    
    window.dispatchEvent(new Event('resize'));

    /*window.addEventListener('scroll', (event) => {
      const divRect = this.divRef.current.getBoundingClientRect();

      const topoffset = divRect.top + window.pageYOffset
      const bottomoffset = divRect.bottom + window.pageYOffset
      const offset = window.innerHeight/2
      const realHeight = bottomoffset - topoffset
      //console.log(realHeight)
      const ratio = realHeight/this.props.height;
      //console.log(this.props.height)
      //console.log(ratio)
      var pageYOffset = (window.pageYOffset - topoffset)/ratio 
      //console.log(pageYOffset)
      pageYOffset = pageYOffset - (window.innerHeight * (1-ratio))
      //console.log(window.pageYOffset)
      //console.log(topoffset)
      //console.log(bottomoffset)
      console.log(pageYOffset + offset)
      //console.log(matches.selectAll("circle").getBBox())
      matches.each((d,i) => {
        let that = this
        console.log(d3.select(that))
        //console.log(d3.selectAll(".match-g")[i].attr("transform"))
      })

      if (window.pageYOffset >= topoffset && window.pageYOffset <= bottomoffset - 150) {
        profiles.attr('transform', d => `translate(${xScale(d['key'])}, ${pageYOffset + 20})`)    
      } else if (window.pageYOffset <= topoffset) {
        profiles.attr('transform', d => `translate(${xScale(d['key'])}, 0)`); 
      }
    })*/
  }
  wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1,
            x = text.attr("x"), // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", +lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }

  render() {
  	const {data, annotations, width, height, margin} = this.props
  	const {currMatchData, tooltipStyle, border} = this.state
   	return <div className="rivalry-container" ref={this.divRef}>
   		<SlamTooltip data={currMatchData} tooltipStyle={tooltipStyle} border={border}/>
   		<svg className="rivalry-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} ref={this.svgRef}>
        <g transform={`translate(${margin.left}, ${margin.top})`} ref={this.gRef} />
        <defs>
          <marker id="arrowhead2" viewBox="-10 -10 20 20" refX="0" refY="0" markerWidth="20" markerHeight="20" strokeWidth="1" fill="black" orient="auto"><polyline strokeLinejoin="bevel" points="-6.75,-6.75 0,0 -6.75,6.75"></polyline>
          </marker>
        </defs>

      </svg>
   	</div>

  }
}
