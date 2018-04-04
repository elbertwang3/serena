import React, {Component}  from 'react';
import '../../css/App.css';
import * as d3 from 'd3';
import {json as requestJson} from 'd3-request';
import {swoopyArrow} from '../swoopyArrow'

export default class RankingLine extends Component {

	constructor(props){
    super(props);
    this.divRef = React.createRef(); 
    this.gRef = React.createRef();
    this.state = {
      margin: {top: 50, right: 25, bottom: 25, left: 50},
      width: 500,
      height: 4000,
      linedata: null,
      slamdata: null,
      g: null
    };
  }
  componentDidMount() {
    console.log(this.divRef.current);
    window.addEventListener('scroll', (event) => {
      const divRect = this.divRef.current.getBoundingClientRect();
      const topoffset = divRect.top + window.pageYOffset
      const bottomoffset = divRect.bottom + window.pageYOffset
      /*console.log(divRect.top)
      console.log(window.pageYOffset);
      console.log(topoffset);
      console.log(bottomoffset)
      console.log(window.pageYOffset);
      console.log(window.innerHeight);*/
      if (window.pageYOffset >= topoffset && window.pageYOffset <= bottomoffset - window.innerHeight) {
      
        console.log("getting inside");
         d3.select("#intro-ranking-x-axis").attr('transform', `translate(0, ${window.pageYOffset - window.innerHeight})`);
      } else if (window.pageYOffset <= topoffset && window.pageYOffset) {

        d3.select("#intro-ranking-x-axis").attr('transform', `translate(0, 0)`);
      }
      /*if (topoffset <= 0 && bottomoffset >= 0) {
        console.log(topoffset);
        console.log(bottomoffset);
        console.log(window.pageYOffset)
        console.log(`translate(0, ${10 + topoffset})`)
        d3.select("#intro-ranking-x-axis").attr('transform', `translate(0, ${10 + window.pageYOffset})`);
      }*/
      
    //}
      
    })  
    var files = ["data/serenaranking.csv", "data/slamresults.csv"];
    Promise.all(files.map(url => d3.csv(url, this.type.bind(this)))).then(values => {
      console.log(values[0])
      console.log(values[1])
      this.setState({
        linedata: values[0],
        slamdata: values[1] },
        () => {
          this.createLineChart()
        }
      )
    })
   
  }
  
  componentWillReceiveProps() {
    console.log(this.props.data);
  }
   /*componentDidUpdate() {
      this.createLineChart()
   }*/
  createLineChart() {
      var {width, height, margin, linedata, slamdata} = this.state
      const innerWidth = width - margin.left - margin.right
      const innerHeight =  height - margin.top - margin.bottom

    
      const parseDate = d3.timeParse('%Y-%m-%d');
      const yExtent = d3.extent(linedata, d => 
        parseDate(d['ranking_date'])
      );


      const xExtent = d3.extent(linedata, d => 
        d['ranking']
      );
      const yScale = d3.scaleTime()
        .domain(yExtent)
        .range([0, innerHeight]);
      const xScale = d3.scaleLinear()
        .domain([500,100,10,5,1])
        .range([0, 1*innerWidth/4, 2*innerWidth/4, 3*innerWidth/4, innerWidth])


      const slamColorScale = d3.scaleOrdinal()
        .domain(["Australian Open", "French Open", "Wimbledon", "US Open"])
        .range(["#91ceff", "#f28b02", "#4ec291", "#91ceff"])

      const line = d3.line()
        .curve(d3.curveStep)
        .y(d => yScale(parseDate(d.ranking_date)))
        .x(d => xScale(d.ranking));


      d3.select(this.gRef.current).append("g")
        .append("path")
        .datum(linedata)
        .attr("class", "ranking-line")
        .attr("d", line);

      d3.select(this.gRef.current).append("g")
        .attr("class", "slams")
        .selectAll(".slam")
        .data(slamdata)
        .enter()
        .append("path")
        .attr("d", (d) => { 
          const slamline = d3.line()
            .curve(d3.curveStep)
            .y(d => yScale(parseDate(d.ranking_date)))
            .x(d => xScale(d.ranking));
          return slamline
        })

      /*d3.select(this.gRef.current).append("g")
        .selectAll(".week")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d['ranking']))
        .attr("cy", d => yScale(parseDate(d['ranking_date'])))
        .attr("r", 0.5)
        .attr("class", "week-circle")*/

      const xAxis = d3.select(this.gRef.current).append("g")
        .call(d3.axisTop(xScale)
        .tickValues([500,100,10,5,3,2,1]))
        .attr("class", "intro-ranking-axis")
        .attr("id", "intro-ranking-x-axis")

      d3.select(this.gRef.current).append("g")
        .call(d3.axisLeft(yScale)
          .ticks(d3.timeYear.every(1)))
        .attr("class", "intro-ranking-axis")

      var swoopy = swoopyArrow()
        .angle(Math.PI/4)
        .x(function(d) { return d[0]; })
        .y(function(d) { return d[1]; });

      const annotations = d3.select(this.gRef.current)
        .append("g")

      annotations.append("path")
        .attr('marker-end', 'url(#arrowhead)')
        .datum([[100,200],[300,400]])
        .attr("d", swoopy)
        .attr("class", "swoopy-arrow")
      /*const dataMax = d3.max(this.props.data)
      const yScale = scaleLinear()
         .domain([0, dataMax])
         .range([0, this.props.size[1]])
   
          d3.select(node)
      .selectAll('rect')
      .data(this.props.data)
      .enter()
      .append('rect')
   
   select(node)
      .selectAll('rect')
      .data(this.props.data)
      .exit()
      .remove()
   
   select(node)
      .selectAll('rect')
      .data(this.props.data)
      .style('fill', '#fe9922')
      .attr('x', (d,i) => i * 25)
      .attr('y', d => this.props.size[1] — yScale(d))
      .attr('height', d => yScale(d))
      .attr('width', 25)

   const xScale = d3.scaleTime()
          .domain(xExtent)
          .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
          .domain(yExtent)
          .range([innerHeight, 0])
          .nice();

        // Axes
        const xAxis = d3.axisBottom(xScale)
          .tickPadding(0);

        const yAxis = d3.axisLeft(yScale)
          .tickSize(-innerWidth - margins.left)
          .tickPadding(0);

        const line = d3.line()
          .x(d => xScale(parseYear(d.year)))
          .y(d => yScale(d.value));*/
   }
    type(d) { 
    d['ranking'] = +d['ranking'];
    return d;
  }
    render() {
      const {width, height, margin} = this.state
    
      return <div id="rankingline" ref={this.divRef}>
        <svg className="ranking-line-svg" width={width} height={height}>
          <g transform={`translate(${margin.left}, ${margin.top})`} ref={this.gRef} />
          <defs>
            <marker id="arrowhead" viewBox="-10 -10 20 20" refX="0" refY="0" markerWidth="20" markerHeight="20" strokeWidth="1" fill="white" orient="auto"><polyline strokeLinejoin="bevel" points="-6.75,-6.75 0,0 -6.75,6.75"></polyline>
            </marker>
          </defs>
        </svg>
      </div>
   }
}