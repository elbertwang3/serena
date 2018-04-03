import React, {Component}  from 'react';
import '../../css/App.css';
import * as d3 from 'd3';
import {json as requestJson} from 'd3-request';

const DATA_URL = '../data/serenaranking.csv'; // eslint-disable-line

export default class RankingLine extends Component {

	constructor(props){
		 super(props);
		 
  }
   	componentDidMount() {
      this.createLineChart()
   }
   componentDidUpdate() {
      this.createLineChart()
   }
   createLineChart() {
    	console.log(this.props.data)
      /*const dataMax = max(this.props.data)
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
      .attr('width', 25)*/
   }
render() {
      return <svg ref={node => this.node = node}
      width={500} height={500}>
      </svg>
   }
}