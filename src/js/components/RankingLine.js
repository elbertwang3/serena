import React, {Component}  from 'react';
import '../../css/App.css';
import * as d3 from 'd3';
import {json as requestJson} from 'd3-request';

const DATA_URL = '../data/serenaranking.csv'; // eslint-disable-line

export default class RankingLine extends Component {

	constructor(props){
    super(props);
      this.state = {
        margin: {top: 50, right: 25, bottom: 25, left: 25},
        width: window.innerWidth,
        height: 2000,
        data: null,
        g: null
    };
  }
  componentDidMount() {
    var files = ["data/serenaranking.csv"];
    Promise.all(files.map(url => d3.csv(url, this.type.bind(this)))).then(values => {
      this.setState({
        data: values[0] },
        () => {
          this.createLineChart()
        }
      )
    })  
  }

  onRef = (ref) => {
    this.setState({ g: d3.select(ref) })
  }
  componentWillReceiveProps() {
    console.log(this.props.data);
  }
   /*componentDidUpdate() {
      this.createLineChart()
   }*/
   createLineChart() {
      var {width, height, margin, data} = this.state
      const innerWidth = width - margin.left - margin.right
      const innerHeight =  height - margin.top - margin.bottom

      console.log(data);
      const parseDate = d3.timeParse('%Y-%m-%d');
      const yExtent = d3.extent(data, d => 
        parseDate(d['ranking_date'])
      );
      console.log(yExtent)

      const xExtent = d3.extent(data, d => 
        d['ranking']
      );
      console.log(xExtent)
      const yScale = d3.scaleTime()
        .domain(yExtent)
        .range([innerHeight, 0]);
      const xScale = d3.scaleLinear()
        .domain([500,100,10,3,2,1])
        .range([0, innerWidth/6, 2*innerWidth/6, 3*innerWidth/6, 4*innerWidth/6, 5*innerWidth/6, innerWidth])

      const line = d3.line()
          .y(d => yScale(parseDate(d.ranking_date)))
          .x(d => xScale(d.ranking));


      this.state.g.append("path")
        .datum(data)
        .attr("class", "ranking-line")
        .attr("d", line);
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
    
      return <svg className="ranking-line-svg" width={width} height={height}>
        <g transform={`translate(${margin.left}, ${margin.top})`} ref={this.onRef} />
      </svg>
   }
}