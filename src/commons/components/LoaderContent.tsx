import React from 'react';
import Loader from './Loader';

const LoaderContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Loader />
    </div>
  );
};
export default LoaderContent;
