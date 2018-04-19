import React, { Component } from 'react';
import Map from './components/Map.js';
import RankingLine from './components/RankingLine.js';
import ServeGraphic from './components/ServeGraphic.js';
import ServeAnimation from './components/ServeAnimation.js';
import Rivalry from './components/Rivalry.js';
import ServeBreak from './components/ServeBreak.js';
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
      servedata: null,
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
    var files = ["data/venusrivalry.csv", "data/mariarivalry.csv", "data/venusannotation.csv", "data/mariaannotation.csv", "data/servestats.csv"];
    var types = [this.type, this.type, this.type, this.type, this.type2];
    Promise.all(files.map((url,i) => { 
      return d3.csv(url, types[i].bind(this))
    })).then(values => {
      this.setState({
        venusdata: values[0],
        mariadata: values[1],
        venusannotation: values[2],
        mariaannotation: values[3],
        servedata: values[4].filter(d => d['Sum_Sum_w_1stWon'] > 5000)
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

  type2(d) {
    d['percent_servept_won'] = +d['percent_servept_won']
    d['percent_breakpt_saved'] = +d['percent_breakpt_saved']
    d['Sum_Sum_w_1stWon'] = +d['Sum_Sum_w_1stWon']
    return d
  }
  render() {
    const {venusdata, mariadata, venusannotation, mariaannotation, renderReady, servedata} = this.state
    var rivalries
    var servestats
    if (renderReady) {
      rivalries = <div> <Rivalry data={venusdata} annotations={venusannotation} width={600} height={1000} margin={{top:25, bottom: 25, right: 25, left: 25}} />
             <p className="prose"> Serena has had a long, one-sided rivalry with Maria Sharapova, but in recent years it has translated somewhat of a feud off the court. On the court, however, Serena gets the last word.</p>
            <Rivalry data={mariadata} annotations={mariaannotation} width={600} height={800} margin={{top:25, bottom: 25, right: 25, left: 25}} />
            </div>
      servestats = <div className="serveStatsGraphic"><ServeBreak data={servedata} width={600} height={600} margin={{top:25, bottom: 25, right: 25, left: 25}} /></div>
          
    } else {
      rivalries = <div></div>
      servestats = <div></div>
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
             <h2> Serena's Childhood </h2>
              <p className="prose">Much ink has been spilled over the Williams sisters childhood...Richard Williams, wanted to make them into a great tennis players despite having no background in the sport </p>     
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
                  <p className="prose">Her very first WTA match was against Annie Miller in a qualifying round at the Bell Challenge in Quebec. She lost, 1-6, 1-6. While Miller retired 2 years later at 22, did NCAA,and lived a very ordinary life, Serena went on to something quite extraordinary. </p>                 
                </section>
                <section className="step">
                  
                </section>
              </div>
             
            </div>
            <h2> Serena's Serve </h2>
            <p className="prose"> While ATP players routinely dominate their serve and hold serve, the WTA players don't focus on it as much. Yet the serve is why Serena is so successful. It allows her to get out of tight points, hold serve, end points early.</p>
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
            <h2> Serve Speed</h2>
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
            <h2> Serve Direction</h2>
             <p className="prose">Yet speed doesn't tell the whole story. Plenty of players can serve fast, but they aren't nearly as successful as Serena is. One difference is that Serena hits her spots on her serve. On first serves, she rarely serves in the middle of the box, most wide or up the T.</p>
            <h2> How Serena Dominates on Serve </h2>
            <p className="prose">Her powerful serve translates into higher % of serve points won and % break points saved. When she's down break point she can easily erase it with an ace, and she can make quick work of her service games when she's in a rhythm, ending points quickly. This has been the key to her success.</p>
            {servestats}
            <h2> Serena's Rivals </h2>
            <p className="prose">While the men's tour has been dominated by the Big 4, the WTA does not have such an equivalent. Serena is in a league of her own. Still, throughout the years Serena has had her share of rivals, with her sister Venus being her main one for all these years. In the beginning, Venus was supposed to be the bigger star, but father Richard knew that Serena would be better. </p>
            {rivalries}
            <h2> Search for a Head-to-Head </h2>
            <p className="prose"> After all these years, no one Serena has played more than two matches against has had a winning record against her, except for one player--Arantxa Sanchez Vicario. Search for her, and other players using the search box. Some other notable rivalries include Victoria Azarenka, Jennifer Capriati, Justin Henin, and Elena Dementieva. </p> 
            <h2> Greatest of All Time </h2>

        </div>

      </div>
    );
  }
}

export default App;
