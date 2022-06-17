import { LeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

type TProps = {
  children: any;
  hasBack?: boolean;
};

const Layout: React.FC<TProps> = ({ children, hasBack = false }) => {
  const location = useLocation();

  const { goBack } = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="bg-gray-50 min-h-full">
      <div
        id="layout"
        className="max-w-screen-md mx-auto flex flex-col min-h-screen"
      >
        <header className="fixed left-0 top-0 right-0 bg-white h-[60px] z-50 shadow-sm ">
          <div className="flex max-w-screen-md mx-auto relative h-full justify-start items-center">
            <div className="text-lg fixed mx-auto left-0 right-0 flex items-center justify-center font-semibold tracking-wider">
              Pokedex
            </div>
            {!!hasBack && (
              <Button
                type="default"
                onClick={() => goBack()}
                icon={<LeftOutlined />}
              />
            )}
          </div>
        </header>
        <div className="pt-[60px] z-0 flex-auto">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
