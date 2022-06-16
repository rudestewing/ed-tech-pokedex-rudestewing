import { graphQL } from '../helpers/http-request';

export const getAllTypesApi = async (): Promise<any> => {
  try {
    const query = `
    query {
      types: pokemon_v2_type(offset: 0) {
        name
        id
      }
    }
    `;
    const response = await graphQL(query);
    return Promise.resolve(response.data?.data?.types || []);
  } catch (error: any) {
    return Promise.reject(error);
  }
};
