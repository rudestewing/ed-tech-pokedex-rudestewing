import React, { useMemo } from 'react';
import BadgeType from '../../../commons/components/BadgeType';
import { getArtwork, getIDNumber } from '../../../commons/helpers/pokemon';
import { TEvolution, TEvolutions } from '../../../commons/types';

type TProps = {
  data: TEvolutions;
};

const Evolutions: React.FC<TProps> = ({ data }) => {
  const evolutionTree = useMemo<{ [key: string]: TEvolutions }>(() => {
    let nodes: { [key: string]: TEvolutions } = {};

    data.forEach((item: TEvolution, index: number) => {
      if (item.evolvesFromSpeciesId === null) {
        nodes[0] = [item];
      } else {
        if (item.evolvesFromSpeciesId in nodes) {
          nodes[item.evolvesFromSpeciesId].push(item);
        } else {
          nodes[item.evolvesFromSpeciesId] = [item];
        }
      }
    });

    return nodes;
  }, [data]);

  return (
    <div className="flex flex-col gap-2 justify-center">
      <div className="text-lg font-bold text-center">Evolution Tree</div>
      {Object.keys(evolutionTree).map((key: any) => {
        return (
          <div className="flex gap-1 justify-center">
            {evolutionTree[key].map((evolution) => {
              return (
                <div className="w-1/2 flex justify-center">
                  <div className="flex flex-col gap-1">
                    <div style={{ width: 120, height: 'auto' }}>
                      <img
                        src={getArtwork(evolution.id)}
                        alt=""
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="text-center font-semibold text-gray-500">
                      #{getIDNumber(evolution.id)}
                    </div>
                    <div className="text-center font-semibold text-gray-900">
                      {evolution.name}
                    </div>
                    <div className="flex justify-center gap-2">
                      {evolution.types.map((type: any) => {
                        return <BadgeType name={type.name} />;
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Evolutions;
