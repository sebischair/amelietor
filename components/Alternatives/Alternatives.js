import React, { PropTypes, Component} from 'react'
import { Icon, List, ListItemAction, ListItem, ListItemContent  } from 'react-mdl';
import { connect } from 'react-redux'
import {deleteSoftwareSolution, deleteAlternative} from '../../core/actions/actions';
import AddAlternative from '../AddAlternative'

class Alternatives extends Component {

  constructor(props) {
    super(props);

    this.deleteItem = (href, token) => {
      const {dispatch, type} = this.props;
      switch (type){
        case "software":
          dispatch(deleteSoftwareSolution(href,token));
          return true;
        case "alternative":
          dispatch(deleteAlternative(href,token));
          return true;
      }
    }
  }

  render(){
    const {alternatives, type, href} = this.props;
    return (
        <section>
          <div className={`content`}>
            <List style={{padding: 0}}>
              <AddAlternative type={type} href={href}/>
              {alternatives.data.map((alt, i) =>
                <ListItem key={i}>
                  <ListItemContent icon="label">{alt.title}</ListItemContent>
                  <ListItemAction>
                      <a href="#" onClick={e => { e.preventDefault(); this.deleteItem(href, alt.title) }}>
                        <Icon name="delete"/>
                      </a>
                  </ListItemAction>
                </ListItem>
                )}
            </List>
          </div>
        </section>
    )
  };
}

Alternatives.propTypes = {
  href: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  alternatives: PropTypes.shape({
    data: PropTypes.array,
    isFetching: PropTypes.bool.isRequired,
    didInvalidate: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number
  }).isRequired

};

export default connect() (Alternatives);


