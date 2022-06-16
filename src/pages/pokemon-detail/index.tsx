import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getPokemonDetailApi } from '../../commons/api/pokemon.api';
import { getBackgroundColorFromTypeName } from '../../commons/helpers/pokemon';

const PokemonDetailPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  const queryPokemon = useQuery(
    ['pokemon', name],
    () => {
      return getPokemonDetailApi(name);
    },
    {
      initialData: null,
    }
  );

  const { isLoading, isFetching, isError } = queryPokemon;

  const pokemon = queryPokemon.data;

  return (
    <div className="flex flex-col">
      <div></div>
      {(isLoading || isFetching) && <div>Loading</div>}

      {isError && <div>Error</div>}

      {pokemon && (
        <div
          className=""
          style={{
            backgroundColor: getBackgroundColorFromTypeName(
              pokemon.types[0]?.name || 'normal'
            ),
          }}
        ></div>
      )}
    </div>
  );
};

export default PokemonDetailPage;
