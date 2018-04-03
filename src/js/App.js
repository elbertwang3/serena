import React, { Component } from 'react';
import Map from './components/Map.js';
import RankingLine from './components/RankingLine.js';
import '../css/App.css';
import * as d3 from 'd3';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      serena_ranking_data: null
    };
    this.type = this.type.bind(this);
    this.setState = this.setState.bind(this);
  
    
  }

  componentDidMount() {
    var files = ["data/serenaranking.csv"];
    Promise.all(files.map(url => d3.csv(url, this.type))).then(function(values) {
      console.log(values);
      this.setState({
        serena_ranking_data: values,
  
      })
    })  
  }

  type(d) { 
    d['ranking'] = +d['ranking'];
    return d;
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
          <div className="background-container parallax">
        
          </div>
          <div className="title-container">
            <div className="title">
              Serena The Great
            </div>
            <div className="subhed">
              A data-driven analysis of the most dominant tennis player, male or female, of our era
            </div>
          </div>

        </div>
        <div className="body">
          <div id="rankingline">
            <RankingLine />
          </div>
          <Map />
        </div>

      </div>
    );
  }
}

export default App;
