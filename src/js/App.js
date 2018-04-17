import React, { Component } from 'react';
import Map from './components/Map.js';
import RankingLine from './components/RankingLine.js';
import ServeGraphic from './components/ServeGraphic.js';
import ServeAnimation from './components/ServeAnimation.js';
import Rivalry from './components/Rivalry.js';
import '../css/App.css';
import * as d3 from 'd3';
import compton2 from '../images/compton2.jpg';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      venusdata: null,
      mariadata: null,
      venusannotation: null,
      mariaannotation: null,
      renderReady: false,
    };

  }
  componentWillMount() {
    
  }
  componentDidMount() {
    /*var files = ["data/serenaranking.csv"];
    Promise.all(files.map(url => d3.csv(url, this.type))).then(values => {
      this.setState({
        serena_ranking_data: values },
        () => {
          console.log(this.state.values)
          this.refs.rankingline.createLineChart();
        }
      )
    }) */ 
    var files = ["data/venusrivalry.csv", "data/mariarivalry.csv", "data/venusannotation.csv", "data/mariaannotation.csv"];
    var types = [this.type, this.type, this.type, this.type];
    Promise.all(files.map((url,i) => { 
      return d3.csv(url, types[i].bind(this))
    })).then(values => {
      this.setState({
        venusdata: values[0],
        mariadata: values[1],
        venusannotation: values[2],
        mariaannotation: values[3],
        }, () => {
          this.setState({renderReady: true})
          //this.createLineChart()

        }
      )
    })

    

  }

  type(d) {
    return d

  }
  render() {
    const {venusdata, mariadata, venusannotation, mariaannotation, renderReady} = this.state
    var rivalries
    if (renderReady) {
      rivalries = <div> <Rivalry data={venusdata} annotations={venusannotation} width={500} height={1000} margin={{top:25, bottom: 25, right: 25, left: 25}} />
            <Rivalry data={mariadata} annotations={mariaannotation} width={500} height={800} margin={{top:25, bottom: 25, right: 25, left: 25}} />
            </div>
          
    } else {
      rivalries = <div></div>
    }
    return (
      /*<div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro"> 
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>*/

      <div className="content">
        <div className="header">
          <div className="background-container">
        
          </div>
          <div className="title-container">
            <div className="title">
              Serena The Great
            </div>
            <div className="subhed">
              A visual story of the most dominant tennis player, male or female, of the open era
            </div>
          </div>

        </div>
        <div className="body">
         
            <RankingLine />
            
            <div className='graphic' id='graphic1'>
              <div className="viz" id="viz1">
                <img id="map-background-img"></img>
                <Map />
              </div>
              <div className='sections' id='sections1'>
            
                <section className="step">
                  <p className="prose">Serena has been </p>
                </section>
                <section className="step">
                  <p className="prose">born in Saginaw, Michigan </p>                
                </section>
                <section className="step">
                  <p className="prose">grew up in Compton, gunshots </p>                 
                </section>
                <section className="step">
                  <p className="prose">moved to Palm Beach Gardens, FL to attend Rick Macci tennis academy. soon left </p>                 
                </section>
                <section className="step">
                  
                </section>
              </div>
             
            </div>
            <h2> Serena's Weapons: Her Serve </h2>
            <div className='graphic' id='graphic3'>
              <div className="viz" id="viz3">
                <ServeAnimation />
              </div>
              <div className='sections' id='sections3'>
                <section className="smallerstep">
                  <p className="prose">hi</p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose">hi</p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose">hi</p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose">hi</p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose">hi</p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose">hi</p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose">hi</p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose">hi</p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose">hi</p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose">hi</p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose">hi</p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose">hi</p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose">hi</p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose">hi</p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose">hi</p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose">hi</p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose">hi</p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose">hi</p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
                <section className="smallerstep">
                  <p className="prose"></p>                 
                </section>
              </div>
             
            </div>
            <div className='graphic' id='graphic2'>
              <div className="viz" id="viz2">
                <ServeGraphic />
              </div>
              <div className='sections' id='sections2'>
                <section className="step">
                  <p className="prose">Serena has been </p>                 
                </section>
                <section className="step">
                  <p className="prose">all fastest serves </p>                 
                </section>
                <section className="step">
                  <p className="prose">average first and second serve wta</p>                 
                </section>
                <section className="step">
                  <p className="prose">all</p>           
                </section>
              </div>
             
            </div>
            {rivalries}

        </div>

      </div>
    );
  }
}

export default App;
