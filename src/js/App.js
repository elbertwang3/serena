import React, { Component } from 'react';
import Map from './components/Map.js';
import RankingLine from './components/RankingLine.js';
import ServeGraphic from './components/ServeGraphic.js';
import '../css/App.css';
import * as d3 from 'd3';
import compton2 from '../images/compton2.jpg';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
    };

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

  }


  render() {
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
          


        </div>

      </div>
    );
  }
}

export default App;
