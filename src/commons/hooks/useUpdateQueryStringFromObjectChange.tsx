import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'query-string';
import { TObject } from '../types';

const useUpdateQueryStringFromObjectChange = (
  keys: string[],
  object: TObject
) => {
  const location = useLocation();
  const history = useHistory();

  const { pathname, search } = location;

  const currentSearch = qs.parse(search);

  useEffect(() => {
    const searches: TObject = { ...currentSearch };

    Object.keys(object).forEach((key) => {
      if (keys.includes(key)) {
        delete searches[key];
        const current = object[key];
        if (['string', 'number'].includes(typeof current) && !!current) {
          searches[key] = current;
        }
        if (Array.isArray(current) && current.length > 0) {
          searches[key] = current.join(',');
        }
      }
    });

    history.push({
      pathname,
      search: qs.stringify(searches),
    });
  }, [object]);
};

export default useUpdateQueryStringFromObjectChange;
