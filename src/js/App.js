import React, { Component } from 'react';
import Map from './components/Map.js';
import RankingLine from './components/RankingLine.js';
import ServeGraphic from './components/ServeGraphic.js';
import ServeAnimation from './components/ServeAnimation.js';
import Rivalry from './components/Rivalry.js';
import ServeBreak from './components/ServeBreak.js';
import ServeDirection from './components/ServeDirection.js';
import Input from './components/Input.js';
import No1Weeks from './components/No1Weeks.js';
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
      servedirectiondata: null,
      serenamatches: null,
      weeksat1: null,
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
    var files = ["data/venusrivalry.csv", "data/mariarivalry.csv", "data/venusannotation.csv", "data/mariaannotation.csv", "data/servestats.csv", "data/servedirection.csv", "data/serenamatches.csv", "data/weeksat1.tsv", "data/slamdata.tsv"];
    var types = [this.type, this.type, this.type, this.type, this.type2, this.type3, this.type, this.type4, this.type5];
    var csvPattern = new RegExp(".csv$")
    //var tsvPattern = 
    Promise.all(files.map((url,i) => {
      if (csvPattern.test(url)) {
        return d3.csv(url, types[i].bind(this))
      } else {
         return d3.tsv(url, types[i].bind(this))
      }
    })).then(values => {
      console.log(values[8])
      this.setState({
        venusdata: values[0],
        mariadata: values[1],
        venusannotation: values[2],
        mariaannotation: values[3],
        servedata: values[4].filter(d => d['Sum_Sum_w_1stWon'] > 3000),
        //servedata: values[4],
        servedirectiondata: values[5],
        serenamatches: values[6],
        weeksat1: values[7],
        slamdata: values[8],
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

  type3(d) {
    d['total_ad_serves'] = +d['total_ad_serves']
    d['total_deuce_serves'] = +d['total_deuce_serves']
    d['Sum_deuce_wide'] = +d['Sum_deuce_wide']
    d['Sum_deuce_middle'] = +d['Sum_deuce_middle']
    d['Sum_deuce_t'] = +d['Sum_deuce_t']
    d['Sum_ad_wide'] = +d['Sum_ad_wide']
    d['Sum_ad_middle'] = +d['Sum_ad_middle']
    d['Sum_ad_t'] = +d['Sum_ad_t']
    return d

  }

  type4(d) {
    d['player'] = d['player'].replace(/ *\([^)]*\) */g, "")
    d['consecutive'] = +d['consecutive']
    d['total'] = +d['total']
    return d
  }

  type5(d) {
    var monthDict = {'Australian Open' : "Jan 29", "French Open" : "Jun 11", "Wimbledon" : "Jul 16", "US Open" : "Sep 10"}
    d['player'] = d['player'].replace(/ *\([^)]*\) */g, "")
    console.log(d['date'])
    d['slamdate'] = d['date'] == "" ? `${monthDict[d['slam']]}, ${d['year']}` : d['date']
    return d
  }
  render() {
    const {venusdata, mariadata, venusannotation, mariaannotation, renderReady, servedata, servedirectiondata, serenamatches, weeksat1, slamdata} = this.state
    var rivalries, servestats, servedirection, input, goat
    if (renderReady) {
      rivalries = <div> <Rivalry data={venusdata} annotations={venusannotation} margin={{top:25, bottom: 25, right: 25, left: 25}} />
             <p className="prose"> Serena has had a long, one-sided rivalry with Maria Sharapova, but in recent years it has translated somewhat of a feud off the court. On the court, however, Serena gets the last word.</p>
            <Rivalry data={mariadata} annotations={mariaannotation} margin={{top:25, bottom: 25, right: 25, left: 25}} />
            </div>
      servestats = <div className="serveStatsGraphic"><ServeBreak data={servedata} /></div>
      servedirection = <ServeDirection data={servedirectiondata} />
      input = <Input data={serenamatches} />
      goat = <No1Weeks rankingdata={weeksat1} slamdata={slamdata}/>
          
    } else {
      rivalries = <div></div>
      servestats = <div></div>
      servedirection = <div></div>
      input = null
      goat = null
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
            <p className="prose">Yet speed doesn't tell the whole story. Plenty of players can serve fast, but they aren't nearly as successful as Serena is on serve. One difference is that Serena hits her spots on her serve. On first serves, she rarely serves in the middle of the box, most wide or up the T.</p>
            <div className='graphic' id='graphic4'>
              <div className="viz" id="viz4">
                {servedirection}
              </div>
              <div className='sections' id='sections4'>
                <section className="step">
                  <p className="prose">Serena's 1st serve direction </p>                 
                </section>
                <section className="step">
                  <p className="prose">average WTA player 1st serve direction</p>                 
                </section>
                <section className="step">
                  <p className="prose">Serena's 2nd serve direction She hits this with spin, body serve</p>                 
                </section>
                <section className="step">
                  <p className="prose">average WTA 2nd serve direction</p>           
                </section>
            
              </div>
             
            </div>

            <h2> Dominating on Serve and Return </h2>
            <p className="prose">Her powerful serve translates into higher % of serve points won and % break points saved. When she's down break point she can easily erase it with an ace, and she can make quick work of her service games when she's in a rhythm, ending points quickly. This has been the key to her success.</p>
            {servestats}
            <h2> Serena's Rivals </h2>
            <p className="prose">While the men's tour has been dominated by the Big 4, the WTA does not have such an equivalent. Serena is in a league of her own. Still, throughout the years Serena has had her share of rivals, with her sister Venus being her main one for all these years. In the beginning, Venus was supposed to be the bigger star, but father Richard knew that Serena would be better. </p>
            {rivalries}
            <h2> Search for a Head-to-Head </h2>
            <div className="finder">
              {input}
            </div>
            <p className="prose"> After all these years, no one Serena has played more than two matches against has had a winning record against her, except for one player--Arantxa Sanchez Vicario. Search for her, and other players using the search box. Some other notable rivalries include Victoria Azarenka, Jennifer Capriati, Justin Henin, and Elena Dementieva. </p> 
            <h2> Greatest of All Time </h2>
            <div className='graphic' id='graphic5'>
              <div className="viz" id="viz5">
                {goat}
              </div>
              <div className='sections' id='sections5'>
      
                <section className="step">
                  <p className="prose">WEEKS at no. 1 over time </p>                 
                </section>
                <section className="step">
                  <p className="prose">weeks at no. 1 over age </p>                 
                </section>
                <section className="step">
                  <p className="prose">num slams over time </p>                 
                </section>
                <section className="step">
                  <p className="prose">num slams over age, longevity</p>           
                </section>
            
              </div>
             
            </div>
        </div>

      </div>
    );
  }
}

export default App;
