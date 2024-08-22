import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/71916/zora/version/latest", // Replace with your GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client;
