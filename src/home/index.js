/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import { Grid, Cell } from 'react-mdl';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import Header from '../../components/Header';
import history from '../../src/history';

const styles = {
  description: {
    fontSize: '1.5rem',
    color: 'rgba(0, 0, 0, 0.54)'
  },
  buttonContainer: {
    textAlign: 'center',
    paddingTop: '20px'
  }
};

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayNavigation: false
    };
  }

  componentDidMount() {
    document.title = "AMELIE Home";
    window.addEventListener('scroll', this.handleScroll, true);
  }

  handleScroll = event => {
    let scrollTop = event.srcElement.scrollTop;
    const displayNavigation = scrollTop > 150 ? true : false;
    this.setState({ displayNavigation: displayNavigation });
  };

  redirectToProjects = () => {
    history.push({
      pathname: '/projects'
    });
  };

  render() {
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header" ref={node => (this.root = node)}>
        <div className="mdl-layout__inner-container">
          <Header displayNavigation={this.state.displayNavigation} />
          <main className="amelie-content mdl-layout__content">
            <div>
              <header>
                <a name="top" />
                <div className="video-wrap">
                  <video autoPlay loop poster="images/header_bg.jpg">
                    <source src="images/header.mp4" width="100%" type="video/mp4" />
                  </video>
                </div>
                <Typography className="overlay" variant="display3" gutterBottom align="center">
                  Make sustainable architectural decisions.
                </Typography>
                <Typography className={this.props.classes.description} variant="headline" gutterBottom align="center">
                  See what's going on in your project. Improve the overall quality of your project. Learn from past
                  experiences...
                </Typography>
                <div className={this.props.classes.buttonContainer}>
                  <Button variant="raised" color="primary" onClick={this.redirectToProjects}>
                    Get Started
                  </Button>
                </div>
              </header>

              <div className="shadow_box" />

              <div className="amelie-section">
                <Typography variant="display1" gutterBottom style={{ paddingLeft: '20px' }}>
                  Import project data from different sources
                </Typography>

                <Grid className="amelie-imports">
                  <Cell col={12} />
                  <Cell col={2}>
                    <div className="amelie-pm amelie-import">
                      <img className="amelie-import-pm-image" src="images/msproject.png" />
                    </div>
                  </Cell>
                  <Cell col={2}>
                    <div className="amelie-pm amelie-import">
                      <img className="amelie-import-ea-image" src="images/ea.jpg" />
                    </div>
                  </Cell>
                  <Cell col={3}>
                    <div className="amelie-pm amelie-import">
                      <img className="amelie-import-image" src="images/jira.svg" />
                      <img className="amelie-import-image" src="images/github_logo.png" />
                    </div>
                  </Cell>
                  <Cell col={2}>
                    <div className="amelie-pm amelie-import">
                      <img className="amelie-import-ol-image" src="images/outlook.png" />
                    </div>
                  </Cell>
                  <Cell col={3}>
                    <div className="amelie-pm amelie-import">
                      <img className="amelie-import-image" src="images/mysql.png" />
                      <img className="amelie-import-image" src="images/mongodb.png" />
                    </div>
                  </Cell>
                </Grid>

                <Grid className="amelie-imports">
                  <Cell col={2}>
                    <div className="amelie-pm amelie-import">
                      <span className="amelie-link mdl-typography--font-regular mdl-typography--text-uppercase">
                        Project Management
                      </span>
                    </div>
                  </Cell>
                  <Cell col={2}>
                    <div className="amelie-pm amelie-import">
                      <span className="amelie-link mdl-typography--font-regular mdl-typography--text-uppercase">
                        Enterprise Architect
                      </span>
                    </div>
                  </Cell>
                  <Cell col={3}>
                    <div className="amelie-pm amelie-import">
                      <span className="amelie-link mdl-typography--font-regular mdl-typography--text-uppercase">
                        Task Management
                      </span>
                    </div>
                  </Cell>
                  <Cell col={2}>
                    <div className="amelie-pm amelie-import">
                      <span className="amelie-link mdl-typography--font-regular mdl-typography--text-uppercase">
                        E-mail clients
                      </span>
                    </div>
                  </Cell>
                  <Cell col={3}>
                    <div className="amelie-pm amelie-import">
                      <span className="amelie-link amelie-tm-link mdl-typography--font-regular mdl-typography--text-uppercase">
                        Databases
                      </span>
                    </div>
                  </Cell>
                </Grid>
              </div>

              <Grid className="amelie-section">
                <div className="shadow_box" />
                <Cell col={7}>
                  <Typography variant="display1" gutterBottom>
                    Analyze architectural decisions
                  </Typography>
                  <Typography variant="subheading">
                    We use Machine learning techniques for architectural knowledge management
                  </Typography>
                  <ul className="section-sub-text">
                    <li>Our system will automatically identify design decisions</li>
                    <li>Decisions will also classified into different categories</li>
                  </ul>
                </Cell>
                <Cell col={5}>
                  <img src="images/dd.png" width="100%" />
                </Cell>
              </Grid>
              <div className="shadow_box" />
              <div className="amelie-section">
                <Grid>
                  <Cell col={7}>
                    <Typography variant="display1" gutterBottom>
                      Inspect decisions affecting the quality attributes
                    </Typography>
                    <Typography variant="subheading">
                      We use Natural Language Processing techniques to identify quality attributes
                    </Typography>
                    <ul className="section-sub-text">
                      <li>
                        Our system will automatically show how your decisions are influencing the quality attributes
                      </li>
                      <li>We use the industry standard ISO/IEC 25010:2011 product quality list</li>
                    </ul>
                  </Cell>
                  <Cell col={5} style={{ textAlign: 'center' }}>
                    <img src="images/qa.png" width="80%" />
                  </Cell>
                </Grid>
              </div>
              <div className="shadow_box" />
              <div className="amelie-section">
                <Grid>
                  <Cell col={7}>
                    <Typography variant="display1" gutterBottom>
                      Explore core architectural topics
                    </Typography>
                    <Typography variant="subheading">
                      We use the DBpedia ontology to identify architectural topics
                    </Typography>
                    <ul className="section-sub-text">
                      <li>Our system will automatically identify architectural topics discussed in your project</li>
                      <li>It will also suggest alternative solutions while making decisions</li>
                    </ul>
                  </Cell>
                  <Cell col={5} style={{ textAlign: 'center' }}>
                    <img src="images/ae.png" width="50%" />
                  </Cell>
                </Grid>
              </div>
              <div className="shadow_box" />
              <div className="amelie-section">
                <Grid>
                  <Cell col={7}>
                    <Typography variant="display1" gutterBottom>
                      Get recommendations about experts
                    </Typography>
                    <Typography variant="subheading">
                      We quantify the expertise of architects and developers in your organization
                    </Typography>
                    <ul className="section-sub-text">
                      <li>
                        Our system will automatically suggest you experts who should be involved to address new design
                        concerns
                      </li>
                      <li>One can also search for people who have experience in specific architectural topics</li>
                    </ul>
                  </Cell>
                  <Cell col={5} style={{ textAlign: 'center' }}>
                    <img src="images/em.png" width="80%" />
                  </Cell>
                </Grid>
              </div>
              <div className="shadow_box" />
              <div className="amelie-section">
                <Grid>
                  <Cell col={7}>
                    <Typography variant="display1" gutterBottom>
                      Make sustainable architectural decisions
                    </Typography>
                    <Typography variant="subheading">
                      Using our state of the art Architecture Knowledge Management Software
                    </Typography>
                    <ul className="section-sub-text">
                      <li>Reduce the risk of high-impact decisions on the system</li>
                      <li>Reduce time and effort in implementing new decisions</li>
                    </ul>
                  </Cell>
                  <Cell col={5} style={{ textAlign: 'center' }}>
                    <img src="images/framework.png" width="100%" />
                  </Cell>
                </Grid>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(HomePage);
