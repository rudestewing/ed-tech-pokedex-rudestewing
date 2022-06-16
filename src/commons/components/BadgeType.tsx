import React from 'react';
import { getColorFromTypeName } from '../helpers/pokemon';

type TProps = {
  name: string;
};

const BadgeType: React.FC<TProps> = ({ name }) => {
  return (
    <div
      className="text-white text-xs font-semibold px-3 py-1 rounded-full"
      style={{
        backgroundColor: getColorFromTypeName(name),
      }}
    >
      {name}
    </div>
  );
};

export default BadgeType;
