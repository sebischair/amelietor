import React, { PropTypes } from 'react';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';

import s from './Experts.css';

const styles = {
  listItem: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0
  }
};

class CollapseRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.issue !== this.props.issue) {
      this.setState({ open: false });
    }
  }

  toggleRow = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const issue = this.props.issue;
    return (
      <List dense={true} onClick={this.toggleRow} className={s.table__clickable}>
        {issue.predictions.slice(0, this.props.numOfDisplayedExperts).map((pre, indexOfPre) => {
          return (
            <ListItem key={indexOfPre} className={this.props.classes.listItem}>
              <ListItemText primary={pre.personName + ' — ' + pre.score} />
            </ListItem>
          );
        })}
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          {issue.predictions.slice(this.props.numOfDisplayedExperts).map((pre, indexOfPre) => {
            return (
              <ListItem key={indexOfPre} className={this.props.classes.listItem}>
                <ListItemText primary={pre.personName + ' — ' + pre.score} />
              </ListItem>
            );
          })}
        </Collapse>
        {this.state.open ? <ExpandLess /> : <ExpandMore />}
      </List>
    );
  }
}

CollapseRow.propTypes = {
  issue: PropTypes.object.isRequired,
  numOfDisplayedExperts: PropTypes.number.isRequired,
  classes: PropTypes.object
};

export default withStyles(styles)(CollapseRow);
