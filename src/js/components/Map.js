import React, {Component}  from 'react';
import ReactDOM from 'react-dom';
import ReactMapGL, {NavigationControl, FlyToInterpolator, Marker} from 'react-map-gl';
import * as d3 from 'd3';
import {scroller} from '../scripts/scroller.js';

const MAPBOX_TOKEN = "pk.eyJ1IjoiZWxiZXJ0d2FuZyIsImEiOiJjajk3dmw4amUwYmV2MnFydzl3NDIyaGFpIn0.46xwSuceSuv2Fkeqyiy0JQ";

export default class Map extends Component {

	constructor(props) {
		super(props);
		this.state = {
		  viewport: {
		    latitude: 39.8283,
		    longitude: -98.5795,
		    zoom: 3.7,
		    width: window.innerWidth,
        height: window.innerHeight,
        mapboxApiAccessToken: {MAPBOX_TOKEN},
        lastIndex: -1,
        activeIndex: 0,

		  }
	  }
	}


  componentDidMount() {
    const that = this
    window.addEventListener('resize', this._resize.bind(this));
    this.setState({
      viewport: {...this.state.viewport}
    })
    this._resize(); 

    window.addEventListener('scroll', (event) => {
      //console.log(ReactDOM.findDOMNode(this))
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
      }
        else {
         d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_fixed", false)
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_unfixed", true)
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_bottom", false)
      } 
    
  
    })

    function defaultmap() {
      const viewport = {
            ...that.state.viewport,
            longitude: -98.5795,
            latitude: 39.8283,
            zoom: 3.7,
        };
        that.setState({viewport: viewport});

    }
    function saginaw() {
    console.log("getting inside saginaw")
      const viewport = {
            ...that.state.viewport,
            longitude: -83.9508,
            latitude: 43.4195,
            zoom: 9,
        };
        that.setState({viewport: viewport});
  }
  function compton() {
    console.log("getting inside compton")
    const viewport = {
            ...that.state.viewport,
            longitude: -118.2201,
            latitude: 33.8958,
            zoom: 12,
        };
        that.setState({viewport: viewport});

  }
  function florida() {
    console.log("getting inside florida")
    const viewport = {
            ...that.state.viewport,
            longitude: -80.1387,
            latitude: 26.8234,
            zoom: 12, 
        };
        that.setState({viewport: viewport});

  }
  console.log(d3.selectAll('.sections .step').size());
  const activateFunctions = [];
    for (var i = 0; i < d3.selectAll('.sections .step').size(); i++) {
      activateFunctions[i] = function () {};
    }
    activateFunctions[0] = defaultmap;
    activateFunctions[1] = saginaw;
    activateFunctions[2] = compton;
    activateFunctions[3] = florida;
    var scroll = scroller()
      .container(d3.select('.graphic'));

    scroll(d3.selectAll('.sections .step')); 
    console.log(d3.selectAll('.sections .step').length)

    

    scroll.on('active', function (index) {
      // highlight current step text
      d3.selectAll('.step')
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
 
  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }
  

  render() {
    //const {viewport} = this.state;
    const {viewport, updateViewport} = this.props;
    return (
      <ReactMapGL
        {...this.state.viewport}
        transitionDuration={2000}
        transitionInterpolator={new FlyToInterpolator()}
        transitionEasing={d3.easeCubic}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        scrollZoom={false}
        mapStyle='mapbox://styles/mapbox/streets-v9'
        onViewportChange={this._onViewportChange.bind(this)}>
        <div style={{position: 'absolute', right: 10, top: 10}}>
          <NavigationControl onViewportChange={updateViewport} />
        </div>
        <Marker latitude={37.78} longitude={-122.41} offsetLeft={-20} offsetTop={-10}>
          <div>You are here</div>
        </Marker>
      </ReactMapGL>
    );
  }
}
//ReactDOM.render(<Map />, document.getElementById('map'));  