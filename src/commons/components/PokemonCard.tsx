import React from 'react';
import { capitalizeFirstLetter } from '../helpers';
import {
  getArtwork,
  getBackgroundColorFromTypeName,
  getIDNumber,
} from '../helpers/pokemon';
import { TPokemonItem } from '../types';
import BadgeType from './BadgeType';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { STYLE_FILL_CURRENT } from '../constants';

type TProps = {
  data: TPokemonItem;
  selected?: boolean;
  selectMode?: boolean;
};

const PokemonCard: React.FC<TProps> = ({
  data,
  selectMode = false,
  selected = false,
}) => {
  const { id, name, types } = data;

  return (
    <div
      className="rounded-lg bg-white h-full w-full relative overflow-hidden p-2"
      style={{
        backgroundColor: getBackgroundColorFromTypeName(
          types[0]?.name || 'normal'
        ),
      }}
    >
      {selectMode && (
        <div className="absolute top-0 right-0 text-blue-600">
          {selected ? (
            <CheckCircleIcon style={{ ...STYLE_FILL_CURRENT, fontSize: 48 }} />
          ) : (
            <RadioButtonUncheckedIcon
              style={{ ...STYLE_FILL_CURRENT, fontSize: 48 }}
            />
          )}
        </div>
      )}
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
        <div className="text-lg text-gray-900 font-semibold">
          {capitalizeFirstLetter(name)}
        </div>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => {
            return <BadgeType name={type.name} />;
          })}
        </div>
      </div>
    </div>
  );
};
export default PokemonCard;
