import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {
  ApolloClient,
  gql,
  graphql,
  ApolloProvider,
} from 'react-apollo';
const client = new ApolloClient();

const ChannelsList = ({data: {loading, error, channels}}) => {

  if (loading) {
    return <p>Loading</p>;
  }
  if (error) {
    return <p>{ error.message }</p>;
  }

  return (
    <ul>
      {
        channels.map((channel) => {
          return (
            <li key={ channel.id }>{ channel.name }</li>
          );
        })
      }
    </ul>
  );
};

const channelsListQuery = gql`
 query ChannelsListQuery {
   channels {
     id
     name
   }
 }
`;

const ChannelsListWithData = graphql(channelsListQuery)(ChannelsList);

class App extends Component {

  render() {
    return (

      <ApolloProvider client={client}>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
          </div>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <ChannelsListWithData />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
