import React from 'react';

type TProps = {
  children: '';
};

const Layout: React.FC<TProps> = ({ children }) => {
  return <div id="layout">{children}</div>;
};

export default Layout;
