import React from 'react';
import PokemonCard from '../../../commons/components/PokemonCard';
import { TPokemonItem, TPokemonList } from '../../../commons/types';

type TProps = {
  data: TPokemonList;
  isSelectToCompare: boolean;
  onClickPokemon: (pokemon: TPokemonItem) => void;
  selectedPokemonIds: number[];
};

const PokemonList: React.FC<TProps> = ({
  data,
  isSelectToCompare,
  onClickPokemon,
  selectedPokemonIds,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {data.map((pokemon: TPokemonItem) => {
        return (
          <span
            key={pokemon.id}
            onClick={() => onClickPokemon(pokemon)}
            className="hover:outline-2 border border-transparent hover:border-blue-600 block rounded-lg cursor-pointer"
          >
            <PokemonCard
              key={pokemon.id}
              data={pokemon}
              selected={selectedPokemonIds.includes(pokemon.id)}
              selectMode={isSelectToCompare}
            />
          </span>
        );
      })}
    </div>
  );
};

export default PokemonList;
