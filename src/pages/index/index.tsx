import React, { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { fetchPokemonsApi } from '../../commons/api/pokemon.api';
import { TFilter } from './type';
import Filter from './components/Filter';
import { TPokemonItem, TPokemonList } from '../../commons/types';
import { useHistory, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { getValueFromQueryString } from '../../commons/helpers';
import useUpdateQueryStringFromObjectChange from '../../commons/hooks/useUpdateQueryStringFromObjectChange';
import FloatingSelectedPokemonToCompare from './components/FloatingSelectedPokemon';
import Loader from '../../commons/components/Loader';
import PokemonList from './components/PokemonList';

const queryKeys = {
  pokemons: 'pokemons',
};

const limit = 20;

const IndexPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { search } = useLocation();
  const { push } = useHistory();

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
  const [isSelectToCompare, setIsSelectToCompare] = useState<boolean>(false);
  const [selectedPokemons, setSelectedPokemons] = useState<TPokemonList>([]);
  const [selectedPokemonIds, setSelectedPokemonIds] = useState<number[]>([]);

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
    window.scrollTo(0, 0);
    setData([]);
    queryClient.removeQueries(queryKeys.pokemons, { exact: true });
    queryClient.cancelQueries(queryKeys.pokemons);
    queryPokemons.refetch();
  };

  useEffect(() => {
    refetchData();
  }, [filter]);

  const handleScrollDOM = (e: any) => {
    if (
      window.innerHeight + window.scrollY >=
      window.document.body.scrollHeight - 50
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
    console.log('isBottom', isBottom);
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

  const handleSelectToCompare = (condition: boolean) => {
    setIsSelectToCompare(condition);
    if (condition === false) {
      setSelectedPokemonIds([]);
      setSelectedPokemons([]);
    }
  };

  const handleApplyFilter = (data: TFilter) => {
    setFilter((state) => ({
      ...state,
      ...data,
    }));
    setIsShowFilter(false);
  };

  const renderTopAction = () => {
    return (
      <div className="fixed h-[64px] flex justify-end items-center gap-2 flex-wrap left-0 right-0 max-w-screen-md mx-auto px-3 z-20 top-0 mt-[64px]">
        <div>
          {isSelectToCompare ? (
            <Button
              onClick={() => handleSelectToCompare(false)}
              danger
              type="primary"
            >
              Cancel compare
            </Button>
          ) : (
            <Button onClick={() => handleSelectToCompare(true)}>
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
    );
  };

  const renderInitialLoader = () => {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  };

  const renderLoadMore = () => {
    return (
      <div className="flex justify-center py-3 fixed bottom-0 left-0 right-0 max-w-screen-md bg-white items-center mx-auto border-t border-gray-200 z-50">
        <div>
          <Loader />
        </div>
        <div>Loading more data...</div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen pt-[68px] pb-4 px-3">
        {renderTopAction()}

        {(queryPokemons.isLoading || queryPokemons.isFetching) &&
          renderInitialLoader()}

        <PokemonList
          data={data}
          isSelectToCompare={isSelectToCompare}
          onClickPokemon={handleClickPokemon}
          selectedPokemonIds={selectedPokemonIds}
        />

        {queryPokemons.isFetchingNextPage && renderLoadMore()}
      </div>

      <Filter
        visible={isShowFilter}
        data={filter}
        onApply={handleApplyFilter}
        onClose={() => setIsShowFilter(false)}
      />
      {isSelectToCompare && selectedPokemons.length > 0 && (
        <FloatingSelectedPokemonToCompare data={selectedPokemons} />
      )}
    </>
  );
};

export default IndexPage;
