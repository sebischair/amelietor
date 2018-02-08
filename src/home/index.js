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
import { title } from './home.md';
import {Grid, Cell} from 'react-mdl';

class HomePage extends React.Component {

  componentDidMount() {
    document.title = title;
  }

  render() {
    return (
        <Layout>
          <header>
            <a name="top"></a>
            <div className="video-wrap">
              <video autoPlay loop poster="images/header_bg.jpg">
                <source src="images/header.mp4" width="100%" type="video/mp4"></source>
              </video>
            </div>
            <div className="mdl-typography--text-center overlay">
              <div className="amelie-slogan">make sustainable architectural decisions.</div>
              <div className="amelie-sub-slogan">see what's going on in your project. improve the overall quality of your project. learn from past experiences...</div>
            </div>
          </header>

          <div className="shadow_box"></div>

          <div className="amelie-section">
            <div className="mdl-typography--display-1-color-contrast" style={{paddingLeft: "20px"}}>Import project data from different sources</div>

            <Grid className="amelie-imports">
              <Cell col={12}>
              </Cell>
              <Cell col={2}>
                <div className="amelie-pm amelie-import">
                  <img className="amelie-import-pm-image" src="images/msproject.png"></img>
                </div>
              </Cell>
              <Cell col={2}>
                <div className="amelie-pm amelie-import">
                  <img className="amelie-import-ea-image" src="images/ea.jpg"></img>
                </div>
              </Cell>
              <Cell col={3}>
                <div className="amelie-pm amelie-import">
                  <img className="amelie-import-image" src="images/jira.svg"></img>
                  <img className="amelie-import-image" src="images/github_logo.png"></img>
                </div>
              </Cell>
              <Cell col={2}>
                <div className="amelie-pm amelie-import">
                  <img className="amelie-import-ol-image" src="images/outlook.png"></img>
                </div>
              </Cell>
              <Cell col={3}>
                <div className="amelie-pm amelie-import">
                  <img className="amelie-import-image" src="images/mysql.png"></img>
                  <img className="amelie-import-image" src="images/mongodb.png"></img>
                </div>
              </Cell>
            </Grid>

            <Grid className="amelie-imports">
              <Cell col={2}>
                <div className="amelie-pm amelie-import">
                  <span className="amelie-link mdl-typography--font-regular mdl-typography--text-uppercase">Project Management</span>
                </div>
              </Cell>
              <Cell col={2}>
                <div className="amelie-pm amelie-import">
                  <span className="amelie-link mdl-typography--font-regular mdl-typography--text-uppercase">Enterprise Architect</span>
                </div>
              </Cell>
              <Cell col={3}>
                <div className="amelie-pm amelie-import">
                  <span className="amelie-link mdl-typography--font-regular mdl-typography--text-uppercase">Task Management</span>
                </div>
              </Cell>
              <Cell col={2}>
                <div className="amelie-pm amelie-import">
                  <span className="amelie-link mdl-typography--font-regular mdl-typography--text-uppercase">E-mail clients</span>
                </div>
              </Cell>
              <Cell col={3}>
                <div className="amelie-pm amelie-import">
                  <span className="amelie-link amelie-tm-link mdl-typography--font-regular mdl-typography--text-uppercase">Databases</span>
                </div>
              </Cell>
            </Grid>

          </div>

          <Grid className="amelie-section">
            <div className="shadow_box"></div>
            <Cell col={7}>
              <div className="mdl-typography--display-1-color-contrast">Analyze architectural decisions</div>
              <div>We use Machine learning techniques for architectural knowledge management</div>
              <ul className="section-sub-text">
                <li>
                  Our system will automatically identify design decisions
                </li>
                <li>
                  Decisions will also classified into different categories
                </li>
              </ul>
            </Cell>
            <Cell col={5}>
              <img src="images/dd.png" width="100%"></img>
            </Cell>
          </Grid>
          <div className="shadow_box"></div>
          <div className="amelie-section">
            <Grid>
              <Cell col={7}>
                <div className="mdl-typography--display-1-color-contrast">Inspect decisions affecting the quality attributes</div>
                <div>We use Natural Language Processing techniques to identify quality attributes</div>
                <ul className="section-sub-text">
                  <li>
                    Our system will automatically show how your decisions are influencing the quality attributes
                  </li>
                  <li>
                    We use the industry standard ISO/IEC 25010:2011 product quality list
                  </li>
                </ul>
              </Cell>
              <Cell col={5} style={{textAlign: "center"}}>
                <img src="images/qa.png" width="80%"></img>
              </Cell>
            </Grid>
          </div>
          <div className="shadow_box"></div>
          <div className="amelie-section">
            <Grid>
              <Cell col={7}>
                <div className="mdl-typography--display-1-color-contrast">Explore core architectural topics</div>
                <div>We use the DBpedia ontology to identify architectural topics</div>
                <ul className="section-sub-text">
                  <li>
                    Our system will automatically identify architectural topics discussed in your project
                  </li>
                  <li>
                    It will also suggest alternative solutions while making decisions
                  </li>
                </ul>
              </Cell>
              <Cell col={5} style={{textAlign: "center"}}>
                <img src="images/ae.png" width="50%"></img>
              </Cell>
            </Grid>
          </div>
          <div className="shadow_box"></div>
          <div className="amelie-section">
            <Grid>
              <Cell col={7}>
                <div className="mdl-typography--display-1-color-contrast">Get recommendations about experts</div>
                <div>We quantify the expertise of architects and developers in your organization</div>
                <ul className="section-sub-text">
                  <li>
                    Our system will automatically suggest you experts who should be involved to address new design concerns
                  </li>
                  <li>
                    One can also search for people who have experience in specific architectural topics
                  </li>
                </ul>
              </Cell>
              <Cell col={5} style={{textAlign: "center"}}>
                <img src="images/em.png" width="80%"></img>
              </Cell>
            </Grid>
          </div>
          <div className="shadow_box"></div>
          <div className="amelie-section">
            <Grid>
              <Cell col={7}>
                <div className="mdl-typography--display-1-color-contrast">Make sustainable architectural decisions</div>
                <div>Using our state of the art Architecture Knowledge Management Software:</div>
                <ul className="section-sub-text">
                  <li>
                    Reduce the risk of high-impact decisions on the system
                  </li>
                  <li>
                    Reduce time and effort in implementing new decisions
                  </li>
                </ul>
              </Cell>
              <Cell col={5} style={{textAlign: "center"}}>
                <img src="images/framework.png" width="100%"></img>
              </Cell>
            </Grid>
          </div>
        </Layout>
    );
  }
}

export default HomePage;
