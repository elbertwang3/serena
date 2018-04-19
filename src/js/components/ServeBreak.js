import React, { Component } from 'react';
import '../../css/App.css';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import {swoopyArrow} from '../scripts/swoopyArrow';
import SlamTooltip from './SlamTooltip.js';
import Slider from './Slider.js'


export default class ServeBreak extends Component {
  constructor(props){

	  super(props);
	  this.chartRef = React.createRef(); 
	  this.elRef = React.createRef();

	  this.handleChange = this.handleChange.bind(this);

	  this.state = {
	  	sliderValue: 50,
	  	flags: null,
      serves: null,
  	}
  }

  importAllFlags(r) {
 
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  componentWillMount() {
  	const flags = this.importAllFlags(require.context('../../images/flags', false, /\.(png|jpe?g|svg|gif)$/));
    const serves = this.importAllFlags(require.context('../../images/servegraphics', false, /\.(gif|svg)$/));
    this.setState({flags: flags})
    this.setState({serves: serves})
    console.log(flags)
    console.log(serves)
  }
  componentDidMount() {
  	const that = this
  	const {data} = this.props
  	const margin = 45
    const COLORS = ['#ff3814', '#fe5c34', '#fc764f', '#f88d69', '#f2a385', '#e8b8a0', '#dbcdbd']
  	//const filtereddata = data.filter(d => d['Sum_Sum_w_1stWon'] > 5000)


  	const graphic = d3.select('.serveStatsGraphic')
  	const chart = scatterplot()
  	const el = graphic.select('.servebreak-container')
  	function weightData({ x, y }) {
			return data.map(d => ({
				...d,
				score: d['percent_servept_won'] * x + d['percent_breakpt_saved'] * y,
			}))
			.sort((a, b) => d3.descending(a.score, b.score))
			.map((d, i) => ({
				...d,
				rank: i,
			}))
			.reverse()
		}

		function getHypotenuse({ x, y }) {
			const x2 = x * x
			const y2 = y * y
			return Math.sqrt(x2 + y2)
		}

		function resize() {
			const sz = Math.min(el.node().offsetWidth, window.innerHeight) * 0.9
			chart.width(sz).height(sz)
			el.call(chart)
		}

		function scatterplot() {
			
			const scaleX = d3.scaleLinear()
			const scaleY = d3.scaleLinear()
			const scaleR = d3.scaleSqrt()
			const scaleC = d3.scaleQuantile()

			let width = 0
			let height = 0
			let chartWidth = 0
			let chartHeight = 0

			let weightX = 50
			let weightY = 50
			let hypotenuse = 0

			function translate(x, y) {
				return `translate(${x}, ${y})`
			}

			function enter({ container, data }) {
				const sz = Math.min(el.node().offsetWidth, window.innerHeight) * 0.9
				console.log()
				const svg = container.selectAll('svg').data([data])
				const svgEnter = svg.enter().append('svg').attr("class", "servebreak-svg")
		      	const gEnter = svgEnter.append('g')
				
				svgEnter.append("text")
					.text("Serena on Serve")
					.attr("text-anchor", "middle")
					.attr("x", sz/2)
					.attr("y", 40)
					.attr("class", "title")
				gEnter.append('g').attr('class', 'g-plot')

				const axis = gEnter.append('g').attr('class', 'g-axis')

				const x = axis.append('g').attr('class', 'axis axis--x')

				const y = axis.append('g').attr('class', 'axis axis--y')

				x.append('text').attr('class', 'axis__label')
					.attr('text-anchor', 'start')
					.text('% serve points won')
			

				y.append('text').attr('class', 'axis__label')
					.attr('text-anchor', 'end')
					.text('% break points saved')	

			}

			function exit({ container, data }) {
			}

			function updateScales({ data }) {
				hypotenuse = getHypotenuse({ x: weightX, y: weightY })
				const rangeX = weightX / hypotenuse * chartWidth
				const rangeY = weightY / hypotenuse * chartHeight
				//const maxR = Math.floor(FONT_SIZE * 1.5)

				scaleX
					.domain([0.5, 0.65])
					.range([0, rangeX])

				scaleY
					.domain([0.5, 0.65])
					.range([rangeY, 0])

				/*scaleR
					.domain([0, data.length])
					.range([maxR, 2])*/

				scaleC
					.domain(data.map(d => d.rank))
					.range(COLORS)
			}

			function updateDom({ container, data }) {
				const svg = container.select('svg')
				
				svg
					.attr('width', width)
					.attr('height', height)

				const g = svg.select('g')
				
				const maxY = scaleY.range()[0]
				const offsetX = chartWidth / 2
				const offsetY = chartHeight - maxY
				const rad = Math.acos(weightX / hypotenuse)
				const angle = 90 - (rad * 180 / Math.PI)
				const rotation = `rotate(${-angle} 0 ${scaleY.range()[0]})`
				const translation = translate(margin * 1.5 + offsetX, margin + offsetY)
				const transform = `${translation} ${rotation}`
				g.attr('transform', transform)

				const plot = g.select('.g-plot')

				const item = plot.selectAll('.item').data(d => d, d => d.winner_name)
				
				item.enter().append('svg:image')
					.attr('class', 'item')
					.attr("xlink:href", d => {

						return that.state.serves['tennisball.svg']
					})
				.merge(item)
					.attr('x', 0)
					.attr('y', 0)
					//.attr('r', d => scaleR(d.rank))
					.attr('width', 15)
					//.style('fill', d => scaleC(d.rank))
					//.style('stroke', d => d3.color(scaleC(d.rank)).darker(0.7))
					.attr('transform',  d => translate(scaleX(d['percent_servept_won']), scaleY(d['percent_breakpt_saved'])))
			}

			function updateAxis({ container, data }) {
				const axis = container.select('.g-axis')

				const axisLeft = d3.axisLeft(scaleY)
				const axisBottom = d3.axisBottom(scaleX)

				axisLeft.ticks(Math.max(0, Math.floor(weightY / 10)))
				axisBottom.ticks(Math.max(0, Math.floor(weightX / 10)))
				const x = axis.select('.axis--x')
				
				const maxY = scaleY.range()[0]
				const offset = maxY

				const buffer = Math.ceil(margin / 2)
				x.attr('transform', translate(0, buffer + offset))
					.call(axisBottom)

				const y = axis.select('.axis--y')

				y.attr('transform', translate(-buffer, 0))
					.call(axisLeft)

				x.select('.axis__label')
					.attr('y', margin - 1)

				y.select('.axis__label')
					.attr('x', offset)
					.attr('y', margin - 1)
					.attr('transform', `rotate(90)`)
			}

			function chart(container) {
				console.log(container)
				const data = container.datum()
				
				enter({ container, data })
				exit({ container, data })
				updateScales({ container, data })
				updateDom({ container, data })
				updateAxis({ container, data })
			}

			chart.width = function(...args) {
				if (!args.length) return width
				width = args[0]
				chartWidth = width - margin * 2.5
				return chart
			}

			chart.height = function(...args) {
				if (!args.length) return height
				height = args[0]
				chartHeight = height - margin * 2.5
				return chart
			}

			chart.weight = function({ x, y }) {
				weightX = x
				weightY = y
				return chart
			}



			return chart
		}

		this.handleInput = function(val) {

			const x = val
			const y = 100 - val
			const weighted = weightData({ x, y })
			chart.weight({ x, y })
			el.datum(weighted)
			el.call(chart)
		}

  	function init() {
			var weighted = el.datum(weightData({ x: 50, y: 50 }))
			el.call(chart)
			resize()
			window.addEventListener('resize', resize)
			//graphic.select('.slider input').on('input', handleInput)
		}

  	init()
  }
  handleChange(event) {
  	this.setState({sliderValue: event.target.value})
  	this.handleInput(event.target.value)
  }
  render() {
  	const {sliderValue} = this.state
  	return <div className="servebreak-container" ref={this.divRef}>
  		<div className='slider'>
  			<div className="before">% break points saved</div>
  		<input id='input-slider' type='range' min='0' max='100' value={sliderValue} onInput={this.handleChange} onChange={this.handleChange}></input>
  			<div className="after">% serve points won</div>
  		</div>
   	</div>

  }
}