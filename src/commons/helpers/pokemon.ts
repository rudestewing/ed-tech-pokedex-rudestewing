import hexToRgba from 'hex-to-rgba';
import { POKEMON_TYPE_COLOR } from '../constants/pokemon.constant';
import { TPokemonDetail, TSpecies } from '../types';

export const getColorFromTypeName = (typeName: string): string => {
  return typeName in POKEMON_TYPE_COLOR
    ? POKEMON_TYPE_COLOR[typeName]
    : POKEMON_TYPE_COLOR['unknown'];
};

export const getBackgroundColorFromTypeName = (typeName: string) => {
  return hexToRgba(getColorFromTypeName(typeName), 0.3);
};

export const getBackgroundFromTypeNames = (typeNames: string[]) => {
  const increments: number = Math.round(100 / typeNames.length);

  const gradients: string[] = [];
  let counter = 0;
  typeNames.forEach((typeName: string, index: number) => {
    gradients.push(
      `${getBackgroundColorFromTypeName(typeName)} ${index + counter}%`
    );
    counter += increments;
  });
  return `linear-gradient(0, ${gradients.join(',')})`;
};

export const getArtwork = (id: number) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

export const getIDNumber = (id: number): string => {
  return String(id).padStart(3, '0');
};

export const parsePokemon = (apiDataPokemon: any): TPokemonDetail => {
  return {
    id: apiDataPokemon.id,
    name: apiDataPokemon.name,
    height: apiDataPokemon.height,
    weight: apiDataPokemon.weight,
    types: apiDataPokemon.types.map(({ type }: any) => ({
      id: type.id,
      name: type.name,
    })),
    stats: apiDataPokemon.stats.map(({ baseStat, stat }: any) => ({
      name: stat.statName[0]?.name || stat.name || '',
      baseStat: baseStat,
    })),
    abilities: apiDataPokemon.abilities.map(({ ability }: any) => ({
      name: ability.name,
      shortEffect: ability.abilityText[0]?.shortEffect || '',
    })),
  };
};

export const parseSpecies = (apiDataSpecies: any): TSpecies => {
  const { id, name, flavorText, evolutions, pokemons } = apiDataSpecies;
  return {
    id,
    name,
    shortDescription: flavorText[0]?.flavorText || '',
    evolutions: evolutions.species.map(({ id, name, pokemons }: any) => ({
      id,
      name,
      types: pokemons[0]
        ? pokemons[0].types.map(({ type }: any) => ({
            id: type.id,
            name: type.name,
          }))
        : [],
    })),
    pokemons: pokemons.map((apiDataPokemon: any) =>
      parsePokemon(apiDataPokemon)
    ),
  };
};
