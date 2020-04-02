import React from 'react';
import ProposalZoneForm from '../components/Form';
import { FormattedMessage } from 'umi-plugin-react/locale';

const Create = () => (
  <ProposalZoneForm title={<FormattedMessage id="proposal_zone.create_zone" />} />
);

export default Create;
