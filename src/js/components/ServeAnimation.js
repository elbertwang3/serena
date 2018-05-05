import React, {Component}  from 'react';
import '../../css/App.css';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';
import {scroller} from '../scripts/scroller.js';


export default class ServeAnimation extends Component {
	constructor(props){
	  super(props);
    this.state = {

      serves: null,
      currentServe: null


    };
  }

  componentWillMount() {



  }

  componentDidMount() {
    const serves = this.importAll(require.context('../../images/serves', false, /\.(png|jpe?g|svg|gif)$/));
    this.setState({serves: serves})
    this.setState({currentServe: serves['1.png']})
    const that = this
    window.addEventListener('scroll', (event) => {
      //console.log(ReactDOM.findDOMNode(this))
			//console.log(window.pageYOffset);
      const divRect = ReactDOM.findDOMNode(this).parentNode.parentNode.getBoundingClientRect();
      const topoffset = divRect.top + window.pageYOffset
			//console.log(topoffset);
      const bottomoffset = divRect.bottom + window.pageYOffset
      /*console.log(topoffset)
      console.log(bottomoffset-window.innerHeight)
      console.log(window.pageYOffset)*/
      if (window.pageYOffset >= topoffset && window.pageYOffset <= bottomoffset - window.innerHeight) {
        //console.log("fixed")
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_fixed", true)
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_unfixed", false)
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_bottom", false)
      } else if (window.pageYOffset > bottomoffset - window.innerHeight) {
         //console.log("bottom")
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_fixed", false)
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_unfixed", false)
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_bottom", true)
      } else {
        //console.log("unfixed")
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_fixed", false)
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_unfixed", true)
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_bottom", false)
      }


    })


  var scroll = scroller()
    .container(d3.select('#graphic3'));

  scroll(d3.selectAll('#sections3 .smallerstep'), "scroller3");
  scroll.on('active', function (index) {

    // highlight current step text
    d3.selectAll('#sections3 .smallerstep')
      .style('opacity', function (d, i) {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 600) {
            return i === index ? 0.8 : 0.1;
        } else {
          return i === index ? 1 : 0.1;
        }
      });
      if (index+1 <= 25) {
         that.setState({currentServe: that.state.serves[`${index+1}.png`]});
      } else {
        that.setState({currentServe: that.state.serves[`25.png`]});
      }
  })



  }
  importAll(r) {

    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }

  render() {
    const {currentServe} = this.state

    return <div className="serve-image-container">
      <img className="serve-image" alt="serve" src={currentServe}></img>
    </div>
  }
}
