const filterTypes = [
  { name: 'bug', value: false },
  { name: 'dragon', value: false },
  { name: 'fairy', value: false },
  { name: 'fire', value: false },
  { name: 'ghost', value: false },
  { name: 'ground', value: false },
  { name: 'normal', value: false },
  { name: 'psychic', value: false },
  { name: 'steel', value: false },
  { name: 'dark', value: false },
  { name: 'electric', value: false },
  { name: 'fighting', value: false },
  { name: 'flying', value: false },
  { name: 'grass', value: false },
  { name: 'ice', value: false },
  { name: 'poison', value: false },
  { name: 'rock', value: false },
  { name: 'water', value: false }
];

const filterGen = [
  { name: 'I', query: 'generation-i', value: false },
  { name: 'II', query: 'generation-ii', value: false },
  { name: 'III', query: 'generation-iii', value: false },
  { name: 'IV', query: 'generation-iv', value: false },
  { name: 'V', query: 'generation-v', value: false },
  { name: 'VI', query: 'generation-vi', value: false },
  { name: 'VII', query: 'generation-vii', value: false },
  { name: 'VIII', query: 'generation-viii', value: false }
];

export default {
  filterTypes,
  filterGen
}
