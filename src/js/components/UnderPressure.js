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
      const margin = {top: 25, bottom: 25, right: 100, left: 150}
    	const {data} = this.props

      const chart = stackedbar()

      const el = d3.select('.pressurecontainer')
      let playerScale = d3.scaleBand()
      let percentScale = d3.scaleLinear()

      let width = 0
      let height = 0
      let chartWidth = 0
      let chartHeight = 0
      let cut = "total"
      let barSpacing = 2
      let barHeight = 0

      function resize() {
        //const sz = Math.min(el.node().offsetWidth, window.innerHeight) * 0.9
        const width = window.innerWidth
        const height = window.innerHeight
        chart.width(width).height(height)
        el.call(chart)
      }

      function stackedbar() {

        let currXScale = null
        let currYScale = null

        function translate(x, y) {
          return `translate(${x}, ${y})`
        }

        function enter({ container, data }) {
          const svg = container.selectAll('svg').data([data])
          const svgEnter = svg.enter().append('svg').attr("class", "pressuresvg")
          const gEnter = svgEnter.append('g')
          const axis = gEnter.append('g').attr('class', 'g-axis')
          const xAxis = axis.append('g').attr('class', 'x-axis')
          const yAxis = axis.append('g').attr("class", 'y-axis')
          gEnter.append('g').attr("class", "stacked-bars")
        }

        function updateScales({ container, data }) {
          const players = data.map(d => d['player'])
          playerScale
            .domain(players)
            .rangeRound([0, chartHeight])
            .paddingInner(0.1)

          percentScale
            .domain([0, 1])
            .range([0, chartWidth])
        }

        function updateDom({ container, data }) {
          const svg = container.select('svg')

          svg
            .attr('width', width)
            .attr('height', height)

          barHeight = chartHeight/data.length


          const g = svg.select('g')
          g.attr('transform', translate(margin.left, margin.top))

          const bars = g.select(".stacked-bars")


          const barg = bars.selectAll(".stacked-bar-g")
            .data(data, d => d['player'])

          barg.exit().remove()

          barg
            .enter()
            .append("g")
          .merge(barg)
            .attr("class", "stacked-bar-g")
            .transition()
            .duration(1000)
            .attr("transform", d => `translate(0, ${playerScale(d['player'])})`)

          const barpercent = barg.selectAll(".percent-anno")
            .data(d => {

              switch(cut) {
              case "total":
                return [d['totalwin'] / d['total']]
                break
              case "three":
                return [d['threesetwin'] / d['totalthreeset']]
                break
              case "down":
                return [d['downasetwin'] / d['totaldownaset']]
                break
              case "tiebreak":
                return [d['tiebreakwin'] / d['totaltiebreak']]
                break
              }
            })
          barpercent.exit().remove()
          barpercent
            .enter()
            .append("text")
            .text(d => d)
            .attr("class", "percent-anno")
            .attr("transform", `translate(${chartWidth+10}, ${playerScale.bandwidth()/2})`)
            .attr("text-anchor", "start")
            .attr("alignment-baseline", "middle")

          const bar = barg.selectAll(".stacked-bar")
            .data(d => {
              switch(cut) {
                case "total":
                  return [d['totalwin'], d['totalloss']]
                  break
                case "three":
                  return [d['threesetwin'], d['threesetloss']]
                  break
                case "down":
                  return [d['downasetwin'], d['downasetloss']]
                  break
                case "tiebreak":
                  return [d['tiebreakwin'], d['tiebreakloss']]
                  break
                default:
                  return [d['totalwin'], d['totalloss']]
              }
            })

            bar.exit().remove()
            bar
              .enter()
              .append("rect")
            .merge(bar)
              .attr("height", playerScale.bandwidth())

              .attr("y", 0)
              .transition()
              .delay(1000)
              .duration(1000)
              .attr("x", (d,i,nodes) => {
                let lastdata = d3.select(nodes[i - 1]).data()[0]
                return i == 0 ? 0 : percentScale(lastdata /(d+lastdata))
              })
              .attr("width", (d,i,nodes) => {
                let total = i == 0 ? d + d3.select(nodes[i + 1]).data()[0] : d + d3.select(nodes[i - 1]).data()[0]
                return percentScale(d/total)
              })
              .attr("fill", (d, i) => i == 0 ? "blue" : "orange")
              .attr("class", "stacked-bar")

              const bartext = barg.selectAll(".stacked-bar-text")
                .data(d => {
                  switch(cut) {
                    case "total":
                      return [d['totalwin'], d['totalloss']]
                      break
                    case "three":
                      return [d['threesetwin'], d['threesetloss']]
                      break
                    case "down":
                      return [d['downasetwin'], d['downasetloss']]
                      break
                    case "tiebreak":
                      return [d['tiebreakwin'], d['tiebreakloss']]
                      break
                    default:
                      return [d['totalwin'], d['totalloss']]
                  }
                })
              bartext.exit().remove()
              bartext
                .enter()
                .append("text")
              .merge(bartext)
                .text(d => d)
                .attr("transform", (d, i) => i == 0 ? `translate(0,${playerScale.bandwidth()/2})` : `translate(${chartWidth},${playerScale.bandwidth()/2})`)
                .attr("text-anchor", (d, i) => i == 0 ? "start" : "end")
                .attr("class", "stacked-bar-text")
                .attr("alignment-baseline", "middle")



        }



        function updateAxis({ container, data }) {
          const axis = container.select('.g-axis')

          const axisLeft = d3.axisLeft(playerScale)
          //const axisBottom = d3.axisBottom(percentScale)
          //axisBottom.selectAll(".domain").remove()
          //axisBottom.selectAll(".tick").remove()

          //axisLeft.ticks(Math.floor(currYScale.range()[0] / 100))
          //axisBottom.ticks(Math.floor(percentScale.range()[1]/ 100)); //for yearscale
          //axisBottom.ticks(d3.range(scaleX.domain()[0], scaleX.domain()[1], 5)) //for agescale
          //axisLeft.ticks(d3.range(scaleY.domain()[0], scaleY.domain()[1], 100)) //for weeks
          //axisLeft.ticks(d3.range(scaleY.domain([0], scaleY.domain([1], 5)))) //for slams
          const x = axis.select('.x-axis')


          const maxY = playerScale.range()[0]




          const y = axis.select('.y-axis')


          y.transition().duration(1000).call(axisLeft)

          /*x.select('.axis__label')
            .attr("transform", `translate(${chartWidth/2}, ${margin.bottom*1.5/2})`)

          y.select('.axis__label')
            .attr('transform', `translate(${-margin.left/2}, ${chartHeight/2}) rotate(-90)`)*/

          //x.select(".domain").remove()
          y.select(".domain").remove()
          //x.selectAll(".tick").append("")
          y.selectAll(".tick")
            .select("line")
            .remove()




          x.select(".axis__label")
            .text("percent wins")




        }

        function chart(container) {
          const data = container.datum()
          enter({ container, data })
          updateScales({ container, data })
          updateAxis({ container, data })
          updateDom({ container, data })

        }

        chart.width = function(...args) {
          if (!args.length) return width
          width = args[0]
          chartWidth = width - margin.left - margin.right
          return chart
        }

        chart.height = function(...args) {
          if (!args.length) return height
          height = args[0]
          chartHeight = height - margin.top - margin.bottom
          return chart
        }

        chart.cut = function(...args) {

          cut = args[0]
          return chart
        }
        return chart

      }
      function init() {
        chart.width(window.innerWidth).height(window.innerHeight)

        winloss()

        //resize()
        window.addEventListener('resize', resize)
        //graphic.select('.slider input').on('input', handleInput)
      }

      init()


    	function winloss() {
        chart.cut("total")
        const data = that.props.data.sort((a, b) => {
          return (b['totalwin']/b['total']) -  (a['totalwin']/a['total'])
        })
        el.datum(data)
        el.call(chart)

    	}

    	function threesets() {
        chart.cut("three")
        const data = that.props.data.sort((a, b) => {
          return (b['threesetwin']/b['totalthreeset']) - (a['threesetwin']/a['totalthreeset'])
        })
        el.datum(data)
        el.call(chart)




    	}

    	function downaset() {
        chart.cut("down")
        const data = that.props.data.sort((a, b) => {
          return (b['downasetwin']/b['totaldownaset']) - (a['downasetwin']/a['totaldownaset'])
        })
        el.datum(data)
        el.call(chart)

    	}

    	function tiebreak() {
        chart.cut("tiebreak")
        const data = that.props.data.sort((a, b) => {
          return (b['tiebreakwin']/b['totaltiebreak']) - (a['tiebreakwin']/a['totaltiebreak'])
        })
        el.datum(data)
        el.call(chart)

    	}
	    const activateFunctions = [];
	    for (var i = 0; i < d3.selectAll('#sections6 .step').size(); i++) {
	      activateFunctions[i] = function () {};
	    }
	    activateFunctions[0] = winloss;
	    activateFunctions[1] = threesets;
	    activateFunctions[2] = tiebreak;
	    activateFunctions[3] = downaset;

	    var scroll = scroller()
	      .container(d3.select('#graphic6'));

	    scroll(d3.selectAll('#sections6 .step'), 'scroller6');




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


    }


  render() {
  	return <div className="pressurecontainer"></div>
  }
}
