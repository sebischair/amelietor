import React, { PropTypes, Component} from 'react'
import { FABButton, Button, Icon, List, Textfield, ListItemAction, ListItem, ListItemContent  } from 'react-mdl';

class Alternatives extends Component {

  constructor(props) {
    super(props);
  }

  render(){
    const {alternatives, type} = this.props;
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
                <ListItem key={alt.key}>
                  <ListItemContent icon="label">{alt.title}</ListItemContent>
                  <ListItemAction>
                    <a href={alt.url}><Icon name="delete" /></a>
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
  type: PropTypes.string.isRequired,
  alternatives: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    didInvalidate: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number.isRequired
  }).isRequired

};

export default Alternatives;


