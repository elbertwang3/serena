import React, {Component}  from 'react';
import '../../css/App.css';
import * as d3 from 'd3';
import {swoopyArrow} from '../scripts/swoopyArrow';
import {getLengthAtPoint} from '../scripts/path';
import SlamTooltip from './SlamTooltip.js';

export default class RankingLine extends Component {

	constructor(props){
    super(props);
    this.divRef = React.createRef();
    this.gRef = React.createRef();
    this.svgRef = React.createRef();
    this.tooltipRef = React.createRef();
    this.state = {
      margin: {top: 50, right: 25, bottom: 25, left: 50},
      width: 500,
      height: 8000,
      linedata: null,
      slamdata: null,
      annotationdata: null,
      images: null,
      flags: null,
      currSlamData: null,
      tooltipStyle: {
        position: 'absolute',
        background: 'black',
        color: 'white',
        left: 0,
        right: 0,
        top: 500,
        margin: 'auto',
        opacity: 1,
        display: 'none'
      },
      border: '1px solid white'

    };

  }

  importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  importAllFlags(r) {

    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }


  componentDidMount() {
    var files = ["data/serenaranking.csv", "data/slamresultsmatches.csv", "data/rankingannotations.csv"];
    var types = [this.type, this.type2, this.type3];
    Promise.all(files.map((url,i) => {
      return d3.csv(url, types[i].bind(this))
    })).then(values => {
      const images = this.importAll(require.context('../../images/originaltrophies', false, /\.(png|jpe?g|svg)$/));
      const flags = this.importAllFlags(require.context('../../images/flags', false, /\.(png|jpe?g|svg)$/));
      this.setState({
        linedata: values[0],
        slamdata: values[1],
        annotationdata: values[2],
        images: images,
        flags: flags },
        () => {
          this.createLineChart()
        }
      )
    })

    window.addEventListener('resize', () => {
      var chart = this.svgRef.current
      var chartWidth = chart.getAttribute("width")
      var chartHeight = chart.getAttribute("height")
      var aspect = chartWidth / chartHeight
      var parentcontainer = this.divRef.current

      var targetWidth = parentcontainer.offsetWidth;
      if (targetWidth < 500) {
        console.log("Getting here");
        //this.setState({width: targetWidth})
        chart.setAttribute('width', targetWidth)
        chart.setAttribute('height', targetWidth/aspect)

      } else {
        //this.setState({width: 1000})
        chart.setAttribute('width', 500)
        chart.setAttribute('height', 8000)
      }
    })

    window.dispatchEvent(new Event('resize'));
  }




  componentWillReceiveProps() {
  }

   /*componentDidUpdate() {
      this.createLineChart()
   }*/
  createLineChart() {

      var {width, height, margin, linedata, slamdata, annotationdata} = this.state
      const innerWidth = width - margin.left - margin.right
      const innerHeight =  height - margin.top - margin.bottom

      const linedatadict = linedata.reduce((map, obj) => {
        map[obj.ranking_date] = obj.ranking;
        return map;
      }, {});

      const parseDate = d3.timeParse('%Y-%m-%d');
      const yExtent = d3.extent(linedata, d =>
        parseDate(d['ranking_date'])
      );



      const yScale = d3.scaleTime()
        .domain(yExtent)
        .range([0, innerHeight]);

      const xScale = d3.scaleLinear()
        .domain([500,100,10,5,1])
        .range([0, 1*innerWidth/4, 2*innerWidth/4, 3*innerWidth/4, innerWidth])


      const slamColorScale = d3.scaleOrdinal()
        .domain(["Australian Open", "French Open", "Wimbledon", "US Open"])
        .range(["#91ceff", "#f28b02", "#4ec291", "#91ceff"])

      /*const roundScale = d3.scaleOrdinal()
        .domain(['A', '1R', '2R', '3R', '4R', 'QF', 'SF', 'F', 'W'])
        .range([0, 1/8, 2/8, 3/8, 4/8, 5/8, 6/8, 7/8, 1])*/


      const line = d3.line()
        .curve(d3.curveStep)
        .y(d => yScale(parseDate(d.ranking_date)))
        .x(d => xScale(d.ranking));

      const mainpath = d3.select(this.gRef.current).append("g")
        .append("path")
        .datum(linedata)
        .attr("class", "ranking-line")
        .attr("d", line)
        .attr("stroke-dasharray", function(d) { return d3.select(this).node().getTotalLength() + " " + d3.select(this).node().getTotalLength()})
        .attr("stroke-dashoffset", function(d) { return 0; })

      const nowins = slamdata.filter(d => d['result'] !== "W")
      const winsonly = slamdata.filter(d => d['result'] === "W")
      var slams = d3.select(this.gRef.current).append("g")
        .attr("class", "slams")
        .selectAll(".slam")
        .data(nowins)
        .enter()
        .append("g")
        .attr("class", "slam")

      slams.append("rect")
        .attr("class", "slam-circle")
        .attr("fill", "black")
        .attr("x", d => xScale(linedatadict[d['date']])-12)
        .attr("y", d => yScale(parseDate(d['date']))-12)
        .attr("width", 24)
        .attr("height", 24)
        .on("mouseover", function(d) {
        })

      slams.append("text")
        .attr("class", "slam-text")
        .text(d => d['result'])
        .attr("fill", d => (d['result'] === 'A' ? "#D3D3D3" : slamColorScale(d['slam'])))
        .attr("x", d => xScale(linedatadict[d['date']]))
        .attr("y", d => yScale(parseDate(d['date'])))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")


      //const images = this.importAll(require.context('../../images/trophies', false, /\.(png|jpe?g|svg)$/));
      var wins = d3.select(this.gRef.current).append("g")
        .attr("class", "slamwins")
        .selectAll(".slamwin")
        .data(winsonly)
        .enter()
        .append("g")
        .attr("class", "slam")
        .attr("transform", d => `translate(${xScale(linedatadict[d['date']])}, ${yScale(parseDate(d['date']))})`)

       wins.append("rect")
        .attr("class", "slam-circle")
        .attr("fill", "black")
        .attr("x",-14)
        .attr("y", -14)
        .attr("width", 28)
        .attr("height", 28)
        .on("mouseover", function(d) {
          console.log("hello")
          //d3.select(this).attr("fill", "white")
        })

      wins.append("svg:image")
        .attr("xlink:href", d => {
          return this.state.images[`${d['slam']}.png`]
        })
        .attr("class", "trophy")
        .attr("width", 22)
        .attr("height", 22)
        .attr("x", -11)
        .attr("y", -11)

      d3.selectAll(".slam")
        .attr("opacity", 0)

      const xAxis = d3.select(this.gRef.current).append("g")
        .call(d3.axisTop(xScale)
        .tickValues([500,100,10,5,3,2,1]))
        .attr("class", "intro-ranking-axis")
        .attr("id", "intro-ranking-x-axis")
			d3.select("#intro-ranking-x-axis").append("text")
				.text("Ranking")
				.attr("x", innerWidth)
				.attr("y", -25)
				.attr("text-anchor", "end")

      d3.select(this.gRef.current).append("g")
        .call(d3.axisLeft(yScale)
          .ticks(d3.timeYear.every(1)))
        .attr("class", "intro-ranking-axis")

      var swoopy = swoopyArrow()
        .angle(Math.PI/4)
        .x(function(d) { return d[0]; })
        .y(function(d) { return d[1]; });


      const ranking_annotation = d3.select(this.gRef.current)
        .append("g")
        .attr("class", "ranking-annotations")
        .selectAll(".ranking-annotation")
        .data(annotationdata)
        .enter()
        .append("g")
        .attr("class", "ranking-annotation")
        .attr("transform", d => {
          return `translate(${d['x1']}, ${d['y1']})`
        })
        .attr("opacity", 0)


      ranking_annotation.append("text")
        .text(function(d) { return d['annotation']})

        // .attr("x", d => d['x1'])
        // .attr("y", d => d['y1'])
        .attr("x", d => (d['x1'] > d['x2'] ? 10 : -10))

          //(d['y1'] > d['y2']) ? -d3.select(this).node().getBBox().height : d3.select(this).node().getBBox().height )
        .attr("dy", "1.25em")
        .attr("text-anchor", d => (d['x1'] > d['x2'] ? "start" : "end"))
        .call(this.wrap, 130)

      ranking_annotation.selectAll("text")
        .attr("y", function(d) {
          return -d3.select(this).node().getBBox().height/2;
        })


      ranking_annotation.append("path")
        .attr('marker-end', 'url(#arrowhead)')
        .datum(function(d) {
          return [[0,0], [d['x2']-d['x1'], d['y2']-d['y1']]]
        })
        .attr("d", swoopy)
        .attr("class", "swoopy-arrow")

      const noAbsences = slamdata.filter(d => d['result'] !== 'A')
      let prevSlam = null;
      let currSlam = null;
      window.addEventListener('scroll', (event) => {
        const divRect = this.divRef.current.getBoundingClientRect();

        const topoffset = divRect.top + window.pageYOffset
        const bottomoffset = divRect.bottom + window.pageYOffset
        const lineLength = mainpath.node().getTotalLength()
        const offset = window.innerHeight/2
        const realHeight = bottomoffset - topoffset
        const ratio = realHeight/this.state.height;
        var pageYOffset = (window.pageYOffset)/ratio
        pageYOffset = pageYOffset - (window.innerHeight * (1-ratio))
        if (window.pageYOffset >= topoffset && window.pageYOffset <= bottomoffset - 75) {
           xAxis.attr('transform', `translate(0, ${pageYOffset - window.innerHeight})`)


        } else if (window.pageYOffset <= topoffset) {

          xAxis.attr('transform', `translate(0, 0)`);

        }

        if (window.pageYOffset >= topoffset - offset && window.pageYOffset <= bottomoffset - offset) {
          var y_pos = pageYOffset - topoffset + window.innerHeight/2
          var x_pos = this.findXatYbyBisection(y_pos, mainpath.node())
          var gohere = getLengthAtPoint(mainpath.node(), {x: x_pos, y: y_pos})

          mainpath
            .attr("stroke-dashoffset", function(d) {
              return lineLength-gohere;
            })

            d3.selectAll(".slam")
              .filter(function(d){
                return y_pos >= yScale(parseDate(d['date']));
              })

              .attr("opacity", 1)
            let currentList = noAbsences.filter(function(d){
                return y_pos >= yScale(parseDate(d['date']))
              });
            if (currentList.length !== 0) {
              if (currSlam !== currentList[currentList.length - 1]) {
                prevSlam = currSlam;
                currSlam = currentList[currentList.length - 1];
                this.setState({currSlamData: currSlam})
                if (prevSlam != null) {
                  //console.log(prevSlam['slam'])
                }
                //console.log(currSlam['slam'])
              }
            }

            //tooltipcontainer.select


            d3.selectAll(".ranking-annotation")
              .filter(function(d){
                return y_pos >= d['y2'];
              })
              .attr("opacity", 1)

            d3.select(this.gRef.current).append("g")
            .attr("class", "slams")
            .selectAll(".slam")
            .data(nowins)

            d3.selectAll(".slam")
              .filter(function(d){
                return y_pos < yScale(parseDate(d['date']));
              })
              .attr("opacity", 0)

            d3.selectAll(".ranking-annotation")
              .filter(function(d){
                return y_pos < d['y2'];
              })
              .attr("opacity", 0)
        } else if (window.pageYOffset <= topoffset - offset) {
          mainpath
            .attr("stroke-dashoffset", lineLength);
        }


        if (window.pageYOffset >= topoffset && window.pageYOffset <= bottomoffset - topoffset) {

          this.setState(prevState => ({
            tooltipStyle: {
              ...prevState.tooltipStyle,
              position: 'fixed',
              opacity: 1,
              display: 'block'
            }
          }))
        }
        else if (window.pageYOffset > bottomoffset - topoffset){
          this.setState(prevState => ({
            tooltipStyle: {
              ...prevState.tooltipStyle,
              position: 'absolute',
              opacity: 0,
              top: 'auto',
              bottom: 100
            }
          }))
          //this.setState({position: {position:'absolute', top: 'auto', bottom: 100, opacity: 0}})
        } else if (window.pageYOffset <= topoffset) {

          this.setState(prevState => ({
            tooltipStyle: {
              ...prevState.tooltipStyle,
              position: 'absolute',
              top: 500,
            }
          }))
          //this.setState({position: {position:'absolute', top: 500}})
        }
    })

   }
    type(d) {
      d['ranking'] = +d['ranking'];
      return d;
    }
    type2(d) {
      const parseDate2 = d3.timeParse('%d %B %Y');
      const formatDate = d3.timeFormat('%Y-%m-%d');
      d['date'] = formatDate(parseDate2(d['date']));
      return d;
    }
    type3(d) {
      d['x1'] = +d['x1'];
      d['y1'] = +d['y1'];
      d['x2'] = +d['x2'];
      d['y2'] = +d['y2'];
      return d;
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
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", +lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }
    findXatYbyBisection(y, path, error){
      var length_end = path.getTotalLength(path)
        , length_start = 0
        , point = path.getPointAtLength((length_end + length_start) / 2) // get the middle point
        , bisection_iterations_max = 50
        , bisection_iterations = 0

      error = error || 0.01

      while (y < point.y - error || y > point.y + error) {
        // get the middle point
        point = path.getPointAtLength((length_end + length_start) / 2)

        if (y < point.y) {
          length_end = (length_start + length_end)/2
        } else {
          length_start = (length_start + length_end)/2
        }

        // Increase iteration
        if(bisection_iterations_max < ++ bisection_iterations)
          break;
      }
      return point.x
    }




    render() {
      const {margin, width, height, tooltipStyle, currSlamData, border} = this.state
      var slamTooltip;
      //const emptySlamData = ['year','result','date','date_1','result2','round','tourney_date,tourney_id,tourney_year,tourney_name,surface,draw_size,tourney_level,match_num,winner_id,winner_seed,winner_entry,winner_name,winner_hand,winner_ht,winner_ioc,winner_age,winner_rank,winner_rank_point]
      if (this.state.currSlamData != null) {

        slamTooltip = <SlamTooltip data={currSlamData} tooltipStyle={tooltipStyle} border={border}/>
      } else {

        slamTooltip = <SlamTooltip tooltipStyle={tooltipStyle} />
      }
      return <div id="rankingline" ref={this.divRef}>
        {/*<div className='slam-tooltip' ref={this.tooltipRef}></div>*/}
        {slamTooltip}
        <svg className="ranking-line-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} ref={this.svgRef}>
          <g transform={`translate(${margin.left}, ${margin.top})`} ref={this.gRef} />
          <defs>
            <marker id="arrowhead" viewBox="-10 -10 20 20" refX="0" refY="0" markerWidth="20" markerHeight="20" strokeWidth="1" fill="white" orient="auto"><polyline strokeLinejoin="bevel" points="-6.75,-6.75 0,0 -6.75,6.75"></polyline>
            </marker>
          </defs>
        </svg>
      </div>
   }
}
