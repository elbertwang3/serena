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
      const margin = {top: 25, bottom: 25, right: 25, left: 150}
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
            .rangeRound([chartHeight, 0])

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
          console.log(barHeight)

          const g = svg.select('g')
          g.attr('transform', translate(margin.left, margin.top))

          const bars = g.select(".stacked-bars")
          console.log(cut)
          const sortedData = data.sort((a, b) => {
            switch(cut) {
              case "total":
                console.log("in total")
                return a['totalwin']/a['total'] -  b['totalwin']/b['total']
                break
              case "three":
                console.log("in three")
                return a['threesetwin']/a['totalthreesetwin'] - b['threesetwin']/b['totalthreesetwin']
                break
              case "down":
                console.log("down")
                return a['downasetwin']/a['totaldownaset'] - b['downasetwin']/b['totaldownaset']
                break
              case "tiebreak":
                console.log("tiebreak")
                return a['tiebreakwin']/a['totaltiebreak'] - b['tiebreakwin']/b['totaltiebreak']
                break
              default:
                return a['totalwin']/a['total'] - b['totalwin']/b['total']
            }
          })
          console.log(sortedData)

          const barg = bars.selectAll(".stacked-bar-g")
            .data(sortedData)

          barg.exit().remove()

          barg
            .enter()
            .append("g")
          .merge(barg)
            .attr("class", "stacked-bar-g")
            .transition()
            .duration(1000)
            .attr("transform", d => `translate(0, ${playerScale(d['player']) + 1})`)

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
              .attr("height", barHeight - 2)

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
              .attr("height", barHeight - 2)
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
                .attr("text-anchor", (d, i) => i == 0 ? "start" : "end")
                .attr("class", "stacked-bar-text")



        }



        function updateAxis({ container, data }) {
          const axis = container.select('.g-axis')

          const axisLeft = d3.axisLeft(playerScale)
          const axisBottom = d3.axisBottom(percentScale)
          //axisBottom.selectAll(".domain").remove()
          //axisBottom.selectAll(".tick").remove()

          //axisLeft.ticks(Math.floor(currYScale.range()[0] / 100))
          axisBottom.ticks(Math.floor(percentScale.range()[1]/ 100)); //for yearscale
          //axisBottom.ticks(d3.range(scaleX.domain()[0], scaleX.domain()[1], 5)) //for agescale
          //axisLeft.ticks(d3.range(scaleY.domain()[0], scaleY.domain()[1], 100)) //for weeks
          //axisLeft.ticks(d3.range(scaleY.domain([0], scaleY.domain([1], 5)))) //for slams
          const x = axis.select('.x-axis')


          const maxY = playerScale.range()[0]


          x
            .attr('transform', translate(0, chartHeight))
            .call(axisBottom)

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
          console.log("chart being called")
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
        el.datum(that.props.data)
        winloss()

        //resize()
        window.addEventListener('resize', resize)
        //graphic.select('.slider input').on('input', handleInput)
      }

      init()










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
        chart.cut("total")
        el.call(chart)

    	}

    	function threesets() {
        chart.cut("three")
        el.call(chart)

    	}

    	function downaset() {
        chart.cut("down")
        el.call(chart)

    	}

    	function tiebreak() {
        chart.cut("tiebreak")
        el.call(chart)

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

    }


  render() {
  	return <div className="pressurecontainer"></div>
  }
}
