import React, { PropTypes, Component} from 'react'
import { Button, Textfield, ListItemAction, ListItem, ListItemContent  } from 'react-mdl';
import { connect } from 'react-redux'
import {addAlternative, addSoftware} from '../../core/actions/actions';


class AddAlternative extends Component {

  constructor(props) {
    super(props);

    this.submitAlternative = (href, type) => {
      const {dispatch} = this.props;
      if (!this.refs.textfield.refs.input.value.trim()) {
        return
      }
      switch (type){
        case "software":
          dispatch(addSoftware(href, this.refs.textfield.refs.input.value));
          return true;
        case "alternative":
          dispatch(addAlternative(href, this.refs.textfield.refs.input.value));
          return true;
      }

      this.refs.textfield.refs.input.value = ''
    }
  }

  render(){
    const {type, href} = this.props;
    const inputLabel = "New "+type;
    return (
      <ListItem>
          <ListItemContent icon="label">
            <Textfield
              onChange={() => {}}
              label={inputLabel}
              ref="textfield"
              floatingLabel
              style={{width: '200px', }}
            />
          </ListItemContent>
          <ListItemAction>
            <Button raised colored ripple onClick={(e)=> {e.preventDefault(); this.submitAlternative(href, type)}}> Add new</Button>
          </ListItemAction>
      </ListItem>
    )
  };
}

AddAlternative.propTypes = {
  href: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default connect() (AddAlternative);


