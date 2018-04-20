import React, { Component } from 'react';
import '../../css/App.css';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';


export default class ServeDirection extends Component {
  constructor(props){

	  super(props);


	  this.state = {
	  	sliderValue: 50,
	  	flags: null,
      serves: null,
  	}
  }

  componentDidMount() {
  	const that = this
		const margin = {top: 25, bottom: 25, right: 25, left: 25}
		const chart = tennisCourt()
		const el = d3.select('.servedirection-container')
		let currentServe = 0

  	function resize() {
			const height = window.innerHeight * 1.0
			const width = height / 2
			chart.width(width).height(height)
			el.call(chart)
		}

		function tennisCourt() {
			const scaleLength = d3.scaleLinear()
			const serveScale = d3.scaleLinear()

			let width = 0
			let height = 0
			let chartWidth = 0
			let chartHeight = 0


			function translate(x, y) {
				return `translate(${x}, ${y})`
			}

			function enter({ container, data }) {
				console.log(container)

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
				serveData = serveData.map((d,i) => {
					console.log(serveData.slice(0, i))
					let sum = d3.sum(serveData.slice(0, i))
					return {percent: d, xoffset: sum}
				})
				console.log(serveData)


				const serveRects = g.select(".serve-rects")
				const serves = serveRects.selectAll(".serve-rect")
					.data(serveData)

				console.log(serves)

				serves
					.enter()
					.append("rect")
				.merge(serves)
				.attr("width", d => scaleLength(serveScale(d['percent'])))
				.attr("height", scaleLength(21))
				.attr("transform", d => {
	
					return translate((scaleLength(4.5) + scaleLength(serveScale(d['xoffset']))),scaleLength(18))
				})
				.attr("fill", "black")
				.attr("stroke", "white")
				.attr("opacity", 0.4)
				.attr("class", "serve-rect")

		
						
						

			}

			function chart(container) {
				console.log("getting into chart")
				const data = container.datum()
				console.log(data)
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




			return chart
		}

  	function init() {
  		console.log(that.props.data)
  		el.datum(that.props.data)
			el.call(chart)
			resize()
			window.addEventListener('resize', resize)
			//graphic.select('.slider input').on('input', handleInput)
		}

  	init()
  }

  render() {

		return <div>
			<div className="servedirection-container"></div>
		</div>
  }

}