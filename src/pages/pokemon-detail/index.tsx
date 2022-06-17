import { Button, Select, Tabs } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { getPokemonDetailApi } from '../../commons/api/pokemon.api';
import BadgeType from '../../commons/components/BadgeType';
import Layout from '../../commons/components/Layout';
import Loader from '../../commons/components/Loader';
import LoaderContent from '../../commons/components/LoaderContent';
import { TOptionItem, TOptionItems } from '../../commons/constants';
import { capitalizeFirstLetter } from '../../commons/helpers';
import {
  getArtwork,
  getBackgroundColorFromTypeName,
  getIDNumber,
} from '../../commons/helpers/pokemon';
import { TPokemonDetail } from '../../commons/types';
import About from './components/About';
import Evolutions from './components/Evolutions';
import Stats from './components/Stats';

const PokemonDetailPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { goBack } = useHistory();

  const queryPokemon = useQuery(
    ['pokemon', name],
    () => {
      return getPokemonDetailApi(name);
    },
    {
      initialData: null,
    }
  );

  const { isLoading, isFetching, isError } = queryPokemon;

  const species = queryPokemon.data;

  const [forms, setForms] = useState<TPokemonDetail[]>([]);
  const [selectedForm, setSelectedForm] = useState<TPokemonDetail | null>(null);

  useEffect(() => {
    if (queryPokemon.data) {
      setSelectedForm(queryPokemon.data.pokemons[0]);
      setForms(queryPokemon.data.pokemons);
    }
  }, [queryPokemon.data]);

  const optionsPokemons = useMemo<TOptionItems>(() => {
    return forms.map((item) => {
      return {
        value: String(item.id),
        label: item.name,
        payload: item,
      };
    });
  }, [forms]);

  const renderTopAction = () => {
    return (
      <div className="fixed py-2 flex justify-end gap-3 w-full left-0 right-0 max-w-screen-md mx-auto">
        {forms.length > 1 && (
          <div className="flex justify-center">
            <Select
              options={optionsPokemons as []}
              onChange={(e, obj: any) => {
                setSelectedForm(obj.payload);
              }}
              defaultValue={String(selectedForm?.id)}
              style={{
                width: 300,
              }}
            ></Select>
          </div>
        )}
      </div>
    );
  };

  const renderError = () => {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div>Error</div>
      </div>
    );
  };

  const renderContent = () => {
    if (!selectedForm) {
      return '';
    }

    return (
      <div
        className="min-h-screen flex flex-col gap-4 px-3 py-8"
        style={{
          backgroundColor: selectedForm
            ? getBackgroundColorFromTypeName(
                selectedForm.types[0]?.name || 'normal'
              )
            : 'transparent',
        }}
      >
        <div className="flex flex-col gap-2 items-center">
          <div className="w-[280px] md:w-[320px] h-[280px] md:h-[320px] p-3">
            <img
              src={getArtwork(selectedForm.id)}
              alt=""
              className="object-cover object-center w-full h-full"
            />
          </div>
          <div className="text-2xl text-gray-600 font-bold">
            #{getIDNumber(selectedForm.id)}
          </div>
          <div className="text-2xl text-gray-800 font-bold tracking-wider">
            {capitalizeFirstLetter(selectedForm.name)}
          </div>
          <div className="flex flex-wrap gap-3">
            {selectedForm.types.map((type) => (
              <BadgeType name={type.name} key={type.id} />
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-white py-3 px-6">
          <Tabs>
            <Tabs.TabPane tab="About" key={1}>
              <About
                description={species?.shortDescription || ''}
                pokemon={selectedForm}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Stats" key={2}>
              <Stats data={selectedForm.stats} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Evolutions" key={3}>
              <Evolutions data={species?.evolutions || []} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  };

  return (
    <Layout hasBack>
      <div className="min-h-screen flex flex-col">
        {renderTopAction()}

        {(isLoading || isFetching) && <LoaderContent />}

        {isError && renderError()}

        {renderContent()}
      </div>
    </Layout>
  );
};

export default PokemonDetailPage;
