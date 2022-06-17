import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import IndexPage from '../pages/index';
import ComparisonPage from '../pages/comparison';
import PokemonDetailPage from '../pages/pokemon-detail';
import Layout from '../commons/components/Layout';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={IndexPage} />
        <Route
          exact
          path="/pokemon-detail/:name"
          component={PokemonDetailPage}
        />
        <Route exact path="/comparison" component={ComparisonPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
