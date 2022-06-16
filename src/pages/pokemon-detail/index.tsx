import { Button, Tabs } from 'antd';
import React from 'react';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { getPokemonDetailApi } from '../../commons/api/pokemon.api';
import BadgeType from '../../commons/components/BadgeType';
import { capitalizeFirstLetter } from '../../commons/helpers';
import {
  getArtwork,
  getBackgroundColorFromTypeName,
  getIDNumber,
} from '../../commons/helpers/pokemon';

const PokemonDetailPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { goBack } = useHistory();

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

  console.log('pokemon', pokemon);

  return (
    <div className="min-h-screen">
      <div className="fixed py-2">
        <Button type="default" onClick={() => goBack()}>
          Back
        </Button>
      </div>

      {(isLoading || isFetching) && <div>Loading</div>}

      {isError && <div>Error</div>}

      {pokemon && (
        <div
          className="min-h-screen flex flex-col gap-4 px-3"
          style={{
            backgroundColor: pokemon
              ? getBackgroundColorFromTypeName(
                  pokemon.types[0]?.name || 'normal'
                )
              : 'transparent',
          }}
        >
          <div className="flex flex-col gap-2 items-center">
            <div className="w-[280px] md:w-[320px] h-[280px] md:h-[320px] p-5">
              <img
                src={getArtwork(pokemon.id)}
                alt=""
                className="object-cover object-center w-full h-full"
              />
            </div>
            <div className="text-2xl text-gray-600 font-bold">
              #{getIDNumber(pokemon.id)}
            </div>
            <div className="text-2xl text-gray-800 font-bold tracking-wider">
              {capitalizeFirstLetter(pokemon.name)}
            </div>
            <div className="flex flex-wrap gap-3">
              {pokemon.types.map((type) => (
                <BadgeType name={type.name} key={type.id} />
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-white p-3">
            <Tabs />
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonDetailPage;
