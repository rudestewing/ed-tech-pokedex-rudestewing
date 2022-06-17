import { graphQL } from '../helpers/http-request';
import { parseSpecies } from '../helpers/pokemon';
import { TPokemonList, TSpecies } from '../types';

type TFetchPokemonApi = {
  limit: number;
  offset: number;
  filter: {
    typeIds: number[];
    generationIds: number[];
  };
};
export const fetchPokemonsApi = async (
  props: TFetchPokemonApi
): Promise<TPokemonList> => {
  console.log('filter', props.filter);
  try {
    const { limit, offset, filter } = props;

    const query = `
    query {
      species: pokemon_v2_pokemonspecies(
        limit: ${limit},
        offset: ${offset},
        order_by: {id: asc},
        where: {
          pokemon_v2_pokemons: {
            pokemon_v2_pokemontypes: {
              pokemon_v2_type: {
                id: {
                  ${
                    filter.typeIds.length > 0
                      ? `_in: [${filter.typeIds.join(',')}]`
                      : ''
                  }
                }
              }
            }
          },
          pokemon_v2_generation: {
            id: {
              ${
                filter.generationIds.length > 0
                  ? `_in: [${filter.generationIds.join(',')}]`
                  : ''
              }
            }
          }
        }
      ) {
        name
        id
        pokemons: pokemon_v2_pokemons {
          types: pokemon_v2_pokemontypes {
            type: pokemon_v2_type {
              id
              name
            }
          }
        }
      }
    }
    `;

    const response = await graphQL(query);

    const data: TPokemonList = (response.data?.data?.species || []).map(
      (item: any) => {
        const pokemon = item.pokemons[0];
        return {
          id: item.id,
          name: item.name,
          types: pokemon.types.map(({ type }: any) => ({
            id: type.id,
            name: type.name,
          })),
        };
      }
    );

    return Promise.resolve(data);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getPokemonDetailApi = async (
  name: string
): Promise<TSpecies | null> => {
  try {
    // const speciesFake: any = {
    //   name: 'venusaur',
    //   id: 3,
    //   flavorText: [
    //     {
    //       flavorText:
    //         'The plant blooms\nwhen it is\nabsorbing solar\fenergy. It stays\non the move to\nseek sunlight.',
    //     },
    //   ],
    //   pokemons: [
    //     {
    //       name: 'venusaur',
    //       id: 3,
    //       weight: 1000,
    //       height: 20,
    //       abilities: [
    //         {
    //           ability: {
    //             id: 65,
    //             name: 'overgrow',
    //             abilityText: [
    //               {
    //                 id: 130,
    //                 shortEffect:
    //                   'Strengthens grass moves to inflict 1.5× damage at 1/3 max HP or less.',
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           ability: {
    //             id: 34,
    //             name: 'chlorophyll',
    //             abilityText: [
    //               {
    //                 id: 68,
    //                 shortEffect: 'Doubles Speed during strong sunlight.',
    //               },
    //             ],
    //           },
    //         },
    //       ],
    //       stats: [
    //         {
    //           baseStat: 80,
    //           stat: {
    //             name: 'hp',
    //             statName: [
    //               {
    //                 name: 'HP',
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           baseStat: 82,
    //           stat: {
    //             name: 'attack',
    //             statName: [
    //               {
    //                 name: 'Attack',
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           baseStat: 83,
    //           stat: {
    //             name: 'defense',
    //             statName: [
    //               {
    //                 name: 'Defense',
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           baseStat: 100,
    //           stat: {
    //             name: 'special-attack',
    //             statName: [
    //               {
    //                 name: 'Special Attack',
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           baseStat: 100,
    //           stat: {
    //             name: 'special-defense',
    //             statName: [
    //               {
    //                 name: 'Special Defense',
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           baseStat: 80,
    //           stat: {
    //             name: 'speed',
    //             statName: [
    //               {
    //                 name: 'Speed',
    //               },
    //             ],
    //           },
    //         },
    //       ],
    //       types: [
    //         {
    //           type: {
    //             id: 12,
    //             name: 'grass',
    //           },
    //         },
    //         {
    //           type: {
    //             id: 4,
    //             name: 'poison',
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       name: 'venusaur-mega',
    //       id: 10033,
    //       weight: 1555,
    //       height: 24,
    //       abilities: [
    //         {
    //           ability: {
    //             id: 47,
    //             name: 'thick-fat',
    //             abilityText: [
    //               {
    //                 id: 94,
    //                 shortEffect: 'Halves damage from fire and ice moves.',
    //               },
    //             ],
    //           },
    //         },
    //       ],
    //       stats: [
    //         {
    //           baseStat: 80,
    //           stat: {
    //             name: 'hp',
    //             statName: [
    //               {
    //                 name: 'HP',
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           baseStat: 100,
    //           stat: {
    //             name: 'attack',
    //             statName: [
    //               {
    //                 name: 'Attack',
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           baseStat: 123,
    //           stat: {
    //             name: 'defense',
    //             statName: [
    //               {
    //                 name: 'Defense',
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           baseStat: 122,
    //           stat: {
    //             name: 'special-attack',
    //             statName: [
    //               {
    //                 name: 'Special Attack',
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           baseStat: 120,
    //           stat: {
    //             name: 'special-defense',
    //             statName: [
    //               {
    //                 name: 'Special Defense',
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           baseStat: 80,
    //           stat: {
    //             name: 'speed',
    //             statName: [
    //               {
    //                 name: 'Speed',
    //               },
    //             ],
    //           },
    //         },
    //       ],
    //       types: [
    //         {
    //           type: {
    //             id: 12,
    //             name: 'grass',
    //           },
    //         },
    //         {
    //           type: {
    //             id: 4,
    //             name: 'poison',
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       name: 'venusaur-gmax',
    //       id: 10195,
    //       weight: 10000,
    //       height: 240,
    //       abilities: [
    //         {
    //           ability: {
    //             id: 65,
    //             name: 'overgrow',
    //             abilityText: [
    //               {
    //                 id: 130,
    //                 shortEffect:
    //                   'Strengthens grass moves to inflict 1.5× damage at 1/3 max HP or less.',
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           ability: {
    //             id: 34,
    //             name: 'chlorophyll',
    //             abilityText: [
    //               {
    //                 id: 68,
    //                 shortEffect: 'Doubles Speed during strong sunlight.',
    //               },
    //             ],
    //           },
    //         },
    //       ],
    //       stats: [
    //         {
    //           baseStat: 80,
    //           stat: {
    //             name: 'hp',
    //             statName: [
    //               {
    //                 name: 'HP',
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           baseStat: 82,
    //           stat: {
    //             name: 'attack',
    //             statName: [
    //               {
    //                 name: 'Attack',
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           baseStat: 83,
    //           stat: {
    //             name: 'defense',
    //             statName: [
    //               {
    //                 name: 'Defense',
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           baseStat: 100,
    //           stat: {
    //             name: 'special-attack',
    //             statName: [
    //               {
    //                 name: 'Special Attack',
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           baseStat: 100,
    //           stat: {
    //             name: 'special-defense',
    //             statName: [
    //               {
    //                 name: 'Special Defense',
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           baseStat: 80,
    //           stat: {
    //             name: 'speed',
    //             statName: [
    //               {
    //                 name: 'Speed',
    //               },
    //             ],
    //           },
    //         },
    //       ],
    //       types: [
    //         {
    //           type: {
    //             id: 12,
    //             name: 'grass',
    //           },
    //         },
    //         {
    //           type: {
    //             id: 4,
    //             name: 'poison',
    //           },
    //         },
    //       ],
    //     },
    //   ],
    //   evolutions: {
    //     species: [
    //       {
    //         evolvesFromSpeciesId: null,
    //         name: 'bulbasaur',
    //         id: 1,
    //         pokemons: [
    //           {
    //             name: 'bulbasaur',
    //             id: 1,
    //             types: [
    //               {
    //                 type: {
    //                   id: 12,
    //                   name: 'grass',
    //                 },
    //               },
    //               {
    //                 type: {
    //                   id: 4,
    //                   name: 'poison',
    //                 },
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //       {
    //         evolvesFromSpeciesId: 1,
    //         name: 'ivysaur',
    //         id: 2,
    //         pokemons: [
    //           {
    //             name: 'ivysaur',
    //             id: 2,
    //             types: [
    //               {
    //                 type: {
    //                   id: 12,
    //                   name: 'grass',
    //                 },
    //               },
    //               {
    //                 type: {
    //                   id: 4,
    //                   name: 'poison',
    //                 },
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //       {
    //         evolvesFromSpeciesId: 2,
    //         name: 'venusaur',
    //         id: 3,
    //         pokemons: [
    //           {
    //             name: 'venusaur',
    //             id: 3,
    //             types: [
    //               {
    //                 type: {
    //                   id: 12,
    //                   name: 'grass',
    //                 },
    //               },
    //               {
    //                 type: {
    //                   id: 4,
    //                   name: 'poison',
    //                 },
    //               },
    //             ],
    //           },
    //           {
    //             name: 'venusaur-mega',
    //             id: 10033,
    //             types: [
    //               {
    //                 type: {
    //                   id: 12,
    //                   name: 'grass',
    //                 },
    //               },
    //               {
    //                 type: {
    //                   id: 4,
    //                   name: 'poison',
    //                 },
    //               },
    //             ],
    //           },
    //           {
    //             name: 'venusaur-gmax',
    //             id: 10195,
    //             types: [
    //               {
    //                 type: {
    //                   id: 12,
    //                   name: 'grass',
    //                 },
    //               },
    //               {
    //                 type: {
    //                   id: 4,
    //                   name: 'poison',
    //                 },
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // };

    const query = `
    query {
      species: pokemon_v2_pokemonspecies(limit: 1, where: {name: {_eq: "${name}"}}) {
        name
        id
        flavorText: pokemon_v2_pokemonspeciesflavortexts(where: {pokemon_v2_language: {name: {_eq: "en"}}}, limit: 1) {
          flavorText: flavor_text
        }
        pokemons: pokemon_v2_pokemons {
          name
          id
          weight
          height
          abilities: pokemon_v2_pokemonabilities {
            ability: pokemon_v2_ability {
              id
              name
              abilityText: pokemon_v2_abilityeffecttexts(where: {pokemon_v2_language: {name: {_eq: "en"}}}) {
                id
                shortEffect: short_effect
              }
            }
          }
          stats: pokemon_v2_pokemonstats {
            baseStat: base_stat
            stat: pokemon_v2_stat {
              name
              statName: pokemon_v2_statnames(where: {pokemon_v2_language: {name: {_eq: "en"}}}, limit: 1) {
                name
              }
            }
          }
          types:pokemon_v2_pokemontypes {
            type: pokemon_v2_type {
              id
              name
            }
          }
        }
        evolutions: pokemon_v2_evolutionchain {
          species: pokemon_v2_pokemonspecies {
            evolvesFromSpeciesId: evolves_from_species_id
            name
            id
            pokemons: pokemon_v2_pokemons {
              name
              id
              types:pokemon_v2_pokemontypes {
                type: pokemon_v2_type {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
    `;

    const response = await graphQL(query);

    const species = response.data?.data?.species[0] || null;

    if (species) {
      return Promise.resolve(parseSpecies(species));
    } else {
      throw new Error('no pokemon');
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getPokemonsDetailApi = async (
  names: string[]
): Promise<TSpecies[]> => {
  try {
    const query = `
    query {
      species: pokemon_v2_pokemonspecies(where: {name: {_in: [${names.join(
        ','
      )}]}}) {
        name
        id
        flavorText: pokemon_v2_pokemonspeciesflavortexts(where: {pokemon_v2_language: {name: {_eq: "en"}}}, limit: 1) {
          flavorText: flavor_text
        }
        pokemons: pokemon_v2_pokemons {
          name
          id
          weight
          height
          abilities: pokemon_v2_pokemonabilities {
            ability: pokemon_v2_ability {
              id
              name
              abilityText: pokemon_v2_abilityeffecttexts(where: {pokemon_v2_language: {name: {_eq: "en"}}}) {
                id
                shortEffect: short_effect
              }
            }
          }
          stats: pokemon_v2_pokemonstats {
            baseStat: base_stat
            stat: pokemon_v2_stat {
              name
              statName: pokemon_v2_statnames(where: {pokemon_v2_language: {name: {_eq: "en"}}}, limit: 1) {
                name
              }
            }
          }
          types:pokemon_v2_pokemontypes {
            type: pokemon_v2_type {
              id
              name
            }
          }
        }
        evolutions: pokemon_v2_evolutionchain {
          species: pokemon_v2_pokemonspecies {
            evolvesFromSpeciesId: evolves_from_species_id
            name
            id
            pokemons: pokemon_v2_pokemons {
              name
              id
              types:pokemon_v2_pokemontypes {
                type: pokemon_v2_type {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
    `;

    const response = await graphQL(query);

    const data = (response.data?.data?.species || []).map((species: any) =>
      parseSpecies(species)
    );
    return Promise.resolve(data);
  } catch (error: any) {
    return Promise.reject(error);
  }
};
