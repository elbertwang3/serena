import React, { Component } from 'react';
import '../../css/App.css';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import {scroller} from '../scripts/scroller.js';


export default class ServeDirection extends Component {
  constructor(props){

	  super(props);


	  this.state = {
	  	sliderValue: 50,
	  	flags: null,
  	}
  }

  componentDidMount() {

  	const that = this
		const margin = {top: 25, bottom: 25, right: 25, left: 25}
		const chart = tennisCourt()
		const el = d3.select('.servedirection-container')
		let currentServe = 0
		let scaleLength = d3.scaleLinear()
		let serveScale = d3.scaleLinear()
    let formatPercent = d3.format(".2f")

  	function resize() {
			const height = window.innerHeight
			const width = height / 2
			chart.width(width).height(height)
			el.call(chart)
		}

		function translate(x, y) {
			return `translate(${x}, ${y})`
		}


		function tennisCourt() {

			let width = 0
			let height = 0
			let chartWidth = 0
			let chartHeight = 0



			function enter({ container, data }) {

				const svg = container.selectAll('svg').data([data])
				const svgEnter = svg.enter().append('svg')
      	const gEnter = svgEnter.append('g')
      	gEnter.append('g').attr('class', 'g-court')
      	gEnter.append('g').attr("class", 'serve-rects')



			}
			function exit({ container, data }) {
			}

			function updateScales({ data }) {
        console.log(chartHeight)
					scaleLength
						.domain([0, 78])
						.range([0, chartHeight])

					serveScale
						.domain([0, 2])
						.range([0, 27])
			}

			function updateDom({ container, data }) {
				const svg = container.select('svg')

				svg
					.attr('width', width)
					.attr('height', height)

				const g = svg.select('g')
				g.attr('transform', translate(margin.left, margin.top))

        const title = g.selectAll(".title")
          .data([data])
        title.exit().remove()
        title
          .enter()
          .append("text")

          .attr("class", "title")
          .attr("dy", "1.25em")
					.attr("x", 0)
					.attr("y", 0)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
        .merge(title)
          .attr("transform", translate(scaleLength(18), scaleLength(66)))
          .text(() => {
            switch(currentServe) {
              case 0:
                return "Serena's first serve direction"
              case 1:
                return "average WTA player's first serve direction"
              case 2:
                  return "Serena's second serve direction"
              case 3:
                  return "average WTA player's second serve direction"
              default:
                return "Serena's first serve direction"
            }
          })
          .call(that.wrap, width)


          const title2 = g.selectAll(".title2")
            .data([data])
          title2.exit().remove()
          title2
            .enter()
            .append("text")
          .merge(title2)
            .text("Serve Accuracy")
            .attr("class", "title2")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("transform", translate(scaleLength(18), scaleLength(4.5)))


				const court = g.select(".g-court")

				const lines = court.selectAll(".court-line")
					.data([
						{'x1': 0, 'x2': 0, 'y1': 0, 'y2': 78},
						{'x1': 4.5, 'x2': 4.5, 'y1': 0, 'y2': 78},
						{'x1': 31.5, 'x2': 31.5, 'y1': 0, 'y2': 78},
						{'x1': 36, 'x2': 36, 'y1': 0, 'y2': 78},
						{'x1': 0, 'x2': 36, 'y1': 0, 'y2': 0},
						{'x1': 0, 'x2': 36, 'y1': 78, 'y2': 78},
						{'x1': 4.5, 'x2': 31.5, 'y1': 39, 'y2': 39},
						{'x1': 4.5, 'x2': 31.5, 'y1': 18, 'y2': 18},
						{'x1': 4.5, 'x2': 31.5, 'y1': 60, 'y2': 60},
						{'x1': 18, 'x2': 18, 'y1': 18, 'y2': 60},
					])

				lines
					.enter()
					.append("line")
				.merge(lines)
					.attr("x1", d => scaleLength(d['x1']))
					.attr("x2", d => scaleLength(d['x2']))
					.attr("y1", d => scaleLength(d['y1']))
					.attr("y2", d => scaleLength(d['y2']))
					.attr("class", "court-line")

				const d = data[currentServe]
				let serveData = [d['Sum_deuce_wide']/d['total_deuce_serves'],d['Sum_deuce_middle']/d['total_deuce_serves'],d['Sum_deuce_t']/d['total_deuce_serves'],d['Sum_ad_wide']/d['total_ad_serves'],d['Sum_ad_middle']/d['total_ad_serves'],d['Sum_ad_t']/d['total_ad_serves']]


        const list = [1/3,2/3,3/3,4/3,5/3,6/3]
				const serveRects = g.select(".serve-rects")
          .attr("transform", translate(scaleLength(4.5) ,scaleLength(18)))

        const serves = []
        for (let i = 0; i < 200; i++) {
          let cat = randomNumber(list, serveData)
          let min = cat - 1/3
          let rand = Math.random() * (cat - min) + min
          serves.push({i: i, x: scaleLength(serveScale(rand)), y: scaleLength(Math.random() * 21)})
        }
        const serve = serveRects.selectAll(".serve-circle")
					.data(serves)
        console.log(serves)
        console.log(scaleLength(18))
        serve.exit().remove()
        serve
          .enter()
          .append("circle")
          .attr("class", "serve-circle")
          .attr("r", 2.5)
				.merge(serve)
          .transition()
          .duration(1000)
          .attr("cx", d => {
            return d['x']})
          .attr("cy", d => d['y'])
          //.attr("transform", `translate(0, ${scaleLength(18)})`)







        const annoLine = serveRects.selectAll(".serve-anno-line")
          .data(serveData)

        annoLine.exit().remove()

        annoLine
          .enter()
          .append("line")
          .attr("class", "serve-anno-line")
        .merge(annoLine)
          //.transition()
          //.duration(1000)
          .attr("x1", (d, i) => scaleLength(serveScale((i+1)/3)))
          .attr("x2", (d, i) => scaleLength(serveScale((i+1)/3)))
          .attr("y1", (d, i) =>  scaleLength(0))
          .attr("y2", (d, i) =>  scaleLength(21))

        const serveAnno = serveRects.selectAll(".serve-rect-anno")
					.data(serveData)

        serveAnno.exit().remove()
        serveAnno
          .enter()
          .append("text")
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr("class", "serve-rect-anno")
          .text(d => d)

        .merge(serveAnno)
          .attr("transform", (d,i) => translate(scaleLength(serveScale((i+0.5)/3)), -scaleLength(1)))
          .transition()
          .duration(1000)

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

              textElement.textContent = formatPercent(interpolator( t ));
            };
          });

        const addeuce = g.selectAll(".addeuce")
          .data(["Ad", "Deuce"])
        addeuce.exit().remove()
        addeuce
          .enter()
          .append("text")
        .merge(addeuce)
          .text(d => d)
          .attr("text-anchor", "middle")
          .attr("class", "addeuce")
          .attr("alignment-baseline", "middle")
          .attr("transform", (d, i) => translate(scaleLength(11.25 + 13.5*i), scaleLength(48)))

          const directionlabel = serveRects.selectAll(".directionlabel")
            .data(["Wide", "Middle", "T", "T", "Middle", "Wide"])
          directionlabel.exit().remove()
          directionlabel
            .enter()
            .append("text")
          .merge(directionlabel)
            .attr("class", "directionlabel")
            .text(d => d)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("transform", (d,i) => translate(scaleLength(serveScale((i+0.5)/3)), -scaleLength(3)))

          function randomNumber(list, weight) {
            var total_weight = weight.reduce(function (prev, cur, i, arr) {
              return prev + cur;
            });
            var random_num = Math.random() * total_weight;
            var weight_sum = 0;

            for (var i = 0; i < list.length; i++) {
              weight_sum += weight[i];
              weight_sum = +weight_sum;

              if (random_num <= weight_sum) {
                  return list[i];
              }
            }

          }
			}


			function chart(container) {
				const data = container.datum()
        //updateScales({ container, data })
				enter({ container, data })
				exit({ container, data })
        updateScales({ container, data })
				updateDom({ container, data })
				//updateAxis({ container, data })
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

			chart.currentServe = function(...args) {
				currentServe = args[0]
				return chart

			}

      /*chart.data = function(...args) {

      }*/




			return chart
		}

  	function init() {
  		el.datum(that.props.data)
      const height = window.innerHeight
			const width = height / 2
			chart.width(width).height(height)
			window.addEventListener('resize', resize)
			//graphic.select('.slider input').on('input', handleInput)
		}

  	init()

  	function serenafirst() {
      chart.currentServe(0)
      el.call(chart)
  	}

  	function wtafirst() {
      chart.currentServe(1)
      el.call(chart)
  	}

  	function serenasecond() {
      chart.currentServe(2)
      el.call(chart)
  	}

  	function wtasecond() {
      chart.currentServe(3)
      el.call(chart)
  	}

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

    const activateFunctions = [];
    for (var i = 0; i < d3.selectAll('#sections4 .step').size(); i++) {
      activateFunctions[i] = function () {};
    }
    activateFunctions[1] = serenafirst;
    activateFunctions[2] = wtafirst;
    activateFunctions[3] = serenasecond;
    activateFunctions[4] = wtasecond;

    var scroll = scroller()
      .container(d3.select('#graphic4'));

    scroll(d3.selectAll('#sections4 .step'), 'scroller4');

    scroll.on('active', function (index) {
      // highlight current step text
      d3.selectAll('#sections4 .step')
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
					tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
				}
			}
		});
	}
  render() {

		return <div>
			<div className="servedirection-container"></div>
		</div>
  }

}
