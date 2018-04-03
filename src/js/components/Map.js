import React, {Component}  from 'react';
import ReactMapGL from 'react-map-gl';

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
    });
    this._resize();
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
    return (
      <ReactMapGL
        {...this.state.viewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        scrollZoom={false}
        mapStyle='mapbox://styles/mapbox/streets-v9'
        onViewportChange={this._onViewportChange.bind(this)}
      />
    );
  }
}
//ReactDOM.render(<Map />, document.getElementById('map'));  