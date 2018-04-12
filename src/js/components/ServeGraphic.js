import React, {Component}  from 'react';
import '../../css/App.css';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';
import {scroller} from '../scripts/scroller.js';

export default class ServeGraphic extends Component {
	constructor(props){
	  super(props);
    this.state = {
      margin: {top: 50, right: 25, bottom: 50, left: 25},
      width: 700,
      height: window.innerHeight,
      servedata: null,
      flags: null
     

    };
  }

  importAllFlags(r) {
 
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  componentWillMount() {
    const flags = this.importAllFlags(require.context('../../images/flags', false, /\.(png|jpe?g|svg)$/));
    this.setState({flags: flags})


  }

  componentDidMount() {
    

    var files = ["data/servespeed.csv"];
    var types = [this.type];
    Promise.all(files.map((url,i) => { 
      return d3.csv(url, types[i].bind(this))
    })).then(values => {
      this.setState({
        servedata: values[0],
      }, () => {
          this.createServeGraphic()
        }
      )
    })



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

     window.addEventListener('resize', () => {
      var chart = document.getElementsByClassName('serve-graphic-svg')[0]
      var chartWidth = chart.getAttribute("width")
      var chartHeight = chart.getAttribute("height")
      var aspect = chartWidth / chartHeight
      var parentcontainer = ReactDOM.findDOMNode(this)
      var targetWidth = parentcontainer.offsetWidth;
      if (targetWidth < 700) {
        chart.setAttribute('width', targetWidth)
        chart.setAttribute('height', window.innerHeight)

      } else {
        chart.setAttribute('width', 700)
        chart.setAttribute('height', window.innerHeight)
      }
    })
    
    window.dispatchEvent(new Event('resize'));

  }

  createServeGraphic() {
    const that = this
    const {margin, servedata, flags} = this.state
    const width = this.state.width - margin.left - margin.right
    const height = this.state.height - margin.bottom - margin.top

    var arc = d3.arc()
      .innerRadius(width/2)
      .outerRadius(width/2)
      .startAngle(-Math.PI/6)
      .endAngle(Math.PI/6);

    const svg = d3.select(ReactDOM.findDOMNode(this)).select("svg").select("g")

    const yScale = d3.scaleLinear()
      .domain([0, servedata.length - 1])
      .range([width/2/6, height - width/2/6])

    svg.append("g")
      .attr("class", "arcs")
      .selectAll(".arc")
      .data(servedata)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("class", "arc")
      /*.append("circle")
      .attr("r", d => d['speed']/10)*/
      .attr("transform", (d, i) => `translate(0, ${yScale(i)})`)


    function defaultchart() {
      console.log("defaultchart")
    }

    function fastest() {
      console.log("fastest")
    }
    function averages() {
      console.log("averages")

    }
    const activateFunctions = [];
    for (var i = 0; i < d3.selectAll('#sections2 .step').size(); i++) {
      activateFunctions[i] = function () {};
    }
    activateFunctions[0] = defaultchart;
    activateFunctions[1] = fastest;
    activateFunctions[2] = averages;

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


  }
  type(d) { 
    d['speed'] = +d['speed'];
    return d;
  }

  /*resize() {
    if (window.innerWidth <= 700) {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight
      });
    } else {
      this.setState({
        width: 700,
        height: window.innerHeight
      });
    }
  }*/

  render() {
      const {margin, width, height} = this.state
      return <div id="serve-graphic">
        <svg className="serve-graphic-svg" width={width} height={height} viewBox={`0 0 ${width} ${window.innerHeight}`} >
          <g transform={`translate(${width/2}, ${width/2})`} />
          
        </svg>
      </div>
    }
 }