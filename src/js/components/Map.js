import React, {Component}  from 'react';
import ReactDOM from 'react-dom';
import ReactMapGL, {NavigationControl, FlyToInterpolator} from 'react-map-gl';
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
            transitionDuration: 2000,
            transitionInterpolator: new FlyToInterpolator(),
            transitionEasing: d3.easeCubic
        };
        that.setState({viewport: viewport});

    }
    function saginaw() {
      const viewport = {
            ...that.state.viewport,
            longitude: -83.9508,
            latitude: 43.4195,
            zoom: 12,
            transitionDuration: 2000,
            transitionInterpolator: new FlyToInterpolator(),
            transitionEasing: d3.easeCubic
        };
        that.setState({viewport: viewport});
  }
  function compton() {
    const viewport = {
            ...that.state.viewport,
            longitude: -118.2201,
            latitude: 33.8958,
            zoom: 12,
            transitionDuration: 2000,
            transitionInterpolator: new FlyToInterpolator(),
            transitionEasing: d3.easeCubic
        };
    that.setState({viewport: viewport});
    //document.getElementById("map-background-img").src = compton2img


  }
  function florida() {
    const viewport = {
            ...that.state.viewport,
            longitude: -80.0534,
            latitude: 26.7153,
            zoom: 12,
            transitionDuration: 2000,
            transitionInterpolator: new FlyToInterpolator(),
            transitionEasing: d3.easeCubic
        };
    that.setState({viewport: viewport});
    //document.getElementById("map-background-img").src = floridaimg

  }

  function firstmatch() {
     const viewport = {
            ...that.state.viewport,
            longitude: -71.277572,
            latitude: 46.784652,
            zoom: 16,
            transitionDuration: 2000,
            transitionInterpolator: new FlyToInterpolator(),
            transitionEasing: d3.easeCubic
        };
    that.setState({viewport: viewport});
  }
  const activateFunctions = [];
  for (var i = 0; i < d3.selectAll('#sections1 .step').size(); i++) {
    activateFunctions[i] = function () {};
  }
  activateFunctions[0] = defaultmap;
  activateFunctions[1] = saginaw;
  activateFunctions[2] = compton;
  activateFunctions[3] = florida;
  activateFunctions[4] = firstmatch;
  var scroll = scroller()
    .container(d3.select('#graphic1'));

  scroll(d3.selectAll('#sections1 .step'), "scroller1");



  scroll.on('active', function (index) {

    // highlight current step text
    d3.selectAll('#sections1 .step')
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
		window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
		const mobile = window.mobilecheck()

    const caliTerrain = `https://api.mapbox.com/styles/v1/elbertwang/cjfucu6i376ts2soynyp6oc55?access_token=${MAPBOX_TOKEN}`
    return (
      <ReactMapGL
        {...this.state.viewport}

        mapboxApiAccessToken={MAPBOX_TOKEN}
        scrollZoom={false}
				dragPan={!mobile}
				dragRotate={!mobile}
        mapStyle={caliTerrain}
        onViewportChange={this._onViewportChange.bind(this)}>
        <div style={{position: 'absolute', right: 10, top: 10}}>
          <NavigationControl onViewportChange={this._onViewportChange.bind(this)} />
        </div>
      </ReactMapGL>
    );
  }
}
