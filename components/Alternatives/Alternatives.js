import React, { PropTypes, Component} from 'react'
import { FABButton, Button, Icon, List, Textfield, ListItemAction, ListItem, ListItemContent  } from 'react-mdl';
import { connect } from 'react-redux'
import {deleteSoftwareSolution} from '../../core/actions';


class Alternatives extends Component {

  constructor(props) {
    super(props);

    this.deleteSoftware = (href, token) => {
      const {dispatch} = this.props;
      dispatch(deleteSoftwareSolution(href,token));
    }
  }



  render(){
    const {alternatives, type, href} = this.props;
    const inputLabel = "New "+type;
    return (
        <section>
          <div className="content">
            <List style={{padding: 0}}>
              <ListItem>
                <ListItemContent icon="label">
                  <Textfield
                    onChange={() => {}}
                    label={inputLabel}
                    floatingLabel
                    style={{width: '200px', }}
                  />
                </ListItemContent>
                <ListItemAction>
                  <Button raised colored ripple> Add new</Button>
                </ListItemAction>
              </ListItem>
              {alternatives.data.map((alt, i) =>
                <ListItem key={i}>
                  <ListItemContent icon="label">{alt.title}</ListItemContent>
                  <ListItemAction>
                    <a href="#" onClick={this.deleteSoftware(href, alt.title)}><Icon name="delete"/></a>
                    {/*<a href={alt.url}><Icon name="delete"/></a>*/}
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


