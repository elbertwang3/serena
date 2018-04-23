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
      currOpponentData: null,
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

  componentWillReceiveProps(nextProps) {
    const {data, margin} = nextProps
    this.setState({currOpponentData: data})

    const width = 600
    const height = 100 + data.length * 30 + margin.top + margin.bottom
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

    console.log(players)
    if (players.length == 1) {
      players.push({key: data[0]['loser_name'], value: 0})
    }
    const xScale = d3.scaleOrdinal()
      .domain([players.find(el => el['key'] == 'Serena Williams')['key'], players.find(el => el['key'] != 'Serena Williams')['key']])
      .range([xMidpoint - 60, xMidpoint + 60])


    const surfaceScale = d3.scaleOrdinal()
        .domain(["Hard", "Clay", "Grass"])
        .range(["#91ceff", "#f28b02", "#4ec291"])

    
  

    g.select(".middle-line")
      .attr("x1", xMidpoint)
      .attr("x2", xMidpoint)
      .attr("y1", 0)
      .attr("y2", innerHeight)

    let matches = g
      .select(".matches-group")
      .selectAll(".match-g")
      .data(data)
    console.log(matches)
    matches.exit().remove()


    const match = matches
      .enter()
      .append("g")
    .merge(matches)
      .attr("class", "match-g")
      .attr("transform", (d,i) => {
        return `translate(${xScale(d['winner_name'])}, ${30 * i})`
      })


    console.log(match)
    const matchCircle = match.selectAll(".match-circle")
      .data(d => [d])
      
    matchCircle.exit().remove()

    matchCircle
      .enter()
      .append("circle")
      .merge(matchCircle)
      .attr("fill", d => {
        return surfaceScale(d['surface'])
      })
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

    const slamOutline = match.selectAll(".slam-outline")
      .data(d => [d])
    
    console.log(slamOutline)
    slamOutline.exit().remove()

    slamOutline
      .enter()
      .append("circle")
    .merge(slamOutline)
      .attr("r", 12)
      .attr("stroke", d => d['tourney_level'] == "G" ? surfaceScale(d['surface']) : "white")
      .attr("fill", "none")
      .attr("class", "slam-outline")



    const profiles = g.selectAll(".profile")
      .data(players)

    profiles.exit().remove()

    const profile = profiles
      .enter()
      .append('g')
    .merge(profiles)
      .attr("class", "profile")
      .attr("transform", (d,i) => `translate(${xScale(d['key'])}, ${0})`)



    const profilePic = profile.selectAll(".profile-pic")
      .data(d => [d])

    console.log(profilePic)
    profilePic
      .enter()
      .append("svg:image")
    .merge(profilePic)
      .attr("xlink:href", d => {
        console.log(d)
        console.log(profileimages[`${d['key']}.gif`])
        return profileimages[`${d['key']}.gif`] ? profileimages[`${d['key']}.gif`] : profileimages[`averageWTAplayer.gif`] 
      })
      .attr("width", 50)
      .attr("x", -25)
      .attr("class", "profile-pic")


    const numWins = profile.selectAll(".numwins")
      .data(d => [d])

    numWins
      .enter()
      .append('text')
    .merge(numWins)
      .text(d => d['value'])
      .attr("class", "numwins")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(0,70)")

    const playerWins = profile.selectAll(".profile .player-name")
      .data(d => [d])
    playerWins
      .enter()
      .append('text')
    .merge(playerWins)
      .text(d => d['key'])
      .attr("class", "player-name")
      .attr("text-anchor", (d,i) => d['key'] == 'Serena Williams' ? "end" : "start")
      .attr("x",  (d,i) => d['key'] == 'Serena Williams' ? -30 : 30)
      .attr("y", 30)

  }

  componentDidMount() {
  	const {data, annotations, margin} = this.props
    this.setState({currOpponentData: data})
    const width = 600
    const height = 100 + data.length * 30 + margin.top + margin.bottom
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

    console.log(players)
    if (players.length == 1) {
      players.push({key: data[0]['loser_name'], value: 0})
    }
    console.log(players.find(el => el['key'] == 'Serena Williams'))
    const xScale = d3.scaleOrdinal()
    	.domain([players.find(el => el['key'] == 'Serena Williams')['key'], players.find(el => el['key'] != 'Serena Williams')['key']])
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

   	const matches = g.append("g")
   		.attr("transform", "translate(0,100)")
      .attr("class", "matches-group")
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

    matches
      .append("circle")
      .attr("r", 12)
      .attr("stroke", d => d['tourney_level'] == "G" ? surfaceScale(d['surface']) : "white")
      .attr("fill", "none")
      .attr("class", "slam-outline")

    var swoopy = swoopyArrow()
        .angle(Math.PI/4)
        .x(function(d) { return d[0]; })
        .y(function(d) { return d[1]; });

    if (annotations != null) {
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
    }

    const profiles = g.selectAll(".profile")
      .data(players)
      .enter()
      .append('g')
      .attr("class", "profile")
      .attr("transform", (d,i) => `translate(${xScale(d['key'])}, ${0})`)


    profiles.append("svg:image")
      .attr("xlink:href", d => {
         return profileimages[`${d['key']}.gif`] ? profileimages[`${d['key']}.gif`] : profileimages[`averageWTAplayer.gif`] 
      })
      .attr("width", 50)
      .attr("x", -25)
      .attr("class", "profile-pic")


    const numwins = profiles.append('text')
      .text(d => d['value'])
      .attr("class", "numwins")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(0,70)")

    profiles.append('text')
      .text(d => d['key'])
      .attr("class", "player-name")
      .attr("text-anchor", (d,i) => d['key'] == 'Serena Williams' ? "end" : "start")
      .attr("x",  (d,i) => d['key'] == 'Serena Williams' ? -30 : 30)
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
    window.addEventListener('scroll', (event) => {
      const divRect = this.divRef.current.getBoundingClientRect();
      const topoffset = divRect.top + window.pageYOffset
      this.setState({topoffset: topoffset})
    })
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

  	const {data, annotations, margin} = this.props
  	const {currMatchData, tooltipStyle, border} = this.state
    const width = 600
    const height = 100 + data.length * 30 + margin.top + margin.bottom
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
