import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { getPokemonsDetailApi } from '../../commons/api/pokemon.api';
import { getValueFromQueryString } from '../../commons/helpers';

const ComparisonPage: React.FC = () => {
  const { search } = useLocation();
  const valueFromQueryString = getValueFromQueryString(
    ['pokemonNames'],
    search
  );

  console.log('valueFromQueryString', valueFromQueryString);

  const pokemonNames = useMemo<string[]>(() => {
    const { pokemonNames } = valueFromQueryString;
    return pokemonNames ? pokemonNames.split(',') : [];
  }, [valueFromQueryString]);

  const queryPokemons = useQuery(
    ['pokemons', ...pokemonNames],
    () => {
      return getPokemonsDetailApi(pokemonNames);
    },
    {
      initialData: [],
    }
  );

  console.log('queryPokemons', queryPokemons.data);

  return (
    <div>
      <div>comparison page</div>
    </div>
  );
};
export default ComparisonPage;
