import React, { Component } from 'react';
import '../../css/App.css';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import {scroller} from '../scripts/scroller.js';


export default class No1Weeks extends Component {
  constructor(props){

    super(props);
   

    

    this.state = {
    	flags: null,
      scaleY: null,
      scaleX: null,

    }
  }




  importAllFlags(r) {
 
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  componentWillMount() {
    const flags = this.importAllFlags(require.context('../../images/flags', false, /\.(png|jpe?g|svg|gif)$/));

    this.setState({flags: flags})
  }

  componentDidMount() {
    const that = this
    const margin = {top: 25, bottom: 25, right: 25, left: 40}
    const {data} = this.props


    const chart = linechart()
    const el = d3.select('.goatcontainer')
    let weeksScale = d3.scaleLinear()    
    let slamsScale = d3.scaleLinear()
    let timeScale = d3.scaleTime()
    let ageScale = d3.scaleLinear()


    console.log("set state")
    console.log(this.state.scaleY)
    console.log(this.state.scaleX)
    const dateParser = d3.timeParse("%b %e, %Y")

    function getChart() {
      return chart
    }

    function resize() {
      //const sz = Math.min(el.node().offsetWidth, window.innerHeight) * 0.9
      const width = window.innerWidth
      const height = window.innerHeight
      console.log(width)
      console.log(height)
      chart.width(width).height(height)
      el.call(chart)
    }
    function linechart() {

      let width = 0
      let height = 0
      let chartWidth = 0
      let chartHeight = 0
      let currXScale = null
      let currYScale = null


      function translate(x, y) {
        return `translate(${x}, ${y})`
      }

      function enter({ container, data }) {
        const svg = container.selectAll('svg').data([data])
        const svgEnter = svg.enter().append('svg')
        const gEnter = svgEnter.append('g')
        const axis = gEnter.append('g').attr('class', 'g-axis')
        const xAxis = axis.append('g').attr('class', 'x-axis')
        const yAxis = axis.append('g').attr("class", 'y-axis')
        const playerLines = gEnter.append('g').attr("class", 'player-lines')

      }

      function updateScales({ container, data }) {

        weeksScale
          .domain([0,400])
          .range([chartHeight, 0])

        slamsScale 
          .domain([0, 25])
          .range([chartHeight, 0])


        timeScale
          .domain([dateParser("Nov 3, 1975"), dateParser("Apr 30, 2018")])
          .range([0, chartWidth])

        ageScale
          .domain([15, 40])
          .range([0, chartWidth])


      }

      function updateDom({ container, data }) {
        const svg = container.select('svg')
    
        svg
          .attr('width', width)
          .attr('height', height)

        const g = svg.select('g')
        g.attr('transform', translate(margin.left, margin.top))

        const court = g.select(".g-court")

      }

      function updateAxis({ container, data }) {
        const axis = container.select('.g-axis')

        const axisLeft = d3.axisLeft(currYScale)
        const axisBottom = d3.axisBottom(currXScale)

        //axisLeft.ticks(Math.floor(scaleY.range()[0] / 100))
        //axisBottom.ticks(d3.timeYear.every(5), "%Y"); //for yearscale
        //axisBottom.ticks(d3.range(scaleX.domain()[0], scaleX.domain()[1], 5)) //for agescale
        //axisLeft.ticks(d3.range(scaleY.domain()[0], scaleY.domain()[1], 100)) //for weeks
        //axisLeft.ticks(d3.range(scaleY.domain([0], scaleY.domain([1], 5)))) //for slams
        const x = axis.select('.x-axis')
        
        const maxY = currYScale.range()[0]
        console.log(maxY)
        const offset = maxY

        const buffer = Math.ceil(margin / 2)
        x.attr('transform', translate(0, chartHeight))
          .call(axisBottom)

        const y = axis.select('.y-axis')

        y.call(axisLeft)

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

      chart.scaleX = function(...args) {

        currXScale = args[0]
        console.log(currXScale)
        return chart
      }

       chart.scaleY = function(...args) {
        if (!args.length) return height
        currYScale = args[0]
        console.log(currYScale)
        return chart
      }


      return chart

      
    }

    function init() {
      el.datum(that.props.data)
      weekstime()
      el.call(chart)
      resize()
      weekstime()
      window.addEventListener('resize', resize)
      //graphic.select('.slider input').on('input', handleInput)
    }

    init()

    function weekstime() {
      console.log("weekstime")
      console.log(weekstime)
      chart.scaleX(timeScale)
      chart.scaleY(weeksScale)

    }
    function weeksage() {
      console.log("weeksage")
      chart.scaleX(ageScale)
      chart.scaleY(weeksScale)

    }

    function slamstime() {
      console.log("slamstime")
      chart.scaleX(timeScale)
      chart.scaleY(slamsScale)

    }

    function slamsage() {
      console.log("slamsage")
      chart.scaleX(ageScale)
      chart.scaleY(slamsScale)

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
    for (var i = 0; i < d3.selectAll('#sections5 .step').size(); i++) {
      activateFunctions[i] = function () {};
    }
    activateFunctions[0] = weekstime;
    activateFunctions[1] = weeksage;
    activateFunctions[2] = slamstime;
    activateFunctions[3] = slamsage;

    var scroll = scroller()
      .container(d3.select('#graphic5'));

    scroll(d3.selectAll('#sections5 .step'), 'scroller5'); 


    

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

    return <div className='goatcontainer'></div>
  }
}