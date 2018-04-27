import React, { Component } from 'react';
import { interpolatePath } from 'd3-interpolate-path';
import '../../css/App.css';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import {scroller} from '../scripts/scroller.js';
import * as _ from 'lodash';


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
    const margin = {top: 25, bottom: 50, right: 25, left: 70}
    let {rankingdata, slamdata} = this.props

    const dateParser = d3.timeParse("%b %e, %Y")
    const birthdayParser = d3.timeParse("%Y%m%d")
    
    /*data = data.map(d => {  

      d.values
      [{country: d['country']}]
      //, d['player']: d['player'], d['birthday']: d['birthday'], d['retired']: d['retired'], d['date']: d['startdate'], d['weeks']: d['total'] - d['consecutive']},
      //{country: d['country'], d['player']: d['player'], d['birthday']: d['birthday'], d['retired']: d['retired'], d['date']: d['enddate'], d['weeks']: d['total']}]

    })*/
    let xCut = "time"
    let yCut = "weeks"
    const chart = linechart()
    const el = d3.select('.goatcontainer')
    let weeksScale = d3.scaleLinear()    
    let slamsScale = d3.scaleLinear()
    let timeScale = d3.scaleTime()
    let ageScale = d3.scaleLinear()
   
    let line = null





    function resize() {
      //const sz = Math.min(el.node().offsetWidth, window.innerHeight) * 0.9
      const width = window.innerWidth
      const height = window.innerHeight
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

     
      

     /*let formattedData = []

      if (yCut == "weeks") {
        let data = d3.nest()
          .key(function(d) { return d['player']; })
          .entries(rankingdata)

        for (let i = 0; i < data.length; i++) {
          let outputArray = []
          for (let j = 0; j < data[i].values.length; j++) {
            let obj = data[i].values[j]
            let ageBefore = (dateParser(obj['startdate']).getTime() - birthdayParser(obj['birthday']).getTime()) / 31556952000
            let ageAfter = (dateParser(obj['enddate']).getTime() - birthdayParser(obj['birthday']).getTime()) / 31556952000
            outputArray.push({'country': obj['country'], 'player': obj['player'], 'birthday': obj['birthday'], 'retired': obj['retired'], 'date': obj['startdate'], 'weeks': obj['total'] - obj['consecutive'], 'age': ageBefore})
            outputArray.push({'country': obj['country'], 'player': obj['player'], 'birthday': obj['birthday'], 'retired': obj['retired'], 'date': obj['enddate'], 'weeks': obj['total'], 'age': ageAfter})
          }
          formattedData.push({'key': data[i].key, values: outputArray})
        }
      } else {
        let data = d3.nest()
          .key(function(d) { return d['player']; })
          .entries(slamdata)

        console.log(data)

      }
      console.log(formattedData)*/

      function translate(x, y) {
        return `translate(${x}, ${y})`
      }

      function enter({ container, data }) {
        console.log(data)
        const svg = container.selectAll('svg').data([data])
        const svgEnter = svg.enter().append('svg')
        const gEnter = svgEnter.append('g')
        const axis = gEnter.append('g').attr('class', 'g-axis')
        const xAxis = axis.append('g').attr('class', 'x-axis')
        const yAxis = axis.append('g').attr("class", 'y-axis')
        const playerLines = gEnter.append('g').attr("class", 'player-lines')

        xAxis.append('text').attr('class', 'axis__label')
          .attr('text-anchor', 'middle')
          .text('Year')
      

        yAxis.append('text').attr('class', 'axis__label')
          .attr('text-anchor', 'middle')
          .text('Cumulative Weeks at No. 1')  

        /*const playerline = playerLines.selectAll(".player-line")
          .data(data, d => {
            console.log(d)
            return d['key']
          })


        playerline.exit().remove()

         playerline
          .enter()
          .append("path")
        .merge(playerline)
          //.transition()
          //.duration(1000)
          .attr("d", d => line(d.values))
          .attr("class", "player-line")*/

      }

      function updateScales({ container, data }) {

        weeksScale
          .domain([0,400])
          .range([chartHeight, 0])

        slamsScale 
          .domain([0, 25])
          .range([chartHeight, 0])


        timeScale
          .domain([d3.min(data, array => d3.min(array.values, d => dateParser(d['date']))), d3.max(data, array => d3.max(array.values, d => dateParser(d['date'])))])
          .range([0, chartWidth])

        ageScale
          .domain([d3.min(data, array => d3.min(array.values, d => d['age'])), d3.max(data, array => d3.max(array.values, d => d['age']))])
          .range([0, chartWidth])


      }

      function updateDom({ container, data }) {
        console.log(data)
        const svg = container.select('svg')
    
        svg
          .attr('width', width)
          .attr('height', height)

        const g = svg.select('g')
        g.attr('transform', translate(margin.left, margin.top))

        const lines = g.select(".player-lines")

        const playerline = lines.selectAll(".player-line")
         .data(data, d => d['key'])

        playerline.exit().remove()

        console.log(playerline)

        console.log(data)
        playerline
          .enter()
          .append("path")
        .merge(playerline)
          .on("mouseover", function(d) {
            d3.select(this).moveToFront()
            console.log(d['key'])
            return d
          })
          .transition()
          .duration(1000)
          .attrTween("d", (d, i, nodes) => {
            var previous = d3.select(nodes[i]).attr('d');
            var current = line(d.values);
            return interpolatePath(previous, current);
          }) 
          .attr("class", "player-line")
         




      }

      
      function updateAxis({ container, data }) {
        const axis = container.select('.g-axis')

        const axisLeft = d3.axisLeft(currYScale)
        const axisBottom = d3.axisBottom(currXScale)
        //axisBottom.selectAll(".domain").remove()
        //axisBottom.selectAll(".tick").remove()

        axisLeft.ticks(Math.floor(currYScale.range()[0] / 100))
        axisBottom.ticks(Math.floor(currXScale.range()[1]/ 100)); //for yearscale
        //axisBottom.ticks(d3.range(scaleX.domain()[0], scaleX.domain()[1], 5)) //for agescale
        //axisLeft.ticks(d3.range(scaleY.domain()[0], scaleY.domain()[1], 100)) //for weeks
        //axisLeft.ticks(d3.range(scaleY.domain([0], scaleY.domain([1], 5)))) //for slams
        const x = axis.select('.x-axis')


        const maxY = currYScale.range()[0]
        const offset = maxY

        const buffer = Math.ceil(margin / 2)
        
        x
          .attr('transform', translate(0, chartHeight))
          .call(axisBottom)

        const y = axis.select('.y-axis')

        y.call(axisLeft)

        x.select('.axis__label')
          .attr("transform", `translate(${chartWidth/2}, ${margin.bottom*1.5/2})`)

        y.select('.axis__label')
          .attr('transform', `translate(${-margin.left/2}, ${chartHeight/2}) rotate(-90)`)

        x.select(".domain").remove()
        y.select(".domain").remove()
        //x.selectAll(".tick").append("")
        y.selectAll(".tick")
          .filter(d => d == 0)
          .select("line")
          .remove()
        y.selectAll(".tick")
          //.filter(d => d != 0)
          .select("line")
          .attr("y1", 0)
          .attr("y2", 0)
          .attr("fill", "none")
          .attr("stroke-dasharray", "4,4")
          .attr("stroke", "#a9a9a9")
          .attr("x1", 0)
          .attr("x2", chartWidth)
          
           

        x.select(".axis__label")
          .text(xCut)

        y.select(".axis__label")
          .text(yCut)


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

      chart.scaleX = function(...args) {

        currXScale = args[0]
        xCut = args[1]
        return chart
      }

      chart.scaleY = function(...args) {
        currYScale = args[0]
        yCut = args[1]
        return chart
      }

      d3.selection.prototype.moveToFront = function() {  
        return this.each(function(){
          this.parentNode.appendChild(this);
        });
      };
      d3.selection.prototype.moveToBack = function() {  
          return this.each(function() { 
              var firstChild = this.parentNode.firstChild; 
              if (firstChild) { 
                  this.parentNode.insertBefore(this, firstChild); 
              } 
          });
    };
      return chart

      
    }

    function init() {
      chart.width(window.innerWidth).height(window.innerHeight)
      
      weekstime()
      
      //resize()
      window.addEventListener('resize', resize)
      //graphic.select('.slider input').on('input', handleInput)
    }

    init()

    function weekstime() {
      console.log("weekstime")
      chart.scaleX(timeScale, "time")
      chart.scaleY(weeksScale, "weeks")
      el.datum(formatWeeksData(that.props.rankingdata))
      line = d3.line()
        .x(function(d) { return timeScale(dateParser(d['date'])); })
        .y(function(d) { return weeksScale(d['weeks']); })
        //.curve(d3.curveStepBefore)

      el.call(chart)
    }
    function weeksage() {

      console.log("weeksage")
      chart.scaleX(ageScale, "age")
      chart.scaleY(weeksScale, "weeks")
      el.datum(formatWeeksData(that.props.rankingdata))
      line = d3.line()
        .x(function(d) { return ageScale(d['age']); })
        .y(function(d) { return weeksScale(d['weeks']); })

      el.call(chart)

    }

    function slamstime() {
      console.log("slamstime")
      chart.scaleX(timeScale, "time")
      chart.scaleY(slamsScale, "slams")
      el.datum(formatSlamsData(that.props.slamdata))
      line = d3.line()
        .x(function(d) { console.log(d); console.log(timeScale(dateParser(d['date']))); return timeScale(dateParser(d['date'])); })
        .y(function(d) { console.log(d); console.log(slamsScale(d['numslams'])); return slamsScale(d['numslams']); })
        .curve(d3.curveStepAfter)
      el.call(chart)

    }

    function slamsage() {
      console.log("slamsage")
      chart.scaleX(ageScale, "age")
      chart.scaleY(slamsScale, "slams")
      el.datum(formatSlamsData(that.props.slamdata))
      line = d3.line()
        .x(function(d) { console.log(d); console.log(ageScale(d['age'])); return ageScale(d['age']); })
        .y(function(d) { console.log(d); console.log(slamsScale(d['numslams'])); return slamsScale(d['numslams']); })
         .curve(d3.curveStepAfter)
      el.call(chart)

    }

    function formatWeeksData(rankingdata) {
      let formattedData = []
      let data = d3.nest()
          .key(function(d) { return d['player']; })
          .entries(rankingdata)

      for (let i = 0; i < data.length; i++) {
        let outputArray = []
        for (let j = 0; j < data[i].values.length; j++) {
          let obj = data[i].values[j]
          let ageBefore = (dateParser(obj['startdate']).getTime() - birthdayParser(obj['birthday']).getTime()) / 31556952000
          let ageAfter = (dateParser(obj['enddate']).getTime() - birthdayParser(obj['birthday']).getTime()) / 31556952000
          outputArray.push({'country': obj['country'], 'player': obj['player'], 'birthday': obj['birthday'], 'retired': obj['retired'], 'date': obj['startdate'], 'weeks': obj['total'] - obj['consecutive'], 'age': ageBefore})
          outputArray.push({'country': obj['country'], 'player': obj['player'], 'birthday': obj['birthday'], 'retired': obj['retired'], 'date': obj['enddate'], 'weeks': obj['total'], 'age': ageAfter})
        }
        formattedData.push({'key': data[i].key, values: outputArray})
      }
      console.log(formattedData)
      return formattedData

    }

    function formatSlamsData(slamdata) {
      console.log(slamdata)
      let formattedData = []
      let data = d3.nest()
          .key(function(d) { return d['player']; })
          .entries(slamdata)

      for (let i = 0; i < data.length; i++) {
        let outputArray = []
        for (let j = 0; j < data[i].values.length; j++) {
          let obj = data[i].values[j]
          if (obj['date'] == "") {
            console.log(obj)
            let age = (dateParser(obj['slamdate']).getTime() - birthdayParser(obj['birthday']).getTime()) / 31556952000
            console.log(age)
            obj['numslams'] = j + 1
            obj['age'] = age
            obj['date'] = obj['slamdate']
            let objBefore = _.clone(obj)
            objBefore['numslams'] = j
            outputArray.push(objBefore)
            outputArray.push(obj)
          } else {
            let age = (dateParser(obj['slamdate']).getTime() - birthdayParser(obj['birthday']).getTime()) / 31556952000
            obj['age'] = age
            outputArray.push(obj)
          }
          
        }
        formattedData.push({'key': data[i].key, values: outputArray})
      }


      return formattedData;

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