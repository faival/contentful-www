// import { schema } from './schema';
'use strict'

const cors = require('cors');
const port = process.env.PORT || 4000;
const spaceId = process.env.SPACE_ID || 'zeucqps1gvy2';
const accessToken = process.env.accessToken || 'CFPAT-f6d09be48946cb780ea44f8eb65632c45afe9364f3633c9bf29ad3a93fc57228';
const cdaToken = process.env.CDA_TOKEN || 'd1601d33e32a4fdf856fd5a3582cddb3064a0d8a67666ddf5af43fc32a26fc6e';
const cmaToken = process.env.CMA_TOKEN || 'a32d52ae0e263f2e480e9b0c06c4841a2bc9dd4a847e5698fda730b7a4fad6ce';
const cfGraphql = require('cf-graphql');
const graphqlHTTP = require('express-graphql');
const express = require('express');
// import express from 'express';

const client = cfGraphql.createClient({
  spaceId: spaceId,
  accessToken: cdaToken,
  // cdaToken: cdaToken,
  // cmaToken: cmaToken
});

client.getContentTypes()
  .then(cfGraphql.prepareSpaceGraph)
  .then(spaceGraph => {
    const names = spaceGraph.map(ct => ct.names.type).join(', ');
    console.log(`Contentful content types prepared: ${names}`);
    return spaceGraph;
  })
  .then(cfGraphql.createSchema)
  .then(schema => startServer(client, schema))
  .catch(fail);

function startServer (client, schema) {
  const app = express();
  app.use(cors());

  const ui = cfGraphql.helpers.graphiql({title: 'cf-graphql demo'});
  app.get('/', (_, res) => res.set(ui.headers).status(ui.statusCode).end(ui.body));

  const opts = {version: true, timeline: true, detailedErrors: false};
  const ext = cfGraphql.helpers.expressGraphqlExtension(client, schema, opts);
  app.use('/graphql', graphqlHTTP(ext));

  app.listen(port);
  console.log(`Running a GraphQL server, listening on ${port}`);
}

function fail (err) {
  console.log(err);
  process.exit(1);
}


// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
