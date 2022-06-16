import React, { useEffect, useState } from 'react';
import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';
import { getAllGenerationsApi } from '../../commons/api/generations.api';
import { fetchPokemonsApi } from '../../commons/api/pokemon.api';
import { getAllTypesApi } from '../../commons/api/types.api';

const queryKeys = {
  pokemons: 'pokemons',
  types: 'types',
  generations: 'generations',
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

  const queryTypes = useQuery(queryKeys.types, () => getAllTypesApi(), {
    initialData: [],
  });

  const queryGenerations = useQuery(
    queryKeys.generations,
    () => getAllGenerationsApi(),
    {
      initialData: [],
    }
  );

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
      {queryTypes.data.map((type: any) => {
        return <div key={type.id}>{type.name}</div>;
      })}
      {queryGenerations.data.map((generation: any) => {
        return <div key={generation.id}>{generation.names[0].name}</div>;
      })}
    </div>
  );
};

export default IndexPage;
