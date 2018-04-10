import React, {Component}  from 'react';
import ReactDOM from 'react-dom';
import ReactMapGL, {NavigationControl} from 'react-map-gl';
import * as d3 from 'd3';

const MAPBOX_TOKEN = "pk.eyJ1IjoiZWxiZXJ0d2FuZyIsImEiOiJjajk3dmw4amUwYmV2MnFydzl3NDIyaGFpIn0.46xwSuceSuv2Fkeqyiy0JQ";

export default class Map extends Component {

	constructor(props) {
		super(props);
		this.state = {
		  viewport: {
		    latitude: 43.4195,
		    longitude: -83.9508,
		    zoom: 9,
		    width: window.innerWidth,
        height: window.innerHeight,
        mapboxApiAccessToken: {MAPBOX_TOKEN}
		  }
	  }
	}


  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this.setState({
      viewport: {...this.state.viewport}
    })
    this._resize(); 

    window.addEventListener('scroll', (event) => {
      //console.log(ReactDOM.findDOMNode(this))
       const divRect = ReactDOM.findDOMNode(this).parentNode.parentNode.getBoundingClientRect();
    console.log(divRect);
    console.log(ReactDOM.findDOMNode(this).parentNode.parentNode)

      const topoffset = divRect.top + window.pageYOffset
      const bottomoffset = divRect.bottom + window.pageYOffset
      console.log(window.pageYOffset)
      console.log(topoffset)
      console.log(bottomoffset);
      console.log(bottomoffset - topoffset);
      console.log(bottomoffset-window.innerHeight)
      if (window.pageYOffset >= topoffset && window.pageYOffset <= bottomoffset - window.innerHeight) {
        console.log("getting inside map")
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_fixed", true)
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_unfixed", false)
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_bottom", false)
      } else if (window.pageYOffset > bottomoffset - window.innerHeight) {
        console.log("getting to bottom")
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
        mapboxApiAccessToken={MAPBOX_TOKEN}
        scrollZoom={false}
        mapStyle='mapbox://styles/mapbox/streets-v9'
        onViewportChange={this._onViewportChange.bind(this)}>
        <div style={{position: 'absolute', right: 10, top: 10}}>
          <NavigationControl onViewportChange={updateViewport} />
        </div>
      </ReactMapGL>
    );
  }
}
//ReactDOM.render(<Map />, document.getElementById('map'));  