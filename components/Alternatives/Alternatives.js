import React, { PropTypes, Component} from 'react'
import { FABButton, Button, Icon, List, Textfield, ListItemAction, ListItem, ListItemContent  } from 'react-mdl';
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
    const inputLabel = "New "+type;
    return (
        <section>
          <div className="content">
            <List style={{padding: 0}}>
              {/*<ListItem>*/}
                {/*<ListItemContent icon="label">*/}
                  {/*<Textfield*/}
                    {/*onChange={() => {}}*/}
                    {/*label={inputLabel}*/}
                    {/*floatingLabel*/}
                    {/*style={{width: '200px', }}*/}
                  {/*/>*/}
                {/*</ListItemContent>*/}
                {/*<ListItemAction>*/}
                  {/*<Button raised colored ripple> Add new</Button>*/}
                {/*</ListItemAction>*/}
              {/*</ListItem>*/}
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
    data: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    didInvalidate: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number.isRequired
  }).isRequired

};

export default connect() (Alternatives);


