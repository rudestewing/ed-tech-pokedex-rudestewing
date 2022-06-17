import { Popover } from 'antd';
import { Button } from 'antd';
import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { getArtwork } from '../../../commons/helpers/pokemon';
import { TPokemonItem, TPokemonList } from '../../../commons/types';

type TProps = {
  data: TPokemonList;
};

const maxDisplayed = 2;

const FloatingSelectedPokemonToCompare: React.FC<TProps> = ({ data }) => {
  const { push } = useHistory();

  const displayedPokemons = useMemo<TPokemonList>(() => {
    if (data.length > maxDisplayed) {
      return [...data].splice(0, maxDisplayed);
    }
    return data;
  }, [data]);

  const restCount = useMemo<number>(() => {
    const value = data.length - maxDisplayed;
    return value > 0 ? value : 0;
  }, [data]);

  const morePokemons = useMemo<TPokemonList>(() => {
    return restCount > 0 ? [...data].splice(maxDisplayed, data.length - 1) : [];
  }, [restCount, data]);

  const handleCompare = () => {
    const pokemonNames = data.map((pokemon) => pokemon.name).join(',');
    push(`/comparison?pokemonNames=${pokemonNames}`);
  };

  const renderRoundPokemon = (pokemon: TPokemonItem) => {
    return (
      <div className="w-[42px] md:w-[64px] h-[42px] md:h-[64px] rounded-full border border-indigo-500 p-2">
        <img
          src={getArtwork(pokemon.id)}
          alt=""
          className="w-full h-full object-cover content-center"
        />
      </div>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-screen-md mx-auto bg-white p-3 flex justify-between gap-2 m-3 rounded-xl shadow-lg border border-gray-300 items-center">
      <div className="flex gap-2">
        {displayedPokemons.map((pokemon) => {
          return renderRoundPokemon(pokemon);
        })}
        {restCount > 0 && (
          <Popover
            placement="top"
            content={
              <div className="flex flex-wrap gap-2">
                {morePokemons.map((pokemon) => {
                  return renderRoundPokemon(pokemon);
                })}
              </div>
            }
            title="more"
            trigger={['hover']}
          >
            <div className="w-[42px] md:w-[64px] h-[42px] md:h-[64px] rounded-full border border-indigo-500 p-2 flex flex-col justify-center items-center cursor-pointer hover:bg-indigo-500 hover:text-white">
              <div>{restCount}+</div>
            </div>
          </Popover>
        )}
      </div>
      <div>
        <Button type="primary" onClick={handleCompare}>
          Compare
        </Button>
      </div>
    </div>
  );
};

export default FloatingSelectedPokemonToCompare;
