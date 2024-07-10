import React from 'react';
import { TStats } from '../../../commons/types';

type TProps = {
  data: TStats;
};

const MAX_BASE_STATS = 255;

const Stats: React.FC<TProps> = ({ data }) => {
  const getPercentage = (value: number) => {
    return (value / MAX_BASE_STATS) * 100;
  };

  const progressBar = (percentage: number = 0) => {
    return (
      <div className="bg-gray-200 h-[18px] w-full relative rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 bottom-0 bg-indigo-400"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      {data.map((stat) => {
        return (
          <div key={stat.name}>
            <div className="flex justify-start gap-2">
              <div className="font-bold">({stat.baseStat})</div>
              <div>{stat.name}</div>
            </div>
            {progressBar(getPercentage(stat.baseStat))}
          </div>
        );
      })}
    </div>
  );
};

export default Stats;
