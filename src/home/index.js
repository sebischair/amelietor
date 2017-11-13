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
import {Card, CardTitle, CardText, CardActions, Button, Grid, Cell} from 'react-mdl';

class HomePage extends React.Component {

  componentDidMount() {
    document.title = title;
  }

  render() {
    return (
      <Layout className={s.content}>
        <h4>Import, analyze and explore your software architectural decisions</h4>
        <Grid className="grid">
          <Cell col={4}>
            <Card shadow={0} style={{width: '320px', height: '320px', margin: 'auto'}}>
              <CardTitle expand style={{color: '#fff'}}>
                <img src="syncpipes.png" style={{width: '300px', height: '200px'}} />
              </CardTitle>
              <CardText>
                <b>Step 1.</b> Import issues from JIRA using Syncpipes.
              </CardText>
              <CardActions border>
                <Button colored><Link to="/projects">Demo</Link></Button>
              </CardActions>
            </Card>
          </Cell>
          <Cell col={4}>
            <Card shadow={0} style={{width: '320px', height: '320px', margin: 'auto'}}>
              <CardTitle expand style={{color: '#fff'}}>
                <img src="dd.png" style={{width: '250px', height: '100px'}} />
              </CardTitle>
              <CardText>
                <b>Step 2.</b> Extract design decisions from issues.
              </CardText>
              <CardActions border>
                <Button colored><Link to="/projects">Demo</Link></Button>
              </CardActions>
            </Card>
          </Cell>
          <Cell col={4}>
            <Card shadow={0} style={{width: '320px', height: '320px', margin: 'auto'}}>
              <CardTitle expand style={{color: '#fff'}}>
                <img src="ae.png" style={{width: '250px', height: '200px'}} />
              </CardTitle>
              <CardText>
                <b>Step 3.</b> Annotate architectural elements in design decisions.
              </CardText>
              <CardActions border>
                <Button colored><Link to="/projects">Demo</Link></Button>
              </CardActions>
            </Card>
          </Cell>
        </Grid>


        <Grid className="grid">
          <Cell col={4}>
            <Card shadow={0} style={{width: '320px', height: '320px', margin: 'auto'}}>
              <CardTitle expand style={{color: '#fff'}}>
                <img src="qa.png" style={{width: '300px', height: '200px'}} />
              </CardTitle>
              <CardText>
                <b>Step 4.</b> Annotate design decisions with quality attributes.
              </CardText>
              <CardActions border>
                <Button colored><Link to="/projects">Demo</Link></Button>
              </CardActions>
            </Card>
          </Cell>
          <Cell col={4}>
            <Card shadow={0} style={{width: '320px', height: '320px', margin: 'auto'}}>
              <CardTitle expand style={{color: '#fff'}}>
                <img src="em.png" style={{width: '300px', height: '200px'}} />
              </CardTitle>
              <CardText>
                <b>Step 5.</b> Get recommendations about experts.
              </CardText>
              <CardActions border>
                <Button colored><Link to="/projects">Demo</Link></Button>
              </CardActions>
            </Card>
          </Cell>
          <Cell col={4}>
            <Card shadow={0} style={{width: '320px', height: '320px', margin: 'auto'}}>
              <CardTitle expand style={{color: '#fff'}}>
                <img src="aae.png" style={{width: '300px', height: '200px'}} />
              </CardTitle>
              <CardText>
                <b>Step 6.</b> Get recommendations for alternative architectural choice.
              </CardText>
              <CardActions border>
                <Button colored><Link to="/editor">Demo</Link></Button>
              </CardActions>
            </Card>
          </Cell>
        </Grid>
        <h4> A framework to support architecture decision making</h4>
        <Grid>
          <Cell col={12}>
            <img src="framework.png" style={{width: '80%'}} />
          </Cell>
        </Grid>
      </Layout>
    );
  }

}

export default HomePage;
