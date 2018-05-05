import React, {Component}  from 'react';
import '../../css/App.css';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';
import {scroller} from '../scripts/scroller.js';
import serveSound from '../../images/servesound.mp3'

export default class ServeGraphic extends Component {
	constructor(props){
	  super(props);

    this.state = {
      flags: null,
      serves: null,
      sound: new Audio(serveSound)


    };
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
		const margin = {top: 60, bottom: 25, right: 25, left: 45}

		let chart = servechart()
		const el = d3.select('.serve-graphic')
		const yScale = d3.scaleLinear()
		const offsetScaleX = d3.scaleLinear()
		const offsetScaleY = d3.scaleLinear()

		let width = 0
		let height = 0
		let chartWidth = 0
		let chartHeight = 0

		function translate(x, y) {
			return `translate(${x}, ${y})`
		}

		function resize() {
			//const sz = Math.min(el.node().offsetWidth, window.innerHeight) * 0.9
			/*let width
			if (window.innerWidth > 700) {
				width = 700
			} else {
				width = window.innerWidth
			}*/
			const width = window.innerWidth > 700 ? 700 : window.innerWidth
			const height = window.innerHeight
			chart.width(width).height(height)
			el.call(chart)
		}

		function servechart() {
			function enter({ container, data }) {
				const svg = container.selectAll('svg').data([data])
				const svgEnter = svg.enter().append('svg').attr("class", "servesvg")
				const gEnter = svgEnter.append('g')
				gEnter.append("g")
		      .attr("class", "arcs")
				/*const arcgroupprofile = .append("g")
		      .attr("class", "arc-group-profile")*/
				gEnter.append("text")
					.text("Serve Speed")
					.attr("class", "chart-title")
					.attr("text-anchor", "start")

				gEnter.append("text")
					.text("How does Serena's serve measure up to the fastest serves, and the average serve?")
					.attr("class", "chart-subtitle")
					.attr("transform", "translate(0,10)")
					.attr("text-anchor", "start")
					.attr("dy", "1.25em")
					.attr("x", 0)
					.attr("y", 0)
					.call(that.wrap, chartWidth)
			}

			function updateScales({ container, data }) {
				yScale
				.domain([0, data.length])
				.range([chartHeight/10, chartHeight])

				offsetScaleX
					.domain([700, 400])
					.range([25, 100])

				offsetScaleY
					.domain([700, 400])
					.range([15, 0])
			}

			function updateDom({ container, data }) {
				const svg = container.select('svg')

				svg
					.attr('width', width)
					.attr('height', height)


				const g = svg.select('g')

				g.attr('transform', translate(margin.left, margin.top))

				const arcs = g.select(".arcs")
				const arcgroup = arcs
		      .selectAll(".arc-group")
		      .data(data)

				arcgroup.exit().remove()
				arcgroup
		      .enter()
		      .append('g')
				.merge(arcgroup)
		      .attr("class", "arc-group")
		      .attr("transform", (d, i) => `translate(0, ${yScale(i)})`)

				var arcGenerator = d3.arc()
					.innerRadius(chartWidth/2)
					.outerRadius(chartWidth/2)
					.startAngle(-Math.PI/6)
					.endAngle(Math.PI/6);


				const arc = arcgroup.selectAll(".arc")
					.data(d => [d])

				arc.exit().remove()
				arc
					.enter()
		      .append("path")
				.merge(arc)
		      .attr("d", arcGenerator)
		      .attr("class", "arc")
		      .attr("transform", (d, i) => `translate(${chartWidth/2 + offsetScaleX(width)}, ${chartWidth/2 - offsetScaleY(width)})`)
		      .attr("stroke-dasharray", function(d) { return d3.select(this).node().getTotalLength() + " " + d3.select(this).node().getTotalLength()})
		      .attr("stroke-dashoffset", function(d) { return d3.select(this).node().getTotalLength(); })

				const ball = arcgroup.selectAll(".tennis-ball")
					.data(d => {
						return [d]
					})
				ball.exit().remove()
				ball
					.enter()
					.append("svg:image")
				.merge(ball)
		      .attr("xlink:href", that.state.serves['tennisball.svg'])
		      .attr("height", 10)
		      .attr("class", "tennis-ball")
		      .attr("transform", d => {
							let path = d3.select('.arc').node()

			       	var p = path.getPointAtLength(0);
			      	return "translate(" + (p.x + chartWidth/2 + offsetScaleX(width)) + "," + (p.y + chartWidth/2 - 2.5 - offsetScaleY(width)) + ")";
				  	})

				const arcgroupprofile = arcgroup.selectAll(".arc-group-profile")
					.data(d => [d])
				arcgroupprofile.exit().remove()
				arcgroupprofile
					.enter()
					.append("g")
				.merge(arcgroupprofile)
		      .attr("class", "arc-group-profile")
		      //.attr("transform", `translate(0,)`)

				const playername = arcgroupprofile.selectAll(".arc-group-profile .player-name")
					.data(d => [d])
				playername.exit().remove()
				playername
					.enter()
					.append("text")
				.merge(playername)
		      .text(d => d['player'])
		      .attr("transform", d => {
		        if (d['country'] !== "") {
		            return "translate(70,20)"
		        } else {
		           return "translate(90,20)"
		        }
		      })
		      .attr("text-anchor", "end")
		      .attr("class", "player-name")

		    const flag = arcgroupprofile.selectAll(".arc-group-profile .flag")
					.data(d => [d])
				flag.exit().remove()
				flag
					.enter()
					.append("svg:image")
				.merge(flag)
		      .attr("xlink:href", d => {
		          if (d['country'] != null) {
		             return that.state.flags[`${d['country']}.png`]
		        }
		      })
		      .attr("width", 20)
		      .attr("transform", "translate(75, 10)")
					.attr("class", "flag")

				const servetype = arcgroupprofile.selectAll(".arc-group-profile .serve-type")
					.data(d => [d])
				servetype.exit().remove()
				servetype
					.enter()
					.append("text")
				.merge(servetype)
		      .text(d => d['serve'])
		      .attr("transform", "translate(90,35)")
		      .attr("text-anchor", "end")
		     	.attr("class", "serve-type")

		    const picture = arcgroupprofile.selectAll(".arc-group-profile .arc-photo")
					.data(d => [d])
				picture.exit().remove()
				picture
					.enter()
					.append("svg:image")
				.merge(picture)
	        .attr("xlink:href", d => {
	          return that.state.serves[`${d['player']} serve.gif`]
	        })
	        .attr("class", "arc-photo")
	        .attr("width", 50)
	        .attr("height", 50)
	        .attr("transform", "translate(100,0)")


		    const speedanno = arcgroup.selectAll(".speed-annotation")
					.data(d => [d])
				speedanno.exit().remove()
				speedanno
					.enter()
					.append("g")
				.merge(speedanno)
		      .attr("class", "speed-annotation")
		      .attr("transform", `translate(${4.5*chartWidth/5}, 20)`)

				const mph = speedanno.selectAll(".speed-annotation .mph")
					.data(d => [d])

				mph.exit().remove()
				mph
					.enter()
					.append('text')
				.merge(mph)
		      .text(d => `${d['speed'].toFixed(1)} mph`)
		      .attr("class", "serve-speed mph")

				const kph = speedanno.selectAll(".speed-annotation .kph")
					.data(d => [d])
				kph.exit().remove()
		   	kph
					.enter()
					.append('text')
				.merge(kph)
		      .text(d => `${(d['speed'] * 1.60934).toFixed(1)} kph`)
		      .attr("class", "serve-speed kph")
		       .attr("transform", `translate(0, 15)`)
			}






			function chart(container) {
				const data = container.datum()
				enter({ container, data })
				updateScales({ container, data })
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
			return chart

		}

		function init() {

			defaultchart()

			//resize()
			el.datum(that.props.data)
			resize()


			window.addEventListener('resize', resize)
			//graphic.select('.slider input').on('input', handleInput)
		}

		init()

		function translateAlong(path) {
	    var l = path.getTotalLength()/2;
	    return function(t) {
	      /*if(t* l >= l/2){
	          var p = path.getPointAtLength(l - (t*l))
	          console.log(p)
	      }*/ /*else {
	          var p = path.getPointAtLength(t * l);
	           console.log(p)
	      }*/
       	var p = path.getPointAtLength(t * l);
      	return "translate(" + (p.x + chartWidth/2 + offsetScaleX(width)) + "," + (p.y + chartWidth/2 - 2.5 - + offsetScaleY(width)) + ")";
      };
  	}
		function transitionBall(type) {
			d3.selectAll(".tennis-ball")
				.filter(d => type.includes(d['type']))
				.transition()
				.ease(d3.easeLinear)
				.duration(d => {
					return 100/d['speed'] * 500
				})
				.attrTween("transform", d => translateAlong(d3.select('.arc').node()))
				//.on("end", transitionBall);
		}

		function defaultchart() {

		}
    function fastest() {
			el.call(chart)
      that.state.sound.play()
      console.log("fastest")
      d3.selectAll('.arc')
        .filter(d => d['type'] === 'first')
        .attr("stroke-dashoffset", function(d) { return d3.select(this).node().getTotalLength(); })
        .transition()
        .ease(d3.easeLinear)
        .duration(d => {
          return 100/d['speed'] * 1000
        })
        .attr("stroke-dashoffset", function(d) { return 0; })

      transitionBall(['first'])
    }
    function averages() {
			el.call(chart)
      that.state.sound.play()
      console.log("averages")
      d3.selectAll('.arc')
        .filter(d => d['type'] === 'second')
        .attr("stroke-dashoffset", function(d) { return d3.select(this).node().getTotalLength(); })
        .transition()
        .ease(d3.easeLinear)
        .duration(d => {
          return 100/d['speed'] * 1000
        })
        .attr("stroke-dashoffset", function(d) { return 0; })

      transitionBall(['second'])

    }

     function all() {
			 el.call(chart)
      that.state.sound.play()
      console.log("all")
      d3.selectAll('.arc')
        .attr("stroke-dashoffset", function(d) { return d3.select(this).node().getTotalLength(); })
        .transition()
        .ease(d3.easeLinear)
        .duration(d => {
          return 100/d['speed'] * 1000
        })
        .attr("stroke-dashoffset", function(d) { return 0; })

      	transitionBall(['first', 'second'])

    	}
			const activateFunctions = [];
	    for (var i = 0; i < d3.selectAll('#sections2 .step').size(); i++) {
	      activateFunctions[i] = function () {};
	    }
			activateFunctions[0] = defaultchart;
	    activateFunctions[1] = fastest;
	    activateFunctions[2] = averages;
	    activateFunctions[3] = all;

	    var scroll = scroller()
	      .container(d3.select('#graphic2'));

	    scroll(d3.selectAll('#sections2 .step'), 'scroller2');

			scroll.on('active', function (index) {
	      // highlight current step text
	      d3.selectAll('#sections2 .step')
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
    return <div className="serve-graphic">
    </div>
  }
}
