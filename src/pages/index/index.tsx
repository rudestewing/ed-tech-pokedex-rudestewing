import React, { useEffect, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { fetchPokemonsApi } from '../../commons/api/pokemon.api';

const queryKeys = {
  pokemons: 'pokemons',
};

type TFilter = {
  typeIds: number[];
  generationIds: number[];
};

const limit = 20;

const IndexPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<TFilter>({
    typeIds: [],
    generationIds: [],
  });

  const [data, setData] = useState<any[]>([]);

  const queryPokemons = useInfiniteQuery(
    queryKeys.pokemons,
    ({ pageParam: offset = 0, signal }) => {
      return fetchPokemonsApi({
        offset,
        limit,
        filter,
      });
    },
    {
      enabled: false,
      onSuccess: (result: any) => {
        console.log('onSuccess', result);
      },
      onError: (error: any) => {
        console.log('onError', error);
      },
    }
  );

  useEffect(() => {
    queryClient.removeQueries(queryKeys.pokemons, { exact: true });
    queryClient.cancelQueries(queryKeys.pokemons);
    queryPokemons.refetch();
  }, [filter]);

  return (
    <div>
      <svg
        className="animate-spin h-5 w-5 mr-3 bg-blue-500"
        viewBox="0 0 24 24"
      ></svg>
    </div>
  );
};

export default IndexPage;
