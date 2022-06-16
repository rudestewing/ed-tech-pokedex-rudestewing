import hexToRgba from 'hex-to-rgba';
import { POKEMON_TYPE_COLOR } from '../constants/pokemon.constant';

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
