import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
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

          <Container>
            <Row>
              <Col xs={3} sm={3} md={3} lg={3} style={{ paddingLeft: 0, paddingRight: 0 }}>
                <p className='DetailText'>Height</p>
              </Col>

              <Col xs={9} sm={9} md={9} lg={9} style={{ paddingLeft: 0, paddingRight: 0 }}>
                <p className='DetailText'>: {data[0].pokemons[0].height}</p>
              </Col>
            </Row>

            <Row>
              <Col xs={3} sm={3} md={3} lg={3} style={{ paddingLeft: 0, paddingRight: 0 }}>
                <p className='DetailText'>Weight</p>
              </Col>

              <Col xs={9} sm={9} md={9} lg={9} style={{ paddingLeft: 0, paddingRight: 0 }}>
                <p className='DetailText'>: {data[0].pokemons[0].weight}</p>
              </Col>
            </Row>

            <Row>
              <Col xs={3} sm={3} md={3} lg={3} style={{ paddingLeft: 0, paddingRight: 0 }}>
                <p className='DetailText'>Abilities</p>
              </Col>

              <Col xs={9} sm={9} md={9} lg={9} style={{ paddingLeft: 0, paddingRight: 0 }}>
                <p className='DetailText'>
                  :&nbsp;
                  {
                    data[0].pokemons[0].abilities.map((item, index) => {
                      const text =
                        data[0].pokemons[0].abilities.length === index + 1
                          ? item.ability.name
                          : item.ability.name + ', ';

                      return text;
                    })
                  }
                </p>
              </Col>
            </Row>
          </Container>
        </div>
    
        <div id="BaseStats" className='DetailContent'>
          {
            data[0].pokemons[0].stats.map((item, index) => (
              <div key={index}>
                <label className='StatsLabel'>{item.stat.name}</label>

                <div className="StatsBar progress">
                  <div
                    className="StatsChart progress-bar"
                    style={{ width: `${item.base_stat}%`}}
                    role="progressbar"
                    aria-valuenow={item.base_stat}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {item.base_stat}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
  );
}

export default MonsterDetail;
