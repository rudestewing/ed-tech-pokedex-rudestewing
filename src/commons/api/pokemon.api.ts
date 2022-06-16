import { graphQL } from '../helpers/http-request';
import { TPokemonList } from '../types';

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

export const getPokemonDetailApi = async (name: string): Promise<any> => {
  try {
    return Promise.resolve();
  } catch (error: any) {
    return Promise.reject(error);
  }
};
