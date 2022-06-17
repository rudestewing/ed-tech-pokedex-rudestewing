export type TObject = {
  [key: string]: any;
};

export type TPokemonType = {
  id: number;
  name: string;
};

export type TGeneration = {
  id: number;
  name: string;
  label: string;
};

export type TPokemonItem = {
  id: number;
  name: string;
  types: TPokemonType[];
};

export type TPokemonList = TPokemonItem[];

export type TStat = {
  name: string;
  baseStat: number;
};

export type TStats = TStat[];

export type TAbility = {
  name: string;
  shortEffect: string;
};

export type TAbilities = TAbility[];

export type TEvolutions = TPokemonItem[];

export type TPokemonDetail = TPokemonItem & {
  height: number;
  weight: number;
  stats: TStats;
  abilities: TAbilities;
};

export type TSpecies = {
  id: string;
  name: string;
  evolutions: TEvolutions;
  shortDescription: string;
  pokemons: TPokemonDetail[];
};
