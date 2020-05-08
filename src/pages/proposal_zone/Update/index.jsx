import React from 'react';
import ProposalZoneForm from '../components/Form';
import { FormattedMessage } from 'umi-plugin-react/locale';

const Update = props => (
  <ProposalZoneForm
    id={props.match.params.id}
    title={<FormattedMessage id="proposal_zone.edit_zone" />}
  />
);
export default Update;
