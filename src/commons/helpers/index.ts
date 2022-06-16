import qs from 'query-string';
import { TObject } from '../types';

export const capitalizeFirstLetter = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const getValueFromQueryString = (keys: string[], search: string) => {
  const parsedSearch = qs.parse(search);

  const selectedSearch: TObject = {};

  keys.forEach((key) => {
    if (parsedSearch[key]) {
      selectedSearch[key] = parsedSearch[key];
    }
  });

  return selectedSearch;
};
