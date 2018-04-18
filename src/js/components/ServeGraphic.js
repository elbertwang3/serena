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
      margin: {top: 25, right: 0, bottom: 25, left: 50},
      width: 700,
      height: window.innerHeight,
      servedata: null,
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
    const {width, height, margin, servedata, flags} = this.state
    const innerWidth = this.state.width - margin.left - margin.right
    const innerHeight = this.state.height - margin.bottom - margin.top
    var arc = d3.arc()
      .innerRadius(width/2)
      .outerRadius(width/2)
      .startAngle(-Math.PI/6)
      .endAngle(Math.PI/6);

    const svg = d3.select(ReactDOM.findDOMNode(this)).select("svg").select("g")
    const yScale = d3.scaleLinear()
      .domain([0, servedata.length])
      .range([0, innerHeight])

    const durationScale = d3.scaleLinear()
      .domain([0, d3.max(servedata, d => d['speed'])])
      .range([3000, 1000])

    const arcs = svg.append("g")
      .attr("class", "arcs")

    const arcgroup = arcs
      .selectAll(".arc")
      .data(servedata)
      .enter()
      .append('g')
      .attr("class", "arc-group")
      .attr("transform", (d, i) => `translate(0, ${yScale(i)})`)

    const arcgroupprofile = arcgroup.append("g")
      .attr("class", "arc-group-profile")
      .attr("transform", `translate(0,20)`)

    const arcgroupprofiletext = arcgroupprofile.append("g")
       //.attr("transform", `translate()`)


    arcgroupprofiletext.append("text")
      .text(d => d['player'])
      .attr("transform", d => {
        if (d['country'] != "") {
            return "translate(70,20)"
        } else {
           return "translate(90,20)"
        }
      })
      .attr("text-anchor", "end")
      .attr("class", "player-name")

     arcgroupprofile.append("svg:image")
      .attr("xlink:href", d => {
          if (d['country'] != null) {
             return this.state.flags[`${d['country']}.png`]
        }
      })
      .attr("width", 20)
      .attr("transform", "translate(75, 10)")
  


    arcgroupprofiletext.append("text")
      .text(d => d['serve'])
      .attr("transform", "translate(90,35)")
      .attr("text-anchor", "end")
     .attr("class", "serve-type")

    arcgroupprofile.append("svg:image")
        .attr("xlink:href", d => {
          return this.state.serves[`${d['player']} serve.gif`]
        })
        .attr("class", "arc-photo")
        .attr("width", 50)
        .attr("height", 50)
         .attr("transform", "translate(100,0)")


    const speedanno = arcgroup.append("g")
      .attr("class", "speed-annotation")
      .attr("transform", `translate(${4.1*width/5}, 40)`)

    speedanno.append('text')
      .text(d => `${d['speed'].toFixed(1)} mph`)
      .attr("class", "serve-speed")

    speedanno.append('text')
      .text(d => `${(d['speed'] * 1.60934).toFixed(1)} kph`)
      .attr("class", "serve-speed")
       .attr("transform", `translate(0, 15)`)


       

    arcgroup
      .append("path")
      .attr("d", arc)
      .attr("class", "arc")
      .attr("transform", (d, i) => `translate(${width/2 + 20}, ${width/2})`)
      .attr("stroke-dasharray", function(d) { return d3.select(this).node().getTotalLength() + " " + d3.select(this).node().getTotalLength()})
      .attr("stroke-dashoffset", function(d) { return d3.select(this).node().getTotalLength(); })


    arcgroup.append("svg:image")
      .attr("xlink:href", this.state.serves['tennisball.svg'])
      .attr("height", 10)
      .attr("class", "tennis-ball")
      .attr("transform", `translate(165,40)`)
      //.attrTween("transform", d => that.translateAlong(d3.select('.arc').node()))
   
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
      that.state.sound.play()
      console.log("fastest")
      d3.selectAll('.arc')
        .filter(d => d['type'] == 'first')
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

      that.state.sound.play()
      console.log("averages")
      d3.selectAll('.arc')
        .filter(d => d['type'] == 'second')
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

        return "translate(" + (p.x + 375) + "," + (p.y + 345) + ")";
      };
    
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
      <svg className="serve-graphic-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} >
        <g transform={`translate(${margin.left}, ${margin.top})`} />
        
      </svg>
    </div>
  }
}