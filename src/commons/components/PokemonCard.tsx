import React from 'react';
import {
  getArtwork,
  getBackgroundColorFromTypeName,
  getBackgroundFromTypeNames,
  getIDNumber,
} from '../helpers/pokemon';
import BadgeType from './BadgeType';

type TProps = {
  id: number;
  name: string;
  types: any[];
};

const PokemonCard: React.FC<TProps> = ({ id, name, types }) => {
  return (
    <div
      className="rounded-lg bg-white h-full w-full relative overflow-hidden p-2"
      style={{
        backgroundColor: getBackgroundColorFromTypeName(
          types[0]?.type?.name || 'normal'
        ),
      }}
    >
      <div className="flex flex-col gap-1 z-10 px-3 py-2">
        <div className="w-full px-8 py-3">
          <img
            src={getArtwork(id)}
            alt=""
            className="w-full h-full object-center content-center"
          />
        </div>
        <div className="text-lg text-gray-600 font-semibold">
          #{getIDNumber(id)}
        </div>
        <div className="flex flex-wrap gap-2">
          {types.map((type: any) => {
            return <BadgeType name={type?.type?.name} />;
          })}
        </div>
      </div>
    </div>
  );
};
export default PokemonCard;
