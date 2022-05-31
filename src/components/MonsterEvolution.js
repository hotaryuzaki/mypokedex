import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { FaAngleDoubleRight } from "react-icons/fa";
import '../pokedex.css';

const imagePath = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

function MonsterEvolution(props) {
  const {
  	data,
  } = props;

  console.log('MonsterEvolution', data)

  return (
    data &&
      <div id="Evolution" className="Evolution">
        <h6>Evolution</h6>

        {
          data.map((item, index) => {
            if (item.evolves_from_species_id) {
              return (
                <Container>
                  <Row>
                    <Col xs={4} sm={5} md={5} lg={5}>
                      <img
                        src={`${imagePath}${item.evolves_from_species_id}.png`}
                        className='EvolutionImage'
                        alt='item_image'
                      />
                    </Col>

                    <Col xs={4} sm={2} md={2} lg={2} className='EvolutionLevel'>
                      <p className='EvolutionLevelText'>Level {item.evolutions[0].min_level}+</p>
                      <FaAngleDoubleRight className='EvolutionLevelIcon'/>
                    </Col>

                    <Col xs={4} sm={5} md={5} lg={5}>
                      <img
                        src={`${imagePath}${item.id}.png`}
                        className='EvolutionImage'
                        alt='item_image'
                      />
                    </Col>
                  </Row>
                </Container>
              );
            }
          })
        }

      </div>
  );
}

export default MonsterEvolution;
