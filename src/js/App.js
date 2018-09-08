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
import * as _ from 'lodash';
import * as $ from 'jquery';
import ReactGA from 'react-ga';
import dremiologo from '../images/dremiologo.svg';


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

    ReactGA.initialize('UA-92535580-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
    this.titlesRef = React.createRef();

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
    window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
		const mobile = window.mobilecheck()
    if (mobile) {
      $('.onhover-toggle-child-class').on(
        'touchstart',
        function() {
          var element = $(this);
          var selector = element.data('target');
          var child = element.find(selector);
          var classes = element.data('toggle');


          child.toggleClass(classes);
        }
      );
      $('.onhover-toggle-child-class').on(
        'touchend',
        function() {
          var element = $(this);
          var selector = element.data('target');
          var child = element.find(selector);
          var classes = element.data('toggle');


          child.toggleClass(classes);
        }
      );
    } else {
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
    }
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
    d['percent_returnpt_won'] = +d['percent_returnpt_won']
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
    d['slamdate'] = d['date'] === "" ? `${monthDict[d['slam']]}, ${d['year']}` : d['date']
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
             <p className="prose"> Serena has had a long, one-sided rivalry with Maria Sharapova, but in recent years it has translated somewhat of a <a href="https://www.vox.com/culture/2017/9/15/16297562/maria-sharapova-feud-serena-williams-explained">feud</a> off the court. 
             On the court, however, Serena has had the last word, winning 18 consecutive matches.</p>
            <Rivalry data={mariadata} annotations={mariaannotation} margin={{top:25, bottom: 25, right: 25, left: 25}} />
            </div>
      servestats = <div className="serveStatsGraphic"><ServeBreak data={servedata} /></div>
      servedirection = <ServeDirection data={servedirectiondata} />
      input = <Input data={serenamatches} />
      goat = <No1Weeks rankingdata={weeksat1} slamdata={slamdata}/>
      pressure = <UnderPressure data={underpressure} />
      servegraphic = <ServeGraphic data={servespeed}/>

    }
    const serveTemplate = _.range(1,30).map((i) =>
    <section className="smallerstep" key={i}>
      <p className="prose"></p>
    </section>)

    return (
      <div className="wrapper">
        <div className="content">
          <div className="header">
             <a href="https://www.dremio.com/" target="_blank" rel="noopener noreferrer" className="logo"> <img src={dremiologo} height="40" alt="dremio-logo"/></a>
            <div className="background-container">

            </div>
            <div className="title-container">
              <div className="title">
                Serena The Great
              </div>
              <div className="subhed">
                A visual story of the most dominant player in tennis
              </div>
            </div>

          </div>
          <div className="body">
              <RankingLine />
                <p className="prose">In the trailer for HBO's <i>Being Serena</i> documentary, in a voiceover, Serena
                  says, "I don't know if there's anything left for me in tennis," followed by a pregnant pause. "But I'm not done yet,"
                  she declares, and we can sense she's still hungry for more.
                </p>
                <p className="prose">
                  Plenty of critics have tried to diminish her legacy, including John McEnroe, who suggested,
                   "If she played the men's circuit she'd be like 700 in the world." But the record books speak for themselves.
                 </p>
                 <p className="prose">

                    <a className="mousehover relative onhover-toggle-child-class" data-target=".target" data-toggle="hidden shown">"Are you looking at my titles?"
                     <span className="absolute target hidden on-top">
                       <img className="mytitles" src={images['titles.jpg']} alt="title" height="200" ref={this.titlesRef}></img>
                     </span>
                   </a> reads a shirt she wore during a press conference at Wimbledon in 2009. She has won 23 Grand Slam titles, more than any man or woman
                     in the Open Era, and she was eight weeks pregnant for her 23rd. She has nothing left to prove. Yet she's back,
                     and when she steps out onto the court, we have every reason to believe she can still win again, and again, and again.

                  </p>


              <div className='graphic' id='graphic1'>
                <div className="viz" id="viz1">
                  <Map />
                </div>
                <div className='sections' id='sections1'>

                  <section className="step">
                    <p className="prose light">Serena's story starts before she and older sister Venus were even born.
                   Their father, the inimitable Richard Williams, had already had conceived a vision for his future
                   daughters. It was in 1980--after seeing
                    Romanian tennis player Virginia Ruzici collecting a $40,000 check for winning a small tournament
                    in Salt Lake City on TV--that he decided that his not-yet-existent daughters would be tennis stars.
                 </p>
                 <p className="prose light">He started to take tennis lessons from a man who went by Old Whiskey, lessons
                   he paid for with booze. He then drafted a 78-page plan, a manifesto of sorts, on how he was going to make
                   his daughters champions. In 1990, when Venus was just 10 years old, he predicted that she was going to be No. 1
                   in the world, and that Serena, then 9, would be even better than Venus. When film producer Arnon Milchan met
                   Richard late in 1997, he said, "You know when you meet somebody, and you think he's either insane or he's a genius?"
                   Looking back, history has judged him the latter, and his wild proclamations seem almost prophetic today. </p>
                  </section>
                  <section className="step">
                    <p className="prose light">Serena was born in Saginaw, Michigan on September 26, 1981, a little over a year after Venus was born. </p>
                  </section>
                  <section className="step">
                    <p className="prose light">Shortly after, the family, including their three older sisters, relocated to Compton, California.
                    Their journey began on the rough public tennis courts of East Compton Park, where they once had to stop practice
                    to duck for cover when they heard gunshots. With weeds poking through the ground and broken glass and beer bottles strewn about,
                    the courts were a far cry from the manicured lawns of Centre Court at Wimbledon.
                  </p>
                    <p className="prose light">
                    Yet Compton "would make them tough, give them a fighter's mentality," Richard wrote
                    in his autobiography. "And how much easier would it be to play in front of thousands of
                    white people if they had already learned to play in front of scores of armed gang members?"


                  </p>
                  </section>
                  <section className="step">
                    <p className="prose light">When Serena turned 9, the family moved to West Palm Beach, FL
                      to train at Rick Macci's tennis academy. Macci and Richard sometimes clashed, and in 1995,
                      he pulled his daughters out of the academy, coaching them himself. He also took them out
                      of the junior circuit, citing the intensity of the other parents and how time-consuming it was.
                    </p>
                    {/*<p className="prose dark">
                      More important than tennis, Richard wanted his daughters to receive and education and develop
                      interests off the court as well. "When I look at young players on the tennis tour, it seems
                      the better they are, the less education they have," he said. With the time they would have used
                      preparing for junior tournaments, they attended private school and participated in other activities.
                      Through careful planning by Richard and mom Oracene, Serena and Venus have balanced their time on and off
                      the court, and a result, they've avoided burnout and lasted on the tour well into their 30s,
                      long after most players retire. </p>*/}
                  </section>
                  <section className="step">
                    <p className="prose light">On October 28, 1995, Serena played her very first pro match for a qualifying round
                      at the Bell Challenge in Quebec against American Annie Miller. Serena lost, 1-6, 1-6.
                    </p>
                    <p className="prose light">
                      Asked to comment on the match years later, Miller said, smiling, "In my mind I had every shot of winning the match [because I had]
                      a little more experience than she had at the time, so I played a good match, and won. I thought it was just another
                      day at the tennis courts." Few could have predicted that Serena would grow into the champion that she has become.
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
              <p className="prose">"The largest disparity found by Kibler between male and female professionals was in pushing off with their back legs,
                which 75 percent of the men in the study did effectively compared with only 28 percent of the women," a NY Times story found.
              </p>
              <p className="prose">
              In the following graphic, as you scroll, you can see how Serena torques and drills her lower body
              into the ground before pushing off for her serve, generating power not just from racquet head speed
              but more importantly, her legs, like a loaded spring.
             </p>
              <div className='graphic' id='graphic3'>
                <div className="viz" id="viz3">
                  <ServeAnimation />
                </div>
                <div className='sections' id='sections3'>

                  {serveTemplate}
                </div>

              </div>
              <h2> Serve Speed </h2>
              <p className="prose"> Serena has one of the consistently fastest serves on tour. Here's how her fastest serve stacks up against 
              the fastest serves ever recorded by women, and her average first and second serves against the that of the average WTA player.
              </p>
              <div className='graphic' id='graphic2'>
                <div className="viz" id="viz2">

                  {servegraphic}
                </div>
                <div className='sections' id='sections2'>

                  <section className="step">
                    <p className="prose"></p>
                  </section>
                  <section className="step">
                    <p className="prose dark">Serena hit the 3rd fastest serve ever at the 2013 Australian Open, and she's 
                    joined by sister Venus, Lisicki, and Görges, and McCarthy to round out the top 5 fastest serves. </p>
                  </section>
                  <section className="step">
                    <p className="prose dark">Here are the average first and second serve speeds of Serena
                    versus the average WTA player. She has about 10 miles per hour on the average WTA player on both serves. </p>
                  </section>
                  <section className="step">
                  </section>
                </div>

              </div>
              <h2> Serve Direction </h2>
              <p className="prose">Yet serve speed doesn't tell the whole story. Plenty of players serve fast,
                but they aren't nearly as successful as Serena is on serve. One difference is that Serena hits
                her spots.</p>
              <div className='graphic' id='graphic4'>
                <div className="viz" id="viz4">
                  {servedirection}
                </div>
                <div className='sections' id='sections4'>
                  <section className="step">
                  </section>
                  <section className="step">
                    <p className="prose light">On first serves, Serena rarely serves in the middle of the box, hitting the vast majority
                       out wide or up the T. With speed combined with placement, many of her first serves are unreturnable. On any given serve,
                     her likelihood of hitting an ace is 13%, a rate three times higher than the average WTA player.  </p>
                  </section>
                  <section className="step">
                    <p className="prose light">The average WTA player serves down the middle three times as often as Serena does, making it easier to return. </p>
                  </section>
                  {/*<section className="step">
                    <p className="prose dark">She prefers to hit her second serve with topspin and toward her opponent's body.</p>
                  </section>
                  <section className="step">
                    <p className="prose dark">The average WTA player also hits 2nd serves down the middle to minimize double faults.</p>
                  </section>*/}

                </div>

              </div>


              <p className="prose">Serena's serve allows her to get ahead during rallies, end points quickly,
                and wipe away break points easily when she's down. When it's on, no one can break her serve.
                 It has been the key to her success.</p>
              <h2> Dominating on Serve and Return </h2>
              <p className="prose"> Serena wins the highest percentage of points on serve by a large margin, and she's
                not far behind leader Justine Henin on return. She can punish opponents with weak serves by 
                hitting winners on serves that sit up for her to pummel back. This along with her serve are 
                cornerstones of her power game, a playstyle that she and would Venus popularize, and what tennis 
                commentator Mary Carillo has affectionately dubbed "Big Babe Tennis."
              </p>
                {/*<p className="prose">
              When the sisters debuted on the tour, the no. 1 player at the time was Martina Hingis.
                With a game based on touch and guile, for a period, Hingis was invincible. But it was short-lived.
               She was was simply overpowered by the Williams sisters and the players they would later influence,
               unable to handle the pace of her bigger and taller opponents.
             </p>*/}
              {servestats}
              <h2> Serena's Rivals </h2>
              <p className="prose">While the Big 4 (Federer, Nadal, Djokovic, and Murray) has dominated the men's tour 
               for the last decade, the women's tour has not had quite an equivalent cohort of players. Although several players have taken
                the No. 1 spot (some even without a grand slam), they've come and gone. For most of her career,
                Serena has been a league of her own. Still, throughout the years, she has had her share of rivals,
                with Venus being her fiercest one for all these years.  </p>
              <p className="prose"><span style={{color: "#91ceff"}}>Hard court</span> matches are in blue, <span style={{color: "#f28b02"}}>clay</span> in orange, 
              and <span style={{color: "#4ec291"}}>grass</span> in green.
               Grand slam matches are <span style={{textDecoration: "underline"}}>outlined</span>.</p>

              {rivalries}
              <h2> Search for a Head-to-Head </h2>

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

                    <p className="prose dark">But get this: Serena is the only player with a positive record when <i>down</i> the first set.
                    More than half the time she loses the first set, she comes back to win the match.</p>
                  </section>

                </div>

              </div>

              <h2> Serena's Longevity </h2>
              <p className="prose">
                Much of Serena's greatness can be attributed to her longevity. Other than Venus, she's simply been around longer
                than anyone else on tour. While many of her rivals retired early and made short-lived comebacks (read: Hingis, Clijsters, Henin),
                Serena has stuck around, outlasting her contemporary rivals and surpassing past tennis legends in the process.
              </p>
              <p className="prose">
                On the men's tour, Roger Federer seemed like he was on the decline when he went slamless for four years,
                but over the past year and half, he's been in the middle of a late-career renaissance, winning the Australian Open
                and Wimbledon last year. Like Serena, he's avoided injury and burnout by choosing tournaments carefully
                and prioritizing the slams, a strategy that has allowed them to be successful well into their 30s.
              </p>
              <p className="prose">
                Some critics have said that Serena isn't the greatest of all time because she hasn't had a worthy rival
                like Nadal is to Federer, Evert was to Navratilova, or Seles was to Graf. But she's simply been better
                than everyone else, and no one has stood up to take her place for all these years.
              </p>
              <p className="prose">
                <span style={{color: "#a9a9a9"}}>Retired</span> players are in grey, currently <span style={{color: "#ff8a4f"}}>active</span> players in orange, and <span style={{color: "#5171bc"}}>Serena</span> in blue.
              </p>
              <div className='graphic' id='graphic5'>
                <div className="viz" id="viz5">
                  {goat}
                </div>
                <div className='sections' id='sections5'>

                  <section className="step">
                    <p className="prose dark">When comparing total weeks at no. 1, Serena is behind Graf and Navratilova at 319 weeks,
                    but her run between 2013-2016 ties Graf's record of 186 <i>consecutive</i> weeks at no. 1.  </p>
                  </section>
                  <section className="step">
                    <p className="prose dark">But this run of 186 weeks started when she was nearly 32, the oldest a no. 1 player has been to date.
                    While other players retire or begin to decline before 30, Serena was experiencing a second wind in her career.</p>
                  </section>
                  <section className="step">
                    <p className="prose dark">When counting total grand slams, Serena has 23, the most of anyone in the Open Era. Only Margaret
                      Court has won more, winning 11 in the Open Era and 24 in total. On coming back to tennis, Serena has said, "I absolutely want more
                    grand slams. I'm well aware of the record books, unfortunately. It's not a secret that I have my sights on 25."
                  </p>
                  </section>
                  <section className="step">
                    <p className="prose dark">Navratilova won her last grand slam title when she won Wimbledon at 33, and
                      Flavia Pennetta won her first and last slam at the U.S. Open at 33. Serena won the 2017 Australian Open at 35,
                      and if she wins another slam, she will join Evonne Goolagong and Kim Clijsters as mothers who have won
                    a grand slam title.</p>
                  </section>

                </div>

              </div>
              <p className="prose"> When we think about measuring the greatest of all time, we tend to think in terms of numbers:
                the best win-loss record (Graf), the most weeks at no. 1 (Graf), the most titles (Navratilova). Serena doesn't win
                in any of these categories. Yet her intangible qualities and accomplishments--ones not so easily
                measured or compared--make her one of the greatest athletes of all time. </p>
              <p className="prose"> When I think about Serena, I think of her childhood on the shabby public courts of
                Compton, how her father fed tennis balls to her from a rickety shopping cart. I think about how she and
                Venus transformed the women's game, ushering in the current era of power tennis. I think about her performance
                at the 2007 Australian Open, when she, ranked 81st and unseeded, out of shape, and having dealt with injuries
                and the death of her sister Yetunde, crushed Sharapova in the final to win the title. I think about how she's
                recovered from life-threatening pulmonary embolisms--one in 2010 and another after her pregnancy--and returned to the game
                as strong as ever.
              </p>
                <p className="prose">
                I think about all the times she's been down a set and a break, but found it in herself to come back. I think about
                the way she roars "Come on!" with fists pumped, willing herself to win. I think about how, unlike Federer who
                makes it look easy, she makes tennis look effortful, the way she runs down every ball, fights for every point,
                and claws her way back into a match.
              </p>
              <p className="prose">
                Coming back from giving birth to her daughter may be the toughest hurdle in her career yet.
                But if anyone is up to the challenge, it's Serena.
              </p>

              <div className="credits">
                <h2> Credits and Methodology </h2>
                <p className="prose">
                  Analysis done in <a href="https://www.dremio.com/">Dremio</a> and Python. Created using d3.js and <a href="https://github.com/facebook/create-react-app">create-react-app</a>.
                  Cover photo image credit goes to Getty Images. Data is from Wikipedia and Jeff Sackmann's <a href="https://github.com/JeffSackmann/tennis_wta">database</a>. Design inspiration from Swiss
                  Info's <a href="https://interactive.swissinfo.ch/2018_01_28_federer20/en.html">20 Years, 20 Titles</a>.
                  The <a href="https://bl.ocks.org/russellgoldenberg/aba5f81a8bd0633a399d692289ab97eb">weighted pivot scatter
                  plot</a> is based on Russell Goldenberg's chart.
                </p>
              </div>
          </div>

        </div>
      </div>
    );
  }
}

export default App;
