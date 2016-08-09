import React, { PropTypes, Component} from 'react'
import ReactDOM from 'react-dom';

import { Card, CardText, Tab, Tabs } from 'react-mdl';

import s from './Rec.css';

export default class Rec extends Component {

  constructor(props) {
    super(props)
    this.state = { activeTab: 2 };
  }

  render(){
    return (
      <Card shadow={0} style={{width: '512px', margin: 'auto'}}>
        <Tabs activeTab={this.state.activeTab} onChange={(tabId) => this.setState({ activeTab: tabId })} ripple>
          <Tab>Meta</Tab>
          <Tab>Alternatives</Tab>
          <Tab>Software solutions</Tab>
        </Tabs>
        <CardText style={{color: '#000', fontSize: '14px', fontWeight: '100'}}>
          <section>
            <div className="content"> {this.state.activeTab} {this.props.info}</div>
          </section>
        </CardText>
      </Card>
    )
  };
}

Rec.propTypes = {
  info: PropTypes.string.isRequired,
};


//<div className={`demo-card-square mdl-card mdl-shadow--2dp ${s.recommendation}`}>
//  <div className="mdl-card__supporting-text">
//    {this.props.info}
//  </div>
//  <div className="mdl-card__actions mdl-card--border">
//    <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
//      Details
//    </a>
//  </div>
//</div>

