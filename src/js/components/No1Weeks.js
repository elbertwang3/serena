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
    let xCut = "date"
    let yCut = "weeks"
    const chart = linechart()
    const el = d3.select('.goatcontainer')
    let weeksScale = d3.scaleLinear()
    let slamsScale = d3.scaleLinear()
    let timeScale = d3.scaleTime()
    let ageScale = d3.scaleLinear()

    let line = null
    let voronoi = null
    let width = 0
    let height = 0
    let chartWidth = 0
    let chartHeight = 0




    function resize() {
      //const sz = Math.min(el.node().offsetWidth, window.innerHeight) * 0.9
      const width = window.innerWidth
      const height = window.innerHeight
      chart.width(width).height(height)
      el.call(chart)
    }
    function linechart() {

      let currXScale = null
      let currYScale = null

      function translate(x, y) {
        return `translate(${x}, ${y})`
      }

      function enter({ container, data }) {
        const svg = container.selectAll('svg').data([data])
        const svgEnter = svg.enter().append('svg').attr("class", "no1svg")
        const gEnter = svgEnter.append('g')
        const axis = gEnter.append('g').attr('class', 'g-axis')
        const xAxis = axis.append('g').attr('class', 'x-axis')
        const yAxis = axis.append('g').attr("class", 'y-axis')
        const playerLines = gEnter.append('g').attr("class", 'player-lines')
        const voronoiLines = gEnter.append('g').attr("class", 'voronoi-lines')
        const nameAnnos = gEnter.append('g').attr("class", 'name-annos')

        xAxis.append('text').attr('class', 'axis__label')
          .attr('text-anchor', 'middle')
          .text('Year')


        yAxis.append('text').attr('class', 'axis__label')
          .attr('text-anchor', 'middle')
          .text('Cumulative Weeks at No. 1')
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

        voronoi
        .extent([[-margin.left, -margin.top], [chartWidth + margin.right, chartHeight + margin.bottom]]);

      }

      function updateDom({ container, data }) {
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

        playerline
          .enter()
          .append("path")
        .merge(playerline)
          .transition()
          .duration(1000)
          .attrTween("d", (d, i, nodes) => {
            d.line = nodes[i];
            var previous = d3.select(nodes[i]).attr('d');
            var current = line(d.values);
            return interpolatePath(previous, current);
          })
          .attr("class", d => {
            return `player-line ${d['key'].replace(/[.,/#!$%^&*;:{}'=\-_`~()]/g,"").replace(/ +/g, '-')}`
          })
          .attr("stroke", (d,i,nodes) => {
            if (d.values[0]['retired'] === 'T') {
              return '#a9a9a9'
            } else if (d.values[0]['player'] === 'Serena Williams') {
              return '#5171BC'
            } else {
               d3.select(nodes[i]).moveToFront()
              return '#FF8A4F'
            }
          })
          .attr("opacity", d => d['key'] === 'Serena Williams' ? 1 : 0.5)
          .attr("stroke-width", d => d['key'] === 'Serena Williams' ? "4px" : "2px")

        const voronoiLines = g.select(".voronoi-lines")
        const voronoiLine = voronoiLines.selectAll("path")
          .data(voronoi.polygons(d3.merge(data.map(function(d) { return d.values; }))))

        voronoiLine.exit().remove()

        voronoiLine
          .enter()
          .append("path")
        .merge(voronoiLine)
          .attr("d", function(d) {
            return d ? "M" + d.join("L") + "Z" : null;
          })
          .on("mouseover",  function(d) {
            const mouseoverdata = d
            let line = d3.select(`.player-line.${d.data['player'].replace(/[.,/#!$%^&*;':{}=\-_`~()]/g,"").replace(/ +/g, '-')}`)
            line.classed("city--hover", true);
            line.moveToFront()
            //line.parentNode.appendChild(line);
            //d3.select(".focus").attr("transform", "translate(" + currXScale(d.data.date) + "," + currYScale(d.data.value) + ")")
            //d3.select(".focus").select("text").text(d.data.city.name);
            d3.selectAll(".player-line").attr("opacity", 0.25)
            line.attr("opacity", 1)



            const lineLength = line.node().getTotalLength()
            const topPt = line.node().getPointAtLength(lineLength)

            d3.select(".name-anno-g").remove()
            const nameAnno = d3.select(".name-annos").selectAll(".name-anno-g")
              .data(data.filter(d => d['key'] === mouseoverdata.data['player']))
            nameAnno.exit().remove()
            const annoG = nameAnno
              .enter()
              .append("g")
            .merge(nameAnno)
              .attr("class", "name-anno-g")

            annoG
              .append("text")
              .text(d => d['key'])
              .attr("x", d => {
                return xCut === 'date' ? currXScale(dateParser(d.values[d.values.length - 1][xCut])) - 30 : currXScale(d.values[d.values.length - 1][xCut]) - 30
              })
              .attr("y", d => {
                return currYScale(d.values[d.values.length - 1][yCut]) + 0
              })
              .attr("class", "name-anno-name")
              .attr("text-anchor", "end")

            const datum = line.datum()
            annoG
              .append("text")
              .text(d => {
                if (yCut === 'numslams') {

                  return d.values[datum.values.length - 1].numslams === 1 ?  `${d.values[d.values.length - 1].numslams} slam` :  `${d.values[datum.values.length - 1].numslams} slams`
                } else {
                  return d.values[datum.values.length - 1].weeks === 1 ?  `${d.values[d.values.length - 1].weeks} week at no. 1` :  `${d.values[datum.values.length - 1].weeks} weeks at no. 1`
                }
              })
              .attr("x", d => {
                return xCut === 'date' ? currXScale(dateParser(d.values[d.values.length - 1][xCut])) - 30 : currXScale(d.values[d.values.length - 1][xCut]) - 30
              })
              .attr("y", d => {
                return currYScale(d.values[d.values.length - 1][yCut]) + 15
              })
              .attr("class", "name-anno")
              .attr("text-anchor", "end")




          })

          .on("mouseout", function(d) {
              d3.select(".name-anno-g").remove()
              const nameAnno = d3.select(".name-annos").selectAll(".name-anno-g")
              .data(data.filter(d => d['key'] === 'Serena Williams'))
            nameAnno.exit().remove()
            const annoG = nameAnno
              .enter()
              .append("g")
            .merge(nameAnno)
              .attr("class", "name-anno-g")

            annoG
              .append("text")
              .text(d => d['key'])
              .attr("x", d => {
                 return xCut === 'date' ? currXScale(dateParser(d.values[d.values.length - 1][xCut])) - 30 : currXScale(d.values[d.values.length - 1][xCut]) - 30
              })
              .attr("y", d => {
                return currYScale(d.values[d.values.length - 1][yCut]) + 0
              })
              .attr("class", "name-anno-name")
              .attr("text-anchor", "end")


            annoG
              .append("text")
              .text(d => {
                if (yCut === 'numslams') {

                  return d.values[d.values.length - 1].numslams === 1 ? `${d.values[d.values.length - 1].numslams} slam` :  `${d.values[d.values.length - 1].numslams} slams`
                } else {
                  return d.values[d.values.length - 1].weeks === 1 ?  `${d.values[d.values.length - 1].weeks} weeks at no. 1` :  `${d.values[d.values.length - 1].weeks} weeks at no. 1`
                }
              })
              .attr("x", d => {

                return xCut === 'date' ? currXScale(dateParser(d.values[d.values.length - 1][xCut])) - 30 : currXScale(d.values[d.values.length - 1][xCut]) - 30
              })
              .attr("y", d => {
                return currYScale(d.values[d.values.length - 1][yCut]) + 15
              })
              .attr("class", "name-anno")
              .attr("text-anchor", "end")

              d3.selectAll('.player-line').filter(d => d['retired'] === 'F').moveToFront()
              d3.selectAll('.player-line.Serena-Williams').moveToFront()
              d3.select(".x-axis").select(".domain").moveToFront()

              if (d != null) {
                let line = d3.select(`.player-line.${d.data['player'].replace(/[.,\/#!$%\^&\*;':{}=\-_`~()]/g,"").replace(/ +/g, '-')}`)
                line.classed("city--hover", false);

              }

            d3.selectAll(".player-line").attr("opacity", d => d['key'] === 'Serena Williams' ? 1 : 0.25)
            //d3.select(".focus").attr("transform", "translate(-100,-100)");
          })
          .attr("class", "voronoi")

        d3.selectAll('.player-line').filter(d => d['retired'] === 'F').moveToFront()

        d3.selectAll('.player-line.Serena-Williams').moveToFront()
        d3.select(".x-axis").select(".domain").moveToFront()

        d3.select(".name-anno-g").remove()
        const nameAnno = d3.select(".name-annos").selectAll(".name-anno-g")
          .data(data.filter(d => d['key'] === 'Serena Williams'))
        nameAnno.exit().remove()
        const annoG = nameAnno
          .enter()
          .append("g")
        .merge(nameAnno)
          .attr("class", "name-anno-g")

        annoG
          .append("text")
          .text(d => d['key'])
          .attr("x", d => {
             return xCut === 'date' ? currXScale(dateParser(d.values[d.values.length - 1][xCut])) - 30 : currXScale(d.values[d.values.length - 1][xCut]) - 30
          })
          .attr("y", d => {
            return currYScale(d.values[d.values.length - 1][yCut]) + 0
          })
          .attr("class", "name-anno-name")
          .attr("text-anchor", "end")


        annoG
          .append("text")
          .text(d => {
            if (yCut === 'numslams') {

              return d.values[d.values.length - 1].numslams === 1 ? `${d.values[d.values.length - 1].numslams} slam` :  `${d.values[d.values.length - 1].numslams} slams`
            } else {
              return d.values[d.values.length - 1].weeks === 1 ?  `${d.values[d.values.length - 1].weeks} week at no. 1` :  `${d.values[d.values.length - 1].weeks} weeks at no. 1`
            }
          })
          .attr("x", d => {


            return xCut === 'date' ? currXScale(dateParser(d.values[d.values.length - 1][xCut])) - 30 : currXScale(d.values[d.values.length - 1][xCut]) - 30
          })
          .attr("y", d => {

            return currYScale(d.values[d.values.length - 1][yCut]) + 15
          })
          .attr("class", "name-anno")
          .attr("text-anchor", "end")
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

        //x.select(".domain").remove()
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
          .text(yCut == "numslams" ? "slams" : "weeks at no. 1")


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
      chart.scaleX(timeScale, "date")
      chart.scaleY(weeksScale, "weeks")
      el.datum(formatWeeksData(that.props.rankingdata))
      line = d3.line()
        .x(function(d) { return timeScale(dateParser(d['date'])); })
        .y(function(d) { return weeksScale(d['weeks']); })
        .curve(d3.curveLinear)

      voronoi = d3.voronoi()
        .x(function(d) { return timeScale(dateParser(d['date'])); })
        .y(function(d) { return weeksScale(d['weeks']); })
        .extent([[-margin.left, -margin.top], [chartWidth + margin.right, chartHeight + margin.bottom]]);


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
        .curve(d3.curveLinear)

      voronoi
        .x(function(d) { return ageScale(d['age']); })
        .y(function(d) { return weeksScale(d['weeks']); })
        .extent([[-margin.left, -margin.top], [chartWidth + margin.right, chartHeight + margin.bottom]]);

      el.call(chart)

    }

    function slamstime() {
      console.log("slamstime")
      chart.scaleX(timeScale, 'date')
      chart.scaleY(slamsScale, "numslams")
      el.datum(formatSlamsData(that.props.slamdata))
      line = d3.line()
        .x(function(d) { return timeScale(dateParser(d['date'])); })
        .y(function(d) { return slamsScale(d['numslams']); })
        .curve(d3.curveStepAfter)

      voronoi
        .x(function(d) { return timeScale(dateParser(d['date'])); })
        .y(function(d) { return slamsScale(d['numslams']); })
        .extent([[-margin.left, -margin.top], [chartWidth + margin.right, chartHeight + margin.bottom]]);
      el.call(chart)

    }

    function slamsage() {
      console.log("slamsage")
      chart.scaleX(ageScale, "age")
      chart.scaleY(slamsScale, "numslams")
      el.datum(formatSlamsData(that.props.slamdata))
      line = d3.line()
        .x(function(d) { return ageScale(d['age']); })
        .y(function(d) { return slamsScale(d['numslams']); })
        .curve(d3.curveStepAfter)

      voronoi
        .x(function(d) { return ageScale(d['age']); })
        .y(function(d) { return slamsScale(d['numslams']); })
        .extent([[-margin.left, -margin.top], [chartWidth + margin.right, chartHeight + margin.bottom]]);
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
      return formattedData

    }

    function formatSlamsData(slamdata) {
      let formattedData = []
      let data = d3.nest()
          .key(function(d) { return d['player']; })
          .entries(slamdata)

      for (let i = 0; i < data.length; i++) {
        let outputArray = []
        for (let j = 0; j < data[i].values.length; j++) {
          let obj = data[i].values[j]
          if (obj['date'] == "") {
            let age = (dateParser(obj['slamdate']).getTime() - birthdayParser(obj['birthday']).getTime()) / 31556952000
            obj['numslams'] = j
            obj['age'] = age
            obj['date'] = obj['slamdate']
            let objBefore = _.clone(obj)
            objBefore['numslams'] = j - 1
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
    var entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '\'',
      "/": '&#x2F;'
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
