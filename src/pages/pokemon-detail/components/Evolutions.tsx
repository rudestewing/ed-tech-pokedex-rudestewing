import React, { useMemo } from 'react';
import { TEvolutions } from '../../../commons/types';

type TProps = {
  data: TEvolutions;
};

const Evolutions: React.FC<TProps> = ({ data }) => {
  const evolutionTree = useMemo<any>(() => {
    const node: any[] = [];

    // data.forEach((evolution) => {
    //   if(evolution.)
    // });
  }, [data]);

  return <div></div>;
};

export default Evolutions;
