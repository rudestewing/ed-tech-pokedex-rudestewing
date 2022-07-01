import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { getPokemonsDetailApi } from '../../commons/api/pokemon.api';
import BadgeType from '../../commons/components/BadgeType';
import Layout from '../../commons/components/Layout';
import { getValueFromQueryString } from '../../commons/helpers';
import { getArtwork } from '../../commons/helpers/pokemon';
import { TPokemonType, TSpecies, TStat } from '../../commons/types';
import Stats from '../pokemon-detail/components/Stats';

const ComparisonPage: React.FC = () => {
  const { search } = useLocation();
  const valueFromQueryString = getValueFromQueryString(
    ['pokemonNames'],
    search
  );

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

  const { data } = queryPokemons;

  const pokemonLength = useMemo<number>(() => data?.length || 0, [data]);

  const ids = useMemo<number[]>(() => {
    return (data || []).map((pokemon) => pokemon.id);
  }, [data]);

  const types = useMemo<TPokemonType[][]>(() => {
    return (data || []).map((pokemon) => pokemon.pokemons[0].types);
  }, [data]);

  const stats = useMemo<TStat[][]>(() => {
    return (data || []).map((pokemon) => pokemon.pokemons[0].stats);
  }, [data]);

  return (
    <Layout hasBack>
      {data && (
        <div className="overflow-x-auto">
          <div className="flex gap-2 justify-between">
            {data.map((pokemon) => {
              return (
                <div className="w-1/2">
                  <div className="flex justify-center">
                    <div style={{ width: '80%', height: 'auto' }}>
                      <img src={getArtwork(pokemon.id)} alt="" />
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-center">
                    {pokemon.name}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 px-3">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="font-semibold text-left md:text-center mb-2">
                Basic
              </div>
              <div className="flex gap-2">
                {data.map((pokemon) => {
                  return (
                    <div className="w-1/2">
                      <div className="text-gray-500">Height</div>
                      <div>{pokemon.pokemons[0].height}</div>
                      <div className="text-gray-500">Weight</div>
                      <div>{pokemon.pokemons[0].weight}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="font-semibold text-left md:text-center mb-2">
                Abilities
              </div>
              <div className="flex gap-2">
                {data.map((pokemon) => {
                  return (
                    <div className="w-1/2">
                      <div>
                        {pokemon.pokemons[0].abilities.map((ability) => {
                          return <div>{ability.name}</div>;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="font-semibold text-left md:text-center mb-2">
                Stats
              </div>
              <div className="flex gap-2">
                {data.map((pokemon) => {
                  return (
                    <div className="w-1/2">
                      <div>
                        <Stats data={pokemon.pokemons[0].stats} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
export default ComparisonPage;
