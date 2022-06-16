import React from 'react';

type TProps = {
  children: any;
};

const Layout: React.FC<TProps> = ({ children }) => {
  return (
    <div className="bg-gray-50 min-h-full">
      <div id="layout" className="max-w-screen-md mx-auto px-3 py-2">
        <header className="fixed left-0 top-0 right-0 flex justify-center items-center bg-white h-[60px] z-50">
          <div className="text-lg font-semibold">Pokedex</div>
        </header>
        <div className="pt-[68px] z-0">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
