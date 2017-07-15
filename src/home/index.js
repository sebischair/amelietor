/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import { title } from './home.md';
import Link from '../../components/Link';

class HomePage extends React.Component {

  componentDidMount() {
    document.title = title;
  }

  render() {
    return (
      <Layout className={s.content}>
        <h4> An ontology-based approach for software architecture recommendations </h4>
        <p>
          This is a prototypical implementation of web editor that provides authors of software architecture documentation with
          context related recommendations. Two types of recommendations are provided using existing broad cross-domain
          DBpedia ontology to support architects during the decision-making process (more details could be found <a target="_blank" href="https://wwwmatthes.in.tum.de/pages/9cr85n66nn6c">here</a>.
        </p>
        <Link to="/editor">Demo</Link>
        <h4>Expertise browser for design desicion making </h4>
        <p>

        </p>
        <Link to="/recommender">Demo</Link>
      </Layout>
    );
  }

}

export default HomePage;
