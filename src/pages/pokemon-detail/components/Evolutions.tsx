import React, { useMemo } from 'react';
import { TEvolutions } from '../../../commons/types';

type TProps = {
  data: TEvolutions;
};

const Evolutions: React.FC<TProps> = ({ data }) => {
  const evolutionTree = useMemo<any>(() =>
    // data.forEach((evolution) => {

    // });
    {}, [data]);

  return <div></div>;
};

export default Evolutions;
