import React, { Component } from 'react';
import '../../css/App.css';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import {scroller} from '../scripts/scroller.js';


export default class UnderPressure extends Component {
  constructor(props){

    super(props);




    this.state = {

    }
   }

    componentDidMount() {
    	const that = this
      const margin = {top: 25, bottom: 25, right: 40, left: 145}

      const chart = stackedbar()

      const el = d3.select('.pressurecontainer')
      let playerScale = d3.scaleBand()
      let percentScale = d3.scaleLinear()

      let width = 0
      let height = 0
      let chartWidth = 0
      let chartHeight = 0
      let cut = "total"

      let formatPercent = d3.format(".2f")
      let formatNumber = d3.format(".0f")

      function resize() {
        //const sz = Math.min(el.node().offsetWidth, window.innerHeight) * 0.9
        const width = window.innerWidth > 1000 ? 1000 : window.innerWidth
        const height = window.innerHeight
        chart.width(width).height(height)
        el.call(chart)
      }

      function stackedbar() {

        function translate(x, y) {
          return `translate(${x}, ${y})`
        }

        function enter({ container, data }) {
          const svg = container.selectAll('svg').data([data])
          const svgEnter = svg.enter().append('svg').attr("class", "pressuresvg")
          const gEnter = svgEnter.append('g')
          const axis = gEnter.append('g').attr('class', 'g-axis')
          axis.append('g').attr('class', 'x-axis')
          axis.append('g').attr("class", 'y-axis')
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

          const barHeight = chartHeight/data.length


          const g = svg.select('g')
          g.attr('transform', translate(margin.left, margin.top))


          const bars = g.select(".stacked-bars")

          const barg = bars.selectAll(".stacked-bar-g")
            .data(data, d => d['player'])

          barg.exit().remove()

          barg
            .enter()
            .append("g")
            .attr("class", "stacked-bar-g")
          .merge(barg)

            .transition()
            .duration(1000)
            .attr("transform", d => `translate(0, ${playerScale(d['player'])})`)


          const barpercent = g.selectAll(".stacked-bar-g").selectAll(".percent-anno")
            .data(d => {
              switch(cut) {
              case "total":
                return [d['totalwin'] / d['total']]

              case "three":
                return [d['threesetwin'] / d['totalthreeset']]

              case "down":
                return [d['downasetwin'] / d['totaldownaset']]

              case "tiebreak":
                return [d['tiebreakwin'] / d['totaltiebreak']]
              default:
                return [d['totalwin'] / d['total']]
              }
            })
          barpercent.exit().remove()
          barpercent
            .enter()
            .append("text")
            .text(d => d)
            .attr("class", "percent-anno")

            .attr("text-anchor", "start")
            .attr("alignment-baseline", "middle")
          .merge(barpercent)


            .transition()
            .duration(1000)
            .attr("transform", `translate(${chartWidth+10}, ${playerScale.bandwidth()/2})`)
            .tween("text", function(d,i,nodes) {
              var textElement = d3.select(this).node()
              var currentValue = +textElement.textContent;
              // create interpolator and do not show nasty floating numbers
              var interpolator = d3.interpolateNumber( currentValue, d);

              // this returned function will be called a couple
              // of times to animate anything you want inside
              // of your custom tween
              return function( t ) {
                // set new value to current text element

                textElement.textContent = formatPercent(interpolator( t ));
              };
            });

          const bar = g.selectAll(".stacked-bar-g").selectAll(".stacked-bar")
            .data(d => {
              switch(cut) {
                case "total":
                  return [d['totalwin'], d['totalloss']]

                case "three":
                  return [d['threesetwin'], d['threesetloss']]

                case "down":
                  return [d['downasetwin'], d['downasetloss']]

                case "tiebreak":
                  return [d['tiebreakwin'], d['tiebreakloss']]

                default:
                  return [d['totalwin'], d['totalloss']]
              }
            })

            bar.exit().remove()
            bar
              .enter()
              .append("rect")
              .attr("class", "stacked-bar")
              .attr("height", playerScale.bandwidth())
              .attr("y", 0)
              .attr("fill", (d, i) => i === 0 ? "#1A80C4" : "#CC3D3D")
            .merge(bar)


              .transition()
              .delay(1000)
              .duration(1000)
              .attr("x", (d,i,nodes) => {
                let lastdata = d3.select(nodes[i - 1]).data()[0]
                return i === 0 ? 0 : percentScale(lastdata /(d+lastdata))
              })
              .attr("width", (d,i,nodes) => {
                let total = i === 0 ? d + d3.select(nodes[i + 1]).data()[0] : d + d3.select(nodes[i - 1]).data()[0]
                return percentScale(d/total)
              })



              const bartext = g.selectAll(".stacked-bar-g").selectAll(".stacked-bar-text")
                .data(d => {
                  switch(cut) {
                    case "total":
                      return [d['totalwin'], d['totalloss']]
                    case "three":
                      return [d['threesetwin'], d['threesetloss']]
                    case "down":
                      return [d['downasetwin'], d['downasetloss']]

                    case "tiebreak":
                      return [d['tiebreakwin'], d['tiebreakloss']]
                    default:
                      return [d['totalwin'], d['totalloss']]
                  }
                })
              bartext.exit().remove()
              bartext
                .enter()
                .append("text")
                .text(d => d)

                .attr("text-anchor", (d, i) => i === 0 ? "start" : "end")
                .attr("class", "stacked-bar-text")
                .attr("alignment-baseline", "middle")
              .merge(bartext)


                .transition()
                .duration(1000)
                .attr("transform", (d, i) => i === 0 ? `translate(5,${playerScale.bandwidth()/2})` : `translate(${chartWidth -5},${playerScale.bandwidth()/2})`)
                .tween("text", function(d,i,nodes) {
                  var textElement = d3.select(this).node()
                  var currentValue = +textElement.textContent;
                  // create interpolator and do not show nasty floating numbers
                  var interpolator = d3.interpolateNumber( currentValue, d );

                  // this returned function will be called a couple
                  // of times to animate anything you want inside
                  // of your custom tween
                  return function( t ) {
                    // set new value to current text element

                    textElement.textContent = formatNumber(interpolator( t ));
                  };
                });
        }



        function updateAxis({ container, data }) {
          const axis = container.select('.g-axis')

          const axisLeft = d3.axisLeft(playerScale)

          const x = axis.select('.x-axis')
          const y = axis.select('.y-axis')

          y.transition().duration(1000).call(axisLeft)

          y.select(".domain").remove()
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
        chart.width(window.innerWidth > 1000 ? 1000 : window.innerWidth).height(window.innerHeight)

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
