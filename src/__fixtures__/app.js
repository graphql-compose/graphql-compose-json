/* @flow */

import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './Schema';

const PORT = 4000;
const app = express();

app.use(
  '/graphql',
  graphqlHTTP(req => ({
    schema,
    graphiql: true,
    context: req,
  }))
);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT}/graphql`);
});
