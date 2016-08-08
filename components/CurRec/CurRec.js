import { connect } from 'react-redux'
import Rec from '../Rec'

const mapHrefToProps = (props) => {
  return {
    href: props.recs.href
  }
};

const curRec = connect(
  mapHrefToProps
)(Rec);

export default curRec
