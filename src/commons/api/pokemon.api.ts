import { graphQL } from '../helpers/http-request';

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
): Promise<any> => {
  try {
    const { limit, offset, filter } = props;

    const query = `
    query {
      species: pokemon_v2_pokemonspecies(
        limit: ${limit},
        offset: ${offset},
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
          }
        }
      ) {
        name
        id
        pokemons: pokemon_v2_pokemons {
          name
          id
          types: pokemon_v2_pokemontypes {
            type: pokemon_v2_type {
              name
              id
            }
          }
        }
        pokemon_v2_generation {
          id
          name
        }
      }
    }
    `;

    const response = await graphQL(query);
    return Promise.resolve(response.data?.data?.species || []);
  } catch (error: any) {
    return Promise.reject(error);
  }
};

export const getPokemonDetailApi = async (name: string): Promise<any> => {
  try {
    return Promise.resolve();
  } catch (error: any) {
    return Promise.reject(error);
  }
};
