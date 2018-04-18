import React from 'react';
import {Table, TableHeader} from 'react-mdl';
import s from './SimilarDocuments.css';

class SimilarDocuments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {similarDocuments: []};
  }

  componentDidMount() {
    this.setState({similarDocuments: this.props.similarDocuments});
  }

  render() {
    return (
      <Table sortable rowKeyColumn="name" shadow={0} rows={this.props.similarDocuments} className={`${s.customWidth} similar-documents`}>
        <TableHeader name="name" tooltip="Design decision">Design Decision</TableHeader>
        <TableHeader name="summary" tooltip="Summary">Summary</TableHeader>
        <TableHeader name="cosinesimilarity" tooltip="Cosine Similarity"
                     sortFn={(a, b, isAsc) => (isAsc ? a : b).localeCompare((isAsc ? b : a))}>Cosine Similarity</TableHeader>
        <TableHeader name="jaccardsimilarity" tooltip="Jaccard Similarity"
                     sortFn={(a, b, isAsc) => (isAsc ? a : b).localeCompare((isAsc ? b : a))}>Jaccard Similarity</TableHeader>
      </Table>
    );
  }
}

export default SimilarDocuments;
