/* @flow */

import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './Schema';

const PORT = 4000;
const app = express();

app.use(
  '/graphql',
  (graphqlHTTP(req => ({
    schema,
    graphiql: true,
    context: req,
  })): any)
);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);   //eslint-disable-line
  console.log(`Open http://localhost:${PORT}/graphql`);  //eslint-disable-line
});
