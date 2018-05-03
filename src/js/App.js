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
import UnderPressure from './components/UnderPressure.js';
import '../css/App.css';
import * as d3 from 'd3';
import compton2 from '../images/compton2.jpg';
import * as _ from 'lodash';
import * as $ from 'jquery';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      images: null,
      venusdata: null,
      mariadata: null,
      venusannotation: null,
      mariaannotation: null,
      renderReady: false,
      servedata: null,
      servedirectiondata: null,
      serenamatches: null,
      weeksat1: null,
      topplayers: null,
      topmatches: null,
    };

  }

  importAllFlags(r) {

    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  componentWillMount() {
    const images = this.importAllFlags(require.context('../images/linkimages', false, /\.(jpg)$/));
  	this.setState({images: images})

  }
  componentDidMount() {
    $('.onhover-toggle-child-class').on(
      'mouseenter mouseleave',
      function() {
        var element = $(this);
        var selector = element.data('target');
        var child = element.find(selector);
        var classes = element.data('toggle');


        child.toggleClass(classes);
      }
    );
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
    var files = ["data/venusrivalry.csv", "data/mariarivalry.csv", "data/venusannotation.csv",
    "data/mariaannotation.csv", "data/servestats.csv", "data/servedirection.csv", "data/serenamatches.csv",
    "data/weeksat1.tsv", "data/slamdata.tsv", "data/underpressure.csv", "data/servespeed.csv"];
    var types = [this.type, this.type, this.type, this.type, this.type2, this.type3, this.type,
      this.type4, this.type5, this.type6, this.type7];
    var csvPattern = new RegExp(".csv$")
    //var tsvPattern =
    Promise.all(files.map((url,i) => {
      if (csvPattern.test(url)) {
        return d3.csv(url, types[i].bind(this))
      } else {
         return d3.tsv(url, types[i].bind(this))
      }
    })).then(values => {
      console.log(values[10])
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
        underpressure: values[9],
        servespeed: values[10],
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
    d['slamdate'] = d['date'] == "" ? `${monthDict[d['slam']]}, ${d['year']}` : d['date']
    return d
  }

  type6(d) {
    d['totalwin'] = +d['totalwin']
    d['totalloss'] = +d['totalloss']
    d['total'] = +d['total']
    d['threesetwin'] = +d['threesetwin']
    d['threesetloss'] = +d['threesetloss']
    d['totalthreeset'] = +d['totalthreeset']
    d['tiebreakwin'] = +d['tiebreakwin']
    d['tiebreakloss'] = +d['tiebreakloss']
    d['totaltiebreak'] = +d['totaltiebreak']
    d['downasetwin'] = +d['downasetwin']
    d['downasetloss'] = +d['downasetloss']
    d['totaldownaset'] = +d['totaldownaset']
    return d
  }

  type7(d) {
    d['speed'] = +d['speed'];
    return d;
  }
  render() {
    const {images, venusdata, mariadata, venusannotation, mariaannotation, renderReady, servedata, servedirectiondata, serenamatches, weeksat1, slamdata, underpressure, servespeed} = this.state
    var rivalries, servestats, servedirection, input, goat, pressure, servegraphic
    if (renderReady) {
      rivalries = <div> <Rivalry data={venusdata} annotations={venusannotation} margin={{top:25, bottom: 25, right: 25, left: 25}} />
             <p className="prose"> Serena has had a long, one-sided rivalry with Maria Sharapova, but in recent years it has translated somewhat of a feud off the court. On the court, however, Serena gets the last word.</p>
            <Rivalry data={mariadata} annotations={mariaannotation} margin={{top:25, bottom: 25, right: 25, left: 25}} />
            </div>
      servestats = <div className="serveStatsGraphic"><ServeBreak data={servedata} /></div>
      servedirection = <ServeDirection data={servedirectiondata} />
      input = <Input data={serenamatches} />
      goat = <No1Weeks rankingdata={weeksat1} slamdata={slamdata}/>
      pressure = <UnderPressure data={underpressure} />
      servegraphic = <ServeGraphic data={servespeed}/>

    } /*else {
      rivalries = <div></div>
      servestats = <div></div>
      servedirection = <div></div>
      input = null
      goat = null
      pressure = null
      servegraphic = null
    }*/
    const serveTemplate = _.range(1,33).map((i) =>
    <section className="smallerstep" key={i}>
      <p className="prose"></p>
    </section>)

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
              <p className="prose">In the trailer for HBO's <i>Being Serena</i> documentary out this week, in a voiceover, Serena
                says, "I don't know if there's anything left for me in tennis," followed by a pregnant pause. "But I'm not done yet,"
                she declares, and we can sense she's still hungry for more.
              </p>
              <p className="prose">
                Plenty of critics have tried to diminish her legacy, including John McEnroe, who suggested,
                 "If she played the men's circuit she'd be like 700 in the world." But the record books speak for themselves.
               </p>
               <p className="prose">

                  <a href="#" className="relative onhover-toggle-child-class" data-target=".target" data-toggle="hidden shown">"Are you looking at my titles?"
                   <span className="absolute target hidden on-top">
                     <img src={images['titles.jpg']} alt="image" height="200"></img>
                   </span>
                 </a> reads a shirt she wore during a press conference at Wimbledon in 2009. She has won 23 Grand Slam titles, more than any man or woman
                   in the open era. She has nothing left to prove, and yet she's back. This time, perhaps, it's to prove to herself
                   that she's still got it. That she's a mother now, but she's still a champion. That she can still win again, and again, and again.
                </p>


            <div className='graphic' id='graphic1'>
              <div className="viz" id="viz1">
                <img id="map-background-img"></img>
                <Map />
              </div>
              <div className='sections' id='sections1'>

                <section className="step">
                  <p className="prose">Serena's story starts before she and older sister Venus were even born.
                 Their father, the inimitable Richard Williams, had already had conceived a vision for his future
                 daughters. It was in 1980--after flipping through channels on television when he came across
                  Romanian tennis player Virginia Ruzici, who had won a tournament in Salt Lake City and collected a
                  check for $40,000--that he decided that his not-yet-existent daughters would be tennis stars.
               </p>
               <p className="prose">He started to take tennis lessons from a man who went by Old Whiskey, lessons
                 he paid for with booze. He then drafted a 78-page plan, a manifesto of sorts, about how he was going to make
                 his daughters champions. In 1990, when Venus was just 10 years old, he predicted that she was going to be No. 1
                 in the world, and that Serena, then 9, would be even better than Venus. When film producer Arnon Milchan met
                 Richard late in 1997, he said, "You know when you meet somebody, and you think he's either insane or he's a genius?"
                 Looking back, history has judged him the latter, and his wild proclamations seem almost prophetic today. </p>
                </section>
                <section className="step">
                  <p className="prose">Serena was born in Saginaw, Michigan on September 26, 1981, a little over a year after Venus was born. </p>
                </section>
                <section className="step">
                  <p className="prose">Shortly after, the family, including their three older sisters, relocated to Compton, California.
                  Their journey began on the rough public tennis courts of East Compton Park, where they once had to stop practice
                  to duck for cover when they heard gunshots. With weeds poking through the ground and broken glass and beer bottles strewn around, the courts were a
                  far cry from the manicured lawns of Wimbledon's Centre Court.
                </p>
                  <p className="prose">
                  Yet Compton "would make them tough, give them a fighter's mentality," Richard wrote
                  in his autobiography. "And how much easier would it be to play in front of thousands of
                  white people if they had already learned to play in front of scores of armed gang members?"


                </p>
                </section>
                <section className="step">
                  <p className="prose">When Serena turned 9, the family moved to West Palm Beach, FL
                    to train at Rick Macci's tennis academy. Macci and Richard sometimes clashed, and in 1995,
                    he pulled his daughters out of the academy, coaching them himself. He also took them out
                    of the junior circuit, citing the intensity of the other parents and how time consuming it was.
                  </p>
                  <p className="prose">
                    More important than tennis, Richard wanted Serena and Venus to receive and education and develop
                    interests off the court as well. "When I look at young players on the tennis tour, it seems
                    the better they are, the less education they have," he said. With the time they would have used
                    preparing for junior tournaments, he sent them to private school and enrolled them in other activities.
                    Through careful planning by Richard and mom Oracene, Serena and Venus have lasted on the tour well
                    into their 30s and avoided burnout because they've balanced their time on and off the court. </p>
                </section>
                <section className="step">
                  <p className="prose">On October 28, 1995, Serena played her very first pro match for a qualifying round
                    at the Bell Challenge in Quebec against American Annie Miller. Serena lost, 1-6, 1-6.
                  </p>
                  <p className="prose">
                    Asked to comment on the match years later, Miller said, smiling, "In my mind I had every shot of winning the match [because I had]
                    a little more experience than she had at the time, so I played a good match, and won. I thought it was just another
                    day at the tennis courts." While Miller left tennis a couple years later and sought out a normal life,
                    Serena went on to accomplish something quite extraordinary.
                  </p>
                </section>
              </div>

            </div>
              <p className="prose">
            So why is Serena the greatest of all time? Let us count the ways.
            </p>

            <p className="prose"> While ATP players routinely dominate their serve,
              WTA players don't hold serve nearly as often due to their relatively weaker serves. Some of this discrepancy
              has been attributed to physiological differences, but Dr. Ben Kibler, an orthopedic surgeon, found that it's
              often a technical not physiological deficit. "The largest disparity found by Kibler between male and
              female professionals was in pushing off with their back legs, which 75 percent of the men in the study
              did effectively compared with only 28 percent of the women," a NY Times story found.

              In the following graphic, you can see how Serena does a deep knee bend and before pushing off,
              generating power not just from racquet speed but more importantly, her legs.
           </p>
            <div className='graphic' id='graphic3'>
              <div className="viz" id="viz3">
                <ServeAnimation />
              </div>
              <div className='sections' id='sections3'>

                {serveTemplate}
              </div>

            </div>
            <div className='graphic' id='graphic2'>
              <div className="viz" id="viz2">

                {servegraphic}
              </div>
              <div className='sections' id='sections2'>
                <section className="step">
                  <p className="prose">Serena is consistently one of the WTA tour's fastest servers. </p>
                </section>
                <section className="step">
                  <p className="prose">Here are the top 5 fastest serves on the WTA tour </p>
                </section>
                <section className="step">
                  <p className="prose">Here are the average first and second serve speeds of Serena
                  compared with that of the average WTA player. She has about 10mph faster on both serves. </p>
                </section>
                <section className="step">
                  <p className="prose"></p>
                </section>
              </div>

            </div>
            <h2> Hitting Her Spots</h2>
            <p className="prose">Yet serve speed doesn't tell the whole story. Plenty of players can serve fast,
              but they aren't nearly as successful as Serena is on serve. One difference is that Serena hits
              her spots on serve.</p>
            <div className='graphic' id='graphic4'>
              <div className="viz" id="viz4">
                {servedirection}
              </div>
              <div className='sections' id='sections4'>
                <section className="step">
                  <p className="prose">On first serves, Serena rarely serves in the middle of the box, hitting the vast majority
                     out wide or up the T. With speed combined with placement, many of her first serves are unreturnable,
                     her likelihood of hitting an ace on any given serve is the highest on the tour. </p>
                </section>
                <section className="step">
                  <p className="prose">The average WTA player serves down the middle three times as often as Serena does. Serena punishes
                   opponents with weak serves and poor placement, hitting return winners on serves that sit up for her to bla </p>
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
            <h2> Keeping Points Short </h2>
            <h2> Under Pressure </h2>
            <div className='graphic' id='graphic6'>
              <div className="viz" id="viz6">
                {pressure}
              </div>
              <div className='sections' id='sections6'>

                <section className="step">
                  <p className="prose">win-loss </p>
                </section>
                <section className="step">
                  <p className="prose">3 set win-loss </p>
                </section>
                <section className="step">
                  <p className="prose">tiebreak </p>
                </section>
                <section className="step">
                  <p className="prose">downaset</p>
                </section>

              </div>

            </div>
            <h2> Serena's Rivals </h2>
            <p className="prose">While the men's tour has been dominated by the Big 4 for the last decade, the
              women's tour does not have an equivalent cohort of players. Serena is in a league of her own. Still,
              throughout the years, Serena has had her share of rivals, with her sister Venus being her
              fiercest one all these years.  </p>
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
