import React from 'react';
import { Container, Col, Row, ProgressBar } from 'react-bootstrap';
import '../pokedex.css';

const imagePath = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

function MonsterCompareStats(props) {
  const {
  	data,
    position
  } = props;

  // RENDER
  return (
    <div className='CompareBox'>
      <div className={`CompareBasic ${data.pokemons[0].types[0].type.name} ${position}`}>
        <h6>Basic</h6>

        <Container>
          <Row>
            <Col xs={3} sm={3} md={3} lg={3} style={{ paddingLeft: 0, paddingRight: 0 }}>
              <p className='DetailText'>Height</p>
            </Col>

            <Col xs={9} sm={9} md={9} lg={9} style={{ paddingLeft: 0, paddingRight: 0 }}>
              <p className='DetailText'>: {data.pokemons[0].height}</p>
            </Col>
          </Row>

          <Row>
            <Col xs={3} sm={3} md={3} lg={3} style={{ paddingLeft: 0, paddingRight: 0 }}>
              <p className='DetailText'>Weight</p>
            </Col>

            <Col xs={9} sm={9} md={9} lg={9} style={{ paddingLeft: 0, paddingRight: 0 }}>
              <p className='DetailText'>: {data.pokemons[0].weight}</p>
            </Col>
          </Row>
        </Container>
      </div>

      <div className={`CompareStats ${data.pokemons[0].types[0].type.name} ${position}`}>
        <h6>Stats</h6>

          {
            data.pokemons[0].stats.map((item, index) => (
              <div key={index}>
                <label className={`StatsLabel-right`}>{item.stat.name}</label>

                <div className={`StatsBar-right progress`}>
                  <div
                    className="StatsChart progress-bar"
                    style={{ width: `${item.base_stat/255*100}%` }}
                    role="progressbar"
                    aria-valuenow={item.base_stat/255*100}
                    aria-valuemin="0"
                    aria-valuemax="255"
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

const areEqual = (prevProps, nextProps) => {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  if (prevProps.data.id !== nextProps.data.id) {
    return false;
  }

  return true;
}

export default React.memo(MonsterCompareStats, areEqual);
  