import React from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = process.env.mapboxgl_key; 

export default class Map extends React.Component {
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9'
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    const style = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%'
    };

    return <div style={style} ref={el => this.mapContainer = el} />;
  }
}
//ReactDOM.render(<Map />, document.getElementById('map'));  