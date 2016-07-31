import { connect } from 'react-redux'
import Rec from '../Rec'

const mapHrefToProps = (props) => {
  console.log(props);
  return {
    href: props.href
  }
};

const curRec = connect(
  mapHrefToProps
)(Rec);

export default curRec
