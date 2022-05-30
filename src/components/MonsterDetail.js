import React, { useRef, useState } from 'react';
import '../pokedex.css';

const imagePath = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

function MonsterDetail(props) {
  const {
  	data,
  } = props;

  const openTab = (evt, tabName) => {
    var i, DetailContent, DetailTab;

    DetailContent = document.getElementsByClassName("DetailContent");
    for (i = 0; i < DetailContent.length; i++) {
      DetailContent[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";

    DetailTab = document.getElementsByClassName("DetailTab");
    for (i = 0; i < DetailTab.length; i++) {
      DetailTab[i].className = DetailTab[i].className.replace(" active", "");
    }
    evt.currentTarget.className += " active";
  }

  return (
    data &&
      <div className='Detail'>
        <div className='DetailTabs'>
          <button className="DetailTab active" onClick={(event) => openTab(event, 'About')}>About</button>
          <button className="DetailTab" onClick={(event) => openTab(event, 'BaseStats')}>Base Stats</button>
        </div>
          
        <div id="About" className='DetailContent default'>
          <p className='DetailText'>{data[0].description[0].flavor_text}</p>
        </div>
    
        <div id="BaseStats" className='DetailContent'>
          <p className='DetailText'>Paris is the capital of France.</p>
        </div>
      </div>
  );
}

export default MonsterDetail;
