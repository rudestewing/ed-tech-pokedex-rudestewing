import { Button, Checkbox, Drawer, Form, Radio } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { getAllGenerationsApi } from '../../../commons/api/generations.api';
import { getAllTypesApi } from '../../../commons/api/types.api';
import { TOptionItems } from '../../../commons/constants';
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

  const handleApply = () => {
    onApply(filter);
  };

  const optionsTypes = useMemo<TOptionItems>(() => {
    return (queryTypes.data || []).map((type) => ({
      value: String(type.id),
      label: String(type.name),
    }));
  }, [queryTypes.data]);

  const optionsGenerations = useMemo<TOptionItems>(() => {
    return (queryGenerations.data || []).map((type) => ({
      value: String(type.id),
      label: String(type.name),
    }));
  }, [queryGenerations.data]);

  return (
    <Drawer
      placement="top"
      visible={visible}
      onClose={onClose}
      width="100%"
      closable={false}
      height={'100%'}
    >
      <div className="max-w-screen-md flex flex-col justify-between gap-2 mx-auto h-full">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Filter</h3>
          <div className="flex flex-col gap-3">
            <div>
              <h5 className="text-md font-semibold">Type</h5>
              <Checkbox.Group
                options={optionsTypes}
                onChange={(e) => {
                  setFilter((state) => ({
                    ...state,
                    typeIds: e.map((item) => Number(item)),
                  }));
                }}
                value={filter.typeIds.map((item) => String(item))}
              />
            </div>
            <div>
              <h5 className="text-md font-semibold">Generation</h5>
              <Checkbox.Group
                options={optionsGenerations}
                onChange={(e) => {
                  setFilter((state) => ({
                    ...state,
                    generationIds: e.map((item) => Number(item)),
                  }));
                }}
                value={filter.generationIds.map((item) => String(item))}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="default" danger onClick={onClose}>
            Close
          </Button>
          <Button
            type="default"
            onClick={() =>
              setFilter((state) => ({
                ...state,
                typeIds: [],
                generationIds: [],
              }))
            }
          >
            Reset
          </Button>
          <Button type="primary" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default Filter;
