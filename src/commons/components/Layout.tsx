import React from 'react';

type TProps = {
  children: any;
};

const Layout: React.FC<TProps> = ({ children }) => {
  return (
    <div className="bg-gray-50 min-h-full">
      <div id="layout" className="max-w-screen-md mx-auto ">
        <header className="fixed left-0 top-0 right-0 flex justify-center items-center bg-white h-[60px] z-50 shadow-sm ">
          <div className="text-lg font-semibold">Pokedex</div>
        </header>
        <div className="pt-[60px] z-0 py-2 px-2 md:px-4">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
