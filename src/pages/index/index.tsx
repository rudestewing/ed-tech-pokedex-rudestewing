import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { fetchPokemonsApi } from '../../commons/api/pokemon.api';
import { TFilter } from './type';
import Filter from './components/Filter';
import PokemonCard from '../../commons/components/PokemonCard';
import { TPokemonItem, TPokemonList } from '../../commons/types';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { getValueFromQueryString } from '../../commons/helpers';
import useUpdateQueryStringFromObjectChange from '../../commons/hooks/useUpdateQueryStringFromObjectChange';

const queryKeys = {
  pokemons: 'pokemons',
};

const limit = 20;

const IndexPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { search } = useLocation();
  const { push } = useHistory();

  const [isSelectToCompare, setIsSelectToCompare] = useState<boolean>(false);
  const [selectedPokemons, setSelectedPokemons] = useState<TPokemonList>([]);
  const [selectedPokemonIds, setSelectedPokemonIds] = useState<number[]>([]);

  const valueFromQueryString = getValueFromQueryString(
    ['typeIds', 'generationIds'],
    search
  );

  const getInitialFilter = (): TFilter => {
    const { typeIds, generationIds } = valueFromQueryString;

    return {
      typeIds: typeIds
        ? String(typeIds)
            .split(',')
            .map((item) => Number(item))
        : [],
      generationIds: generationIds
        ? String(generationIds)
            .split(',')
            .map((item) => Number(item))
        : [],
    };
  };

  const [filter, setFilter] = useState<TFilter>(getInitialFilter());

  useUpdateQueryStringFromObjectChange(
    Object.keys(filter).map((key: string) => key),
    filter
  );

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

  const refetchData = () => {
    setData([]);
    queryClient.removeQueries(queryKeys.pokemons, { exact: true });
    queryClient.cancelQueries(queryKeys.pokemons);
    queryPokemons.refetch();
  };

  useEffect(() => {
    refetchData();
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

  const loadMore = useCallback(() => {
    if (
      queryPokemons.hasNextPage &&
      !queryPokemons.isLoading &&
      !queryPokemons.isFetching &&
      !queryPokemons.isFetchingNextPage
    ) {
      queryPokemons.fetchNextPage();
    }
  }, [queryPokemons]);

  useEffect(() => {
    if (isBottom) {
      loadMore();
    }
  }, [isBottom]);

  const hasFilter = useMemo<boolean>(() => {
    return filter.typeIds.length > 0 || filter.generationIds.length > 0;
  }, [filter]);

  const handleCompare = (pokemon: TPokemonItem) => {
    if (selectedPokemonIds.includes(pokemon.id)) {
      setSelectedPokemonIds((state) =>
        state.filter((id) => {
          return id !== pokemon.id;
        })
      );
      setSelectedPokemons((state) =>
        state.filter((selectedPokemon) => {
          return selectedPokemon.id !== pokemon.id;
        })
      );
    } else {
      setSelectedPokemonIds((state) => [...state, pokemon.id]);
      setSelectedPokemons((state) => [...state, pokemon]);
    }
  };

  const handleClickPokemon = (pokemon: TPokemonItem) => {
    if (isSelectToCompare) {
      handleCompare(pokemon);
    } else {
      push(`/pokemon-detail/${pokemon.name}`);
    }
  };

  return (
    <>
      <div className="fixed h-[64px] flex justify-end items-center gap-2 flex-wrap left-0 right-0 max-w-screen-md mx-auto px-3 z-20">
        <div>
          {isSelectToCompare ? (
            <Button
              onClick={() => {
                setIsSelectToCompare(false);
              }}
              danger
              type="primary"
            >
              Cancel compare
            </Button>
          ) : (
            <Button
              onClick={() => {
                setIsSelectToCompare(true);
              }}
            >
              Select to compare
            </Button>
          )}
        </div>
        <div>
          <Button
            type={hasFilter ? 'primary' : 'default'}
            icon={<FilterOutlined />}
            onClick={() => setIsShowFilter(true)}
          />
        </div>
      </div>
      <div className="pt-[68px] pb-4 ">
        {(queryPokemons.isLoading || queryPokemons.isFetching) && (
          <div>Loading Pokemon</div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {data.map((pokemon: TPokemonItem) => {
            return (
              <span
                key={pokemon.id}
                onClick={() => handleClickPokemon(pokemon)}
                className="hover:outline-2 border border-transparent hover:border-blue-600 block rounded-lg cursor-pointer"
              >
                <PokemonCard
                  data={pokemon}
                  selected={selectedPokemonIds.includes(pokemon.id)}
                  selectMode={isSelectToCompare}
                />
              </span>
            );
          })}
        </div>
      </div>
      {queryPokemons.isFetchingNextPage && (
        <div className="flex justify-center py-3 fixed bottom-0 left-0 right-0 max-w-screen-md bg-white items-center mx-auto border-t border-gray-200">
          Loading
        </div>
      )}
      <Filter
        visible={isShowFilter}
        data={filter}
        onApply={(data) => {
          setFilter((state) => ({
            ...state,
            ...data,
          }));
          setIsShowFilter(false);
        }}
        onClose={() => setIsShowFilter(false)}
      />
    </>
  );
};

export default IndexPage;
