import { graphQL } from '../helpers/http-request';
import { TPokemonDetail, TPokemonList } from '../types';

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
): Promise<TPokemonDetail | null> => {
  try {
    const fakePokemonDetail = {
      id: 1,
      name: 'bulbasaur',
      shortDescription:
        'A strange seed was\nplanted on its\nback at birth.\fThe plant sprouts\nand grows with\nthis POKéMON.',
      height: 7,
      weight: 69,
      types: [
        {
          id: 12,
          name: 'grass',
        },
        {
          id: 4,
          name: 'poison',
        },
      ],
      stats: [
        {
          name: 'hp',
          baseStat: 45,
        },
        {
          name: 'attack',
          baseStat: 49,
        },
        {
          name: 'defense',
          baseStat: 49,
        },
        {
          name: 'special-attack',
          baseStat: 65,
        },
        {
          name: 'special-defense',
          baseStat: 65,
        },
        {
          name: 'speed',
          baseStat: 45,
        },
      ],
      abilities: [
        {
          name: 'overgrow',
          shortEffect:
            'Strengthens grass moves to inflict 1.5× damage at 1/3 max HP or less.',
        },
        {
          name: 'chlorophyll',
          shortEffect: 'Doubles Speed during strong sunlight.',
        },
      ],
      evolutions: [
        {
          id: 1,
          name: 'bulbasaur',
          types: [
            {
              id: 12,
              name: 'grass',
            },
            {
              id: 4,
              name: 'poison',
            },
          ],
        },
        {
          id: 2,
          name: 'ivysaur',
          types: [
            {
              id: 12,
              name: 'grass',
            },
            {
              id: 4,
              name: 'poison',
            },
          ],
        },
        {
          id: 3,
          name: 'venusaur',
          types: [
            {
              id: 12,
              name: 'grass',
            },
            {
              id: 4,
              name: 'poison',
            },
          ],
        },
      ],
    };
    // return fakePokemonDetail;
    const query = `
    query {
      species: pokemon_v2_pokemonspecies(where: {name: {_eq: "${name}"}}) {
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
    console.log('species', species);

    if (species) {
      const { id, name, flavorText, pokemons, evolutions } = species;
      const [pokemon] = pokemons;

      const data: TPokemonDetail = {
        id,
        name,
        shortDescription: flavorText[0]?.flavorText || '',
        height: pokemon.height,
        weight: pokemon.weight,
        types: pokemon.types.map(({ type }: any) => ({
          id: type.id,
          name: type.name,
        })),
        stats: pokemon.stats.map(({ baseStat, stat }: any) => ({
          name: stat?.name || '',
          baseStat: baseStat,
        })),
        abilities: pokemon.abilities.map(({ ability }: any) => ({
          name: ability.name,
          shortEffect: ability.abilityText[0]?.shortEffect,
        })),
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
      };

      return Promise.resolve(data);
    } else {
      throw new Error('no pokemon');
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
};
