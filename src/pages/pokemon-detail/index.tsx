import { Button, Select, Tabs } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { getPokemonDetailApi } from '../../commons/api/pokemon.api';
import BadgeType from '../../commons/components/BadgeType';
import { TOptionItem, TOptionItems } from '../../commons/constants';
import { capitalizeFirstLetter } from '../../commons/helpers';
import {
  getArtwork,
  getBackgroundColorFromTypeName,
  getIDNumber,
} from '../../commons/helpers/pokemon';
import { TPokemonDetail } from '../../commons/types';
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

  const pokemon = queryPokemon.data;

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

  return (
    <div className="min-h-screen">
      <div className="fixed py-2 flex justify-between gap-3 w-full left-0 right-0 max-w-screen-md mx-auto">
        <Button type="default" onClick={() => goBack()}>
          Back
        </Button>
        {forms.length > 1 && (
          <div className="flex justify-center">
            <Select
              options={optionsPokemons as []}
              onChange={(e, obj: any) => {
                console.log('onChange', e, obj);
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

      {(isLoading || isFetching) && <div>Loading</div>}

      {isError && <div>Error</div>}

      {selectedForm && (
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
                <div className="flex flex-col gap-2">
                  <div>{queryPokemon.data?.shortDescription}</div>
                  <div>height</div>
                  <div>width</div>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Stats" key={2}>
                <Stats data={selectedForm.stats} />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonDetailPage;
