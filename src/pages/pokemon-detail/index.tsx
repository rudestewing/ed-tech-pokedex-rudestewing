import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getPokemonDetailApi } from '../../commons/api/pokemon.api';

const PokemonDetailPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  const queryPokemon = useQuery(
    ['pokemon', name],
    () => {
      return getPokemonDetailApi(name);
    },
    {
      initialData: null,
    }
  );

  useEffect(() => {
    console.log('data', queryPokemon.data);
  }, [queryPokemon]);
  return <div></div>;
};

export default PokemonDetailPage;
