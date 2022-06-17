import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type TProps = {
  children: any;
};

const Layout: React.FC<TProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="bg-gray-50 min-h-full">
      <div
        id="layout"
        className="max-w-screen-md mx-auto flex flex-col min-h-screen"
      >
        <header className="fixed left-0 top-0 right-0 flex justify-center items-center bg-white h-[60px] z-50 shadow-sm ">
          <div className="text-lg font-semibold">Pokedex</div>
        </header>
        <div className="pt-[60px] z-0 flex-auto">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
