import React, { useEffect, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { fetchPokemonsApi } from '../../commons/api/pokemon.api';
import { Row, Col } from 'antd';
import { TFilter } from './type';
import Filter from './components/Filter';
import PokemonCard from '../../commons/components/PokemonCard';
import { TPokemonItem, TPokemonList } from '../../commons/types';
import { Link } from 'react-router-dom';

const queryKeys = {
  pokemons: 'pokemons',
};

const limit = 20;

const IndexPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<TFilter>({
    typeIds: [],
    generationIds: [],
  });

  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);

  const [data, setData] = useState<TPokemonList>([]);
  const [isBottom, setIsBottom] = useState<boolean>(false);

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
        const allPageData: TPokemonList = [].concat(...result?.pages);
        setData(allPageData);
      },
      onError: (error: any) => {
        console.log('onError', error);
      },
      getNextPageParam: (lastPage: any, allPages: any) => {
        if (limit) {
          const hasNext = limit <= lastPage.length;
          return hasNext ? allPages?.length * limit : undefined;
        }

        return undefined;
      },
    }
  );

  const loadMore = () => {
    if (
      queryPokemons.hasNextPage &&
      !queryPokemons.isLoading &&
      !queryPokemons.isFetching &&
      !queryPokemons.isFetchingNextPage
    ) {
      queryPokemons.fetchNextPage();
    }
  };

  useEffect(() => {
    queryClient.removeQueries(queryKeys.pokemons, { exact: true });
    queryClient.cancelQueries(queryKeys.pokemons);
    queryPokemons.refetch();
  }, [filter]);

  const handleScrollDOM = () => {
    if (
      window.innerHeight + window.scrollY ===
      window.document.body.scrollHeight
    ) {
      setIsBottom(true);
    } else {
      setIsBottom(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScrollDOM);

    return () => {
      window.removeEventListener('scroll', handleScrollDOM);
    };
  }, []);

  useEffect(() => {
    if (
      isBottom &&
      queryPokemons.hasNextPage &&
      !queryPokemons.isLoading &&
      !queryPokemons.isFetching &&
      !queryPokemons.isFetchingNextPage
    ) {
      queryPokemons.fetchNextPage();
    }
  }, [isBottom, queryPokemons]);

  return (
    <>
      <div className="pokemon-list">
        <Row gutter={[18, 18]}>
          {data.map((pokemon: TPokemonItem) => {
            return (
              <Col xs={12} md={8} key={pokemon.id}>
                <Link
                  to={`/pokemon-detail/${pokemon.name}`}
                  className="hover:outline-2 border border-transparent hover:border-blue-600 block rounded-lg"
                >
                  <PokemonCard data={pokemon} />
                </Link>
              </Col>
            );
          })}
          {queryPokemons.isFetchingNextPage && (
            <Col span={24}>
              <div className="flex justify-center py-3">
                Loading More Pokemon
              </div>
            </Col>
          )}
        </Row>
      </div>
      <Filter
        visible={isShowFilter}
        data={filter}
        onApply={(data) => {
          setFilter((state) => ({
            ...state,
            ...data,
          }));
        }}
        onClose={() => setIsShowFilter(false)}
      />
    </>
  );
};

export default IndexPage;
