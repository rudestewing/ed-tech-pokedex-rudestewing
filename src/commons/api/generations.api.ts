import { graphQL } from '../helpers/http-request';

export const getAllGenerationsApi = async (): Promise<any> => {
  try {
    const query = `
    query {
      generations: pokemon_v2_generation(offset: 0) {
        id
        name
        names: pokemon_v2_generationnames(limit: 1, where: {pokemon_v2_language: {name: {_eq: "en"}}}) {
          name
        }
      }
    }
    `;
    const response = await graphQL(query);
    return Promise.resolve(response.data?.data?.generations || []);
  } catch (error: any) {
    return Promise.reject(error);
  }
};
