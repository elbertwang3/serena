import React, { Component } from 'react';
import Map from './components/Map.js';
import RankingLine from './components/RankingLine.js';
import '../css/App.css';
import * as d3 from 'd3';


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
            
            <div className='graphic'>
              <div className="viz">

                <Map />
              </div>
              <div className='sections'>
            
                <section className="step">
                  <p className="prose">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim pharetra massa, sit amet pretium risus efficitur vitae. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut hendrerit purus, et tempus libero. Vestibulum convallis ullamcorper nulla, non dictum nisi pretium ac. Duis sollicitudin rutrum nisi et suscipit. Pellentesque tortor dolor, interdum aliquam metus id, porttitor ornare neque. Nullam nisl quam, sodales vitae ultricies sed, gravida at orci. </p>
                </section>
                <section className="step">
                  <p className="prose">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim pharetra massa, sit amet pretium risus efficitur vitae. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut hendrerit purus, et tempus libero. Vestibulum convallis ullamcorper nulla, non dictum nisi pretium ac. Duis sollicitudin rutrum nisi et suscipit. Pellentesque tortor dolor, interdum aliquam metus id, porttitor ornare neque. Nullam nisl quam, sodales vitae ultricies sed, gravida at orci. </p>
                </section>
                <section className="step">
                  <p className="prose">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim pharetra massa, sit amet pretium risus efficitur vitae. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut hendrerit purus, et tempus libero. Vestibulum convallis ullamcorper nulla, non dictum nisi pretium ac. Duis sollicitudin rutrum nisi et suscipit. Pellentesque tortor dolor, interdum aliquam metus id, porttitor ornare neque. Nullam nisl quam, sodales vitae ultricies sed, gravida at orci. </p>
                </section>
                <section className="step">
                  <p className="prose">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim pharetra massa, sit amet pretium risus efficitur vitae. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut hendrerit purus, et tempus libero. Vestibulum convallis ullamcorper nulla, non dictum nisi pretium ac. Duis sollicitudin rutrum nisi et suscipit. Pellentesque tortor dolor, interdum aliquam metus id, porttitor ornare neque. Nullam nisl quam, sodales vitae ultricies sed, gravida at orci. </p>
                </section>
                <section className="step">
                  
                </section>
              </div>
             
            </div>
            <section className="step">
                  <p className="prose">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim pharetra massa, sit amet pretium risus efficitur vitae. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut hendrerit purus, et tempus libero. Vestibulum convallis ullamcorper nulla, non dictum nisi pretium ac. Duis sollicitudin rutrum nisi et suscipit. Pellentesque tortor dolor, interdum aliquam metus id, porttitor ornare neque. Nullam nisl quam, sodales vitae ultricies sed, gravida at orci. </p>
                </section>
                <section className="step">
                  <p className="prose">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim pharetra massa, sit amet pretium risus efficitur vitae. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut hendrerit purus, et tempus libero. Vestibulum convallis ullamcorper nulla, non dictum nisi pretium ac. Duis sollicitudin rutrum nisi et suscipit. Pellentesque tortor dolor, interdum aliquam metus id, porttitor ornare neque. Nullam nisl quam, sodales vitae ultricies sed, gravida at orci. </p>
                </section>
                <section className="step">
                  <p className="prose">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim pharetra massa, sit amet pretium risus efficitur vitae. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut hendrerit purus, et tempus libero. Vestibulum convallis ullamcorper nulla, non dictum nisi pretium ac. Duis sollicitudin rutrum nisi et suscipit. Pellentesque tortor dolor, interdum aliquam metus id, porttitor ornare neque. Nullam nisl quam, sodales vitae ultricies sed, gravida at orci. </p>
                </section>
                <section className="step">
                  <p className="prose">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim pharetra massa, sit amet pretium risus efficitur vitae. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut hendrerit purus, et tempus libero. Vestibulum convallis ullamcorper nulla, non dictum nisi pretium ac. Duis sollicitudin rutrum nisi et suscipit. Pellentesque tortor dolor, interdum aliquam metus id, porttitor ornare neque. Nullam nisl quam, sodales vitae ultricies sed, gravida at orci. </p>
                </section>


        </div>

      </div>
    );
  }
}

export default App;
