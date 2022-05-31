import React from 'react';
import '../pokedex.css';

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
          {
            data[0].pokemons[0].stats.map((item, index) => (
              <div key={index}>
                <label className='StatsLabel'>{item.stat.name}</label>
                <div className="StatsBar progress">
                  <div className="StatsChart progress-bar" style={{ width: 100}} role="progressbar" aria-valuenow={item.base_stat} aria-valuemin="0" aria-valuemax="10">{item.base_stat}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
  );
}

export default MonsterDetail;
