import { gql } from "@apollo/client";

export const CONTRACT_QUERY_BY_OWNER = gql`
  query ContractQueryByOwner($owner: String!) {
    zoraCreateContracts(where: { owner: $owner }) {
      address
      block
      contractStandard
      contractURI
      contractVersion
      createdAtBlock
      creator
      id
      initialDefaultAdmin
      likelyIsEdition
      metadataIPFSID
      mintFeePerQuantity
      name
      owner
      timestamp
      rendererContract
      metadata {
        name
        image
        id
        description
        decimals
        animationUrl
      }
    }
  }
`;
