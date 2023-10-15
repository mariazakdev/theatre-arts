import React from 'react'
import ActorComponent from '../../components/ActorComponent/ActorComponent';
import VotingButtons from '../../components/VotingComponent/VotingButtons';
import SingleVote from '../../components/VotingComponent/SingleVote';
import "./VotingPage.scss";
import CharityIntro from '../../components/Charity/CharityIntro';

export default function VotingPage() {
  return (<section>
    <div className='vote'>
      <div className="vote-top">
        <ActorComponent/>
        <SingleVote />
      </div>   
      <div className="vote-bottom"> 
      <VotingButtons />  
      </div>
    </div>
    <CharityIntro/> 
    </section>
  )
}
