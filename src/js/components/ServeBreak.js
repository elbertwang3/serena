import React, { Component } from 'react';
import '../../css/App.css';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';


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
  }
  componentDidMount() {
  	const that = this
  	const {data} = this.props
  	const margin = 45

  	var tooltip = d3.select(".body")
			.append("div")
			.attr("class", "serve-tooltip")

  	const graphic = d3.select('.serveStatsGraphic')
  	const chart = scatterplot()
  	const el = graphic.select('.servebreak-container')
  	function weightData({ x, y }) {
			return data.map(d => ({
				...d,
				score: d['percent_servept_won'] * x + d['percent_returnpt_won'] * y,
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

				const svg = container.selectAll('svg').data([data])
				const svgEnter = svg.enter().append('svg').attr("class", "servebreak-svg")
		      	const gEnter = svgEnter.append('g')

				/*svgEnter.append("text")
					.text("Serena on Serve")
					.attr("text-anchor", "middle")
					.attr("x", width/2)
					.attr("y", 40)
					.attr("class", "title")*/
				gEnter.append('g').attr('class', 'g-plot')
        gEnter.append('g').attr('class', 'names')

				const axis = gEnter.append('g').attr('class', 'g-axis')

				const x = axis.append('g').attr('class', 'axis axis--x')

				const y = axis.append('g').attr('class', 'axis axis--y')

				x.append('text').attr('class', 'axis__label')
					.attr('text-anchor', 'start')
					.text('% serve points won')


				y.append('text').attr('class', 'axis__label')
					.attr('text-anchor', 'end')
					.text('% return points won')

        gEnter.append('circle')
          .attr('class', 'highlight-circle')
          .attr('r', 8) // slightly larger than our points
          .style('fill', 'none')
          .style('display', 'none');

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
					.domain([0.38, 0.5])
					.range([rangeY, 0])

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
        const voronoiRadius = chartWidth/5;
				const rad = Math.acos(weightX / hypotenuse)
				const angle = 90 - (rad * 180 / Math.PI)
				const rotation = `rotate(${-angle} 0 ${scaleY.range()[0]})`
				const translation = translate(margin * 1.5 + offsetX, margin + offsetY)
				const transform = `${translation} ${rotation}`
				g.attr('transform', transform)

				const plot = g.select('.g-plot')
				const serenaData = data.filter(d => d['winner_name'] === 'Serena Williams')[0]

				let xLine = plot.selectAll(".guide-line-x")
					.data([serenaData])

				xLine
					.enter()
					.append("line")
				.merge(xLine)
					.attr("x1", -margin/2)
					.attr("x2", d => {
						return scaleX(d['percent_servept_won']) - 7.5
					})
					.attr("y1", d => scaleY(d['percent_returnpt_won']))
					.attr("y2", d => scaleY(d['percent_returnpt_won']))
					.attr("class", "guide-line-x")

				let yLine = plot.selectAll(".guide-line-y")
					.data([serenaData])

				yLine
					.enter()
					.append("line")
				.merge(yLine)
					.attr("x1", d => scaleX(d['percent_servept_won']))
					.attr("x2", d => scaleX(d['percent_servept_won']))
					.attr("y1", maxY + margin/2)
					.attr("y2", d => {
						return scaleY(d['percent_returnpt_won']) + 7.5
					})
					.attr("class", "guide-line-y")

        const voronoiDiagram = d3.voronoi()
          .x(d => scaleX(d['percent_servept_won']) - 7.5)
          .y(d => scaleY(d['percent_returnpt_won']) - 7.5)
          .size([chartWidth, chartHeight])(data);

				const item =  plot.selectAll('.item').data(d => d, d => d.winner_name)



				item.enter().append('svg:image')
					.attr('class', 'item')
					.attr("xlink:href", d => {

						return that.state.serves['tennisball.svg']
					})
				.merge(item)
					.attr('x', 0)
					.attr('y', 0)
					.attr('width', 15)
          .attr("height", 15)
					.attr('transform',  d => translate(scaleX(d['percent_servept_won']) - 7.5, scaleY(d['percent_returnpt_won']) - 7.5))




          function highlight(d) {
            // no point to highlight - hide the circle
            if (!d) {
              d3.select('.highlight-circle').style('display', 'none');
              tooltip.style("display", "none");
              tooltip.style(d => "top", (d3.event.pageY)+"px").style("left",(d3.event.pageX+20)+"px")
  						const d = serenaData

  						xLine = plot.selectAll(".guide-line-x")
  							.data([d])

  						yLine = plot.selectAll(".guide-line-y")
  							.data([d])

  						xLine
  							.attr("opacity", 1)
  							.attr("x1", -margin/2)
  							.attr("x2", d => {
  								return scaleX(d['percent_servept_won']) - 7.5
  							})
  							.attr("y1", d => scaleY(d['percent_returnpt_won']))
  							.attr("y2", d => scaleY(d['percent_returnpt_won']))

  						yLine
  							.attr("opacity", 1)
  							.attr("x1", d => scaleX(d['percent_servept_won']))
  							.attr("x2", d => scaleX(d['percent_servept_won']))
  							.attr("y1", maxY + margin/2)
  							.attr("y2", d => {
  								return scaleY(d['percent_returnpt_won']) + 7.5
  							})

            // otherwise, show the highlight circle at the correct position
            } else {
              d3.select('.highlight-circle')
                .style('display', '')
                .style('stroke', "black")
                .attr('cx', scaleX(d['percent_servept_won']))
                .attr('cy', scaleY(d['percent_returnpt_won']));

                tooltip.text(d['winner_name'])
    						tooltip.style("display", "block");
                tooltip.style("top", (d3.event.pageY)+"px").style("left",(d3.event.pageX+20)+"px")
    						xLine = plot.selectAll(".guide-line-x")
    							.data([d])

    						yLine = plot.selectAll(".guide-line-y")
    							.data([d])

    						xLine
    							.attr("opacity", 1)
    							.attr("x1", -margin/2)
    							.attr("x2", d => {
    								return scaleX(d['percent_servept_won']) - 7.5
    							})
    							.attr("y1", d => scaleY(d['percent_returnpt_won']))
    							.attr("y2", d => scaleY(d['percent_returnpt_won']))

    						yLine
    							.attr("opacity", 1)
    							.attr("x1", d => scaleX(d['percent_servept_won']))
    							.attr("x2", d => scaleX(d['percent_servept_won']))
    							.attr("y1", maxY + margin/2)
    							.attr("y2", d => {
    								return scaleY(d['percent_returnpt_won']) + 7.5
    							})
            }
          }

          // callback for when the mouse moves across the overlay
          function mouseMoveHandler() {
            // get the current mouse position
            const [mx, my] = d3.mouse(this);

            // use the new diagram.find() function to find the Voronoi site
            // closest to the mouse, limited by max distance voronoiRadius
            const site = voronoiDiagram.find(mx, my, voronoiRadius);
            // highlight the point if we found one
            highlight(site && site.data);
          }

          // add the overlay on top of everything to take the mouse events
          const overlay = g.selectAll(".overlay")
            .data([data])
          overlay.exit().remove()
          overlay
            .enter()
            .append('rect')

          .merge(overlay)
            .attr('class', 'overlay')
            .attr('width', width)
            .attr('height', height)
            .style('fill', '#f00')
            .style('opacity', 0)
            .on('mousemove', mouseMoveHandler)
            .on('mouseout', () => {
              // hide the highlight circle when the mouse leaves the chart
              highlight(null);
            });

          const highest = plot.selectAll(".highest")
            .data([{percent_returnpt_won: 0.5, percent_servept_won: 0.65}])

          highest.exit().remove()
          highest
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("class", "highest")
            .attr("opacity", 0.5)
          .merge(highest)
            .attr("cx", d => scaleX(d['percent_servept_won']))
            .attr("cy", d => scaleY(d['percent_returnpt_won']))


          const highestanno = svg.selectAll(".highestanno")
            .data([{percent_returnpt_won: 0.5, percent_servept_won: 0.65}])

            highestanno.exit().remove()
            highestanno
              .enter()
              .append("text")
              .attr("class", "highestanno")
              .text("The closer to here the better")
              .attr("text-anchor", "middle")
            .merge(highestanno)
              .attr('transform',  d => translate(width/2, scaleY(d['percent_returnpt_won']) + margin * 0.75))







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
			el.datum(weightData({ x: 50, y: 50 }))

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
  	const {sliderValue} = this.state
  	return <div><div className="servebreak-container" ref={this.divRef}>

   	</div>
   	<div className='slider'>
  			<div className="before">% return points won</div>
  		<input id='input-slider' type='range' min='0' max='100' value={sliderValue} onInput={this.handleChange} onChange={this.handleChange}></input>
  			<div className="after">% serve points won</div>
  		</div>
  	</div>

  }
}
