import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {Table, TableHeader} from 'react-mdl';
import s from './SimilarDocuments.css';
import { fetchSimilarDDs } from '../../core/actions/scactions';

class SimilarDocuments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {similarDocuments: []};
  }

  componentDidMount() {
    this.props.dispatch(fetchSimilarDDs(this.props.issueKey)).then(sdds => {
      this.setState({ similarDocuments: sdds.similarDDs});
    });
  }

  render() {
    return (
      <div>
      {this.state.similarDocuments && this.state.similarDocuments.length > 0 &&
        <Table sortable rowKeyColumn="name" shadow={0} rows={this.state.similarDocuments}
               className={`${s.similarityTable} similar-documents`}>
          <TableHeader name="name" tooltip="Design decision">Design Decision</TableHeader>
          <TableHeader name="summary" tooltip="Summary">Summary</TableHeader>
          <TableHeader name="cosinesimilarity" tooltip="Cosine Similarity"
                       sortFn={(a, b, isAsc) => (isAsc ? a : b).localeCompare((isAsc ? b : a))}>Cosine
            Similarity</TableHeader>
          <TableHeader name="jaccardsimilarity" tooltip="Jaccard Similarity"
                       sortFn={(a, b, isAsc) => (isAsc ? a : b).localeCompare((isAsc ? b : a))}>Jaccard
            Similarity</TableHeader>
        </Table> }
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { selectedDD, selectedProject } = state.screcs;
  return { selectedDD, selectedProject };
};

SimilarDocuments.propTypes = {
  issueKey: PropTypes.string.isRequired,
  selectedProject: PropTypes.object,
  selectedDD: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(SimilarDocuments);
