import { Drawer } from 'antd';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getAllGenerationsApi } from '../../../commons/api/generations.api';
import { getAllTypesApi } from '../../../commons/api/types.api';
import { TFilter } from '../type';

type TProps = {
  visible: boolean;
  onApply: (data: TFilter) => void;
  onClose: () => void;
  data: TFilter;
};

const queryKeys = {
  types: 'types',
  generations: 'generations',
};

const Filter: React.FC<TProps> = ({ visible, data, onApply, onClose }) => {
  const [filter, setFilter] = useState<TFilter>(data);

  const queryTypes = useQuery(queryKeys.types, () => getAllTypesApi(), {
    initialData: [],
  });

  const queryGenerations = useQuery(
    queryKeys.generations,
    () => getAllGenerationsApi(),
    {
      initialData: [],
    }
  );

  useEffect(() => {
    setFilter(data);
  }, [data]);

  return (
    <Drawer visible={visible} onClose={onClose} width="100%">
      <></>
    </Drawer>
  );
};

export default Filter;
