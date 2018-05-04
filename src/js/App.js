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
             <p className="prose"> Serena has had a long, one-sided rivalry with Maria Sharapova, but in recent years it has translated somewhat of a <a href="https://www.vox.com/culture/2017/9/15/16297562/maria-sharapova-feud-serena-williams-explained">feud</a> off the court. On the court, however, Serena has had the last word, winning the last 18 matches.</p>
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
              A visual story of the most dominant player, male or female, in tennis
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
                  <p className="prose dark">Serena's story starts before she and older sister Venus were even born.
                 Their father, the inimitable Richard Williams, had already had conceived a vision for his future
                 daughters. It was in 1980--after flipping through channels on television when he came across
                  Romanian tennis player Virginia Ruzici, who had won a tournament in Salt Lake City and collected a
                  check for $40,000--that he decided that his not-yet-existent daughters would be tennis stars.
               </p>
               <p className="prose dark">He started to take tennis lessons from a man who went by Old Whiskey, lessons
                 he paid for with booze. He then drafted a 78-page plan, a manifesto of sorts, on how he was going to make
                 his daughters champions. In 1990, when Venus was just 10 years old, he predicted that she was going to be No. 1
                 in the world, and that Serena, then 9, would be even better than Venus. When film producer Arnon Milchan met
                 Richard late in 1997, he said, "You know when you meet somebody, and you think he's either insane or he's a genius?"
                 Looking back, history has judged him the latter, and his wild proclamations seem almost prophetic today. </p>
                </section>
                <section className="step">
                  <p className="prose dark">Serena was born in Saginaw, Michigan on September 26, 1981, a little over a year after Venus was born. </p>
                </section>
                <section className="step">
                  <p className="prose dark">Shortly after, the family, including their three older sisters, relocated to Compton, California.
                  Their journey began on the rough public tennis courts of East Compton Park, where they once had to stop practice
                  to duck for cover when they heard gunshots. With weeds poking through the ground and broken glass and beer bottles strewn about, the courts were a
                  far cry from the manicured lawns of Centre Court at Wimbledon.
                </p>
                  <p className="prose dark">
                  Yet Compton "would make them tough, give them a fighter's mentality," Richard wrote
                  in his autobiography. "And how much easier would it be to play in front of thousands of
                  white people if they had already learned to play in front of scores of armed gang members?"


                </p>
                </section>
                <section className="step">
                  <p className="prose dark">When Serena turned 9, the family moved to West Palm Beach, FL
                    to train at Rick Macci's tennis academy. Macci and Richard sometimes clashed, and in 1995,
                    he pulled his daughters out of the academy, coaching them himself. He also took them out
                    of the junior circuit, citing the intensity of the other parents and how time consuming it was.
                  </p>
                  <p className="prose dark">
                    More important than tennis, Richard wanted his daughters to receive and education and develop
                    interests off the court as well. "When I look at young players on the tennis tour, it seems
                    the better they are, the less education they have," he said. With the time they would have used
                    preparing for junior tournaments, they attended private school and participated in other activities.
                    Through careful planning by Richard and mom Oracene, Serena and Venus have balanced their time on and off
                    the court, and a result, they've avoided burnout and lasted on the tour well into their 30s,
                    long after most players retire. </p>
                </section>
                <section className="step">
                  <p className="prose dark">On October 28, 1995, Serena played her very first pro match for a qualifying round
                    at the Bell Challenge in Quebec against American Annie Miller. Serena lost, 1-6, 1-6.
                  </p>
                  <p className="prose dark">
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
            <h2> Serena's Serve </h2>
            <p className="prose"> While ATP players routinely dominate on serve,
              WTA players don't win their service games nearly as often due to their relatively weaker serves. Some of this discrepancy
              has been attributed to physiological differences, but Dr. Ben Kibler, an orthopedic surgeon, found that it's
              often a technical--not physiological--deficit.
            </p>
            <p className="prose">"The largest disparity found by Kibler between male and
              female professionals was in pushing off with their back legs, which 75 percent of the men in the study
              did effectively compared with only 28 percent of the women," a NY Times story found.

              In the following graphic, you can see how Serena does a deep knee bend before pushing off,
              generating power not just from racquet head speed but more importantly, her legs.
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
                  <p className="prose dark">Serena is consistently one of the WTA tour's fastest servers. </p>
                </section>
                <section className="step">
                  <p className="prose dark">Here are the top 5 fastest serves on the WTA tour </p>
                </section>
                <section className="step">
                  <p className="prose dark">Here are the average first and second serve speeds of Serena
                  and the average WTA player. She has about 10mph on the average WTA player on both serves. </p>
                </section>
                <section className="step">
                </section>
              </div>

            </div>
            <p className="prose">Yet serve speed doesn't tell the whole story. Plenty of players serve fast,
              but they aren't nearly as successful as Serena is on serve. One difference is that Serena hits
              her spots.</p>
            <div className='graphic' id='graphic4'>
              <div className="viz" id="viz4">
                {servedirection}
              </div>
              <div className='sections' id='sections4'>
                <section className="step">
                  <p className="prose dark">On first serves, Serena rarely serves in the middle of the box, hitting the vast majority
                     out wide or up the T. With speed combined with placement, many of her first serves are unreturnable. On any given serve,
                   her likelihood of hitting an ace is <a href="http://www.latimes.com/projects/la-sp-serena-williams-greatest-all-time/">13%</a>, a rate three times higher than the average WTA player.  </p>
                </section>
                <section className="step">
                  <p className="prose dark">The average WTA player serves down the middle three times as often as Serena does, making it easier to return. </p>
                </section>
                <section className="step">
                  <p className="prose dark">She prefers to hit her second serve with topspin and toward her opponent's body.</p>
                </section>
                <section className="step">
                  <p className="prose dark">The average WTA player also hits 2nd serves down the middle to minimize double faults.</p>
                </section>

              </div>

            </div>


            <p className="prose">Serena's serve allows her to get ahead during the rally, end points quickly,
              and wipe away break points easily when she's down. When it's on, no one can break her serve.
               It has been the key to her success.</p>
            <h2> Dominating on Serve and Return </h2>
            <p className="prose"> Serena wins the highest percentage of serve points by a largin margin, and she's
              not far behind leader Justine Henin on return. Punishing opponents with weak serves, she can hit return
              winners on serves that sit up for her to pummel back. This is a cornerstone of her power game,
              a playstyle that she and Venus popularized, and what tennis commentator Mary Carillo has affectionately
              dubbed "Big Babe Tennis."
            </p>
            {servestats}
            <h2> Serena's Rivals </h2>
            <p className="prose">While the men's tour has been dominated by the Big 4 for the last decade, the
              women's tour has not had quite an equivalent cohort of players. Although several players have taken
              the No. 1 spot (some even without a grand slam), they've come and gone. For most of her career,
              Serena has been a league of her own. Still, throughout the years, she has had her share of rivals,
              with Venus being her fiercest one for all these years.  </p>
            <p className="prose"><span style={{color: "#91ceff"}}>Hard court</span> matches are in blue, <span style={{color: "#f28b02"}}>clay</span> in orange, and <span style={{color: "#4ec291"}}>grass</span> in green.</p>

            {rivalries}
            <h3> Search for a Head-to-Head </h3>

            <p className="prose"> After all these years, no one Serena has played more than two matches against has had a winning
              record against her, except for one player--Arantxa Sanchez Vicario. Search for her,
              and other players using the search box. Some other notable rivalries include Victoria Azarenka,
              Jennifer Capriati, Justin Henin, and Elena Dementieva. </p>
            <div className="finder">
              {input}
            </div>
            <h2> Serena Under Pressure </h2>
            <p className="prose"> When Serena is at her best, no player can beat her. In that vein, tennis commentators have often
              said that Serena is her own worst enemy. To win, she simply must overcome herself. Yet she thrives under these moments.
               How Serena digs deep in the third set, during a tiebreak, and when she's down is what makes her a champion.
            </p>
            <div className='graphic' id='graphic6'>
              <div className="viz" id="viz6">
                {pressure}
              </div>
              <div className='sections' id='sections6'>

                <section className="step">
                  <p className="prose dark">When looking at career win-loss records, Serena trails Graf, Evert, and Navratilova in win percentage. </p>
                </section>
                <section className="step">
                  <p className="prose dark">For matches that go to a third-set decider, Serena is also 4th, behind Graf, Evert, and Sharapova,
                    winning nearly three-quarters of them. </p>
                </section>
                <section className="step">
                  <p className="prose dark">In sets that go to a tiebreak (sets tied at 6-6), Serena wins two-thirds of those tiebreakers,
                     narrowly behind Austin and Navratilova. </p>
                </section>
                <section className="step">
                  <p className="prose dark">But get this: Serena is the only player with a positive record when <i>down</i> the first set. Half the time,
                she comes back from a set down to win the match.</p>
                </section>

              </div>

            </div>

            <h2> Serena's Longevity </h2>
            <p className="prose">
            </p>
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
            <p className="prose"> When we think about measuring the greatest of all time, we tend to think in terms of numbers:
              the best win-loss record (Graf), the most weeks at no. 1 (Graf), the most titles (Navratilova). Serena has none of these. Yet she
              possesses something far more intangible--something that can't be easily measured or compared--that makes her
              one of the greatest athletes of all time. </p>
            <p className="prose"> When I think about Serena, I think about her childhood and upbringing fed her tennis balls
              from an old shopping cart. I think about the way she and Venus reshaped
              I think about how she changed the game (power tennis)
              I think about her performance at the 2007 Australian Open,
              when she, ranked 81st and unseeded, out of shape, and having dealt with injuries and the death her sister
              Yetunde, crushed Sharapova in the final to win the title.
              pulmonary embolism
              I think about all the times she's down a set and a break, but finds it in herself to come back. I think about
              the way she roars "Come on!" with fists pumped, willing herself to win. I think about how, over 20 years into
              her career, she is still playing the best tennis of her life. I think about how, unlike Federer who
              makes tennis look easy, Serena makes it look effortful, the way she runs down every ball, fights for every point,
              and claws her way into a match. And I think about all of the great victories
            </p>
            <p className="prose">
              She embodies an athlete.
              We are there with her through every up and down.

              Coming back from her pregnancy may be the toughest hurdle in her career yet, mentally and physically.
              But if anyone is up to the challenge, its Serena.
              all of the times

              2007 Australian Open


              high-profile female athlete

              It doesn't matterSerena is the greatest because she embodies an athlete
              mentally physically

              deep lows in her career
              redefining athlete
              we tend to think of athletes as male,

              yet serena possesses more intangible characteristics
              under pressure, longevity, overcoming adversity, changing the game
              redefine the face of the sport
              unlikely
            </p>

            <div className="credits">
              <h3> Credits and Methodology </h3>
              <p className="creditsp">
                Analysis done in <a href="https://www.dremio.com/">Dremio</a> and Python. Created using d3.js and <a href="https://github.com/facebook/create-react-app">create-react-app</a>.
                Cover photo image credits go to Getty Images. Data is from Wikipedia and Jeff Sackmann's <a href="https://github.com/JeffSackmann/tennis_wta">database</a>. Design inspiration from Swiss
                Info's <a href="https://interactive.swissinfo.ch/2018_01_28_federer20/en.html">20 Years, 20 Titles</a>.
                The <a href="https://bl.ocks.org/russellgoldenberg/aba5f81a8bd0633a399d692289ab97eb">weighted pivot scatter
                plot</a> is based on Russell Goldenberg's chart. Analysis using
              </p>
            </div>
        </div>

      </div>
    );
  }
}

export default App;
