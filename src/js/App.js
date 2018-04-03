import React, { Component } from 'react';
import logo from '../images/logo.svg';
import background from '../images/background2.jpg';
import Map from './Map.js';
import '../css/App.css';

class App extends Component {
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
          <div id="map"></div>
          <Map />
        </div>

      </div>
    );
  }
}

export default App;
