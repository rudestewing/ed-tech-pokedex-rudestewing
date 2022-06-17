import React from 'react';
import { TAbilities, TPokemonDetail } from '../../../commons/types';

type TProps = {
  description: string;
  pokemon: TPokemonDetail;
};

const About: React.FC<TProps> = ({ description, pokemon }) => {
  return (
    <div className="flex flex-col gap-4">
      <div>{description}</div>
      <div className="w-full md:w-1/2">
        <div className="text-lg font-semibold text-gray-900">Basic</div>
        <table className="">
          <tbody>
            <tr>
              <td width="80">Height</td>
              <td>{pokemon.height}</td>
            </tr>
            <tr>
              <td>Weight</td>
              <td>{pokemon.weight}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">Abilities</div>
        <ul className="list-disc flex flex-col gap-2">
          {pokemon.abilities.map((ability) => {
            return (
              <li className="flex flex-col gap-1">
                <div className="text-gray-900 font-semibold">
                  {ability.name}
                </div>
                <div>{ability.shortEffect}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default About;
