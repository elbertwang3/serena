import React, {Component}  from 'react';
import '../../css/App.css';
import PlayerRow from './PlayerRow';

export default class Bracket extends Component {


  render() {
  	if (this.props.data != null) {

  		const {winner_seed, loser_seed, winner_name, loser_name, winner_ioc, loser_ioc, score} = this.props.data
      const {border} = this.props
  		if (score !== 'w/o' && score !== 'DEF') {
        const splitScore = score.split(" ")
    		return <div className="bracket"><PlayerRow border={border} top={false} seed={winner_seed} name={winner_name} ioc={winner_ioc} score1={splitScore[0].split("-")[0]} score2={splitScore[1].split("-")[0]} score3={splitScore[2] == null ? '\xa0' : splitScore[2][0]}/>
        <PlayerRow border={border} top={true} seed={loser_seed} name={loser_name} ioc={loser_ioc} score1={splitScore[0].split("-")[1]} score2={splitScore[1].split("-")[1]} score3={splitScore[2] == null ? '\xa0' : splitScore[2].split("-")[1]}/></div>
   	  } else {
        return <div className="bracket"><PlayerRow border={border} top={false} seed={winner_seed} name={winner_name} ioc={winner_ioc} score1={score} score2={'\xa0'} score3={'\xa0'}/>
        <PlayerRow border={border} top={true} seed={loser_seed} name={loser_name} ioc={loser_ioc} score1={'\xa0'} score2={'\xa0'} score3={'\xa0'}/></div>
      }
    }else {
   	 	return <div><PlayerRow />
   	 		<PlayerRow />
   	 	</div>
   	 }
 	}



}
