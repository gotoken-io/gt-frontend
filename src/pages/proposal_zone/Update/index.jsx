import React from 'react';
import ProposalZoneForm from '../components/Form';

const Update = props => <ProposalZoneForm id={props.match.params.id} title="编辑提案专区" />;
export default Update;
