# graphql-compose-rest

[![travis build](https://img.shields.io/travis/graphql-compose/graphql-compose-rest.svg)](https://travis-ci.org/graphql-compose/graphql-compose-rest)
[![codecov coverage](https://img.shields.io/codecov/c/github/graphql-compose/graphql-compose-rest.svg)](https://codecov.io/github/graphql-compose/graphql-compose-rest)
[![](https://img.shields.io/npm/v/graphql-compose-rest.svg)](https://www.npmjs.com/package/graphql-compose-rest)
[![npm](https://img.shields.io/npm/dt/graphql-compose-rest.svg)](http://www.npmtrends.com/graphql-compose-rest)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Greenkeeper badge](https://badges.greenkeeper.io/graphql-compose/graphql-compose-rest.svg)](https://greenkeeper.io/)


This is a plugin for [graphql-compose](https://github.com/nodkz/graphql-compose), which derives GraphQLType from REST response. Also derives bunch of internal GraphQL Types.

Installation
============
```
npm install graphql graphql-compose graphql-compose-rest --save
```
Modules `graphql`, `graphql-compose`, are in `peerDependencies`, so should be installed explicitly in your app. They have global objects and should not have ability to be installed as submodule.

License
=======
[MIT](https://github.com/graphql-compose/graphql-compose-rest/blob/master/LICENSE.md)
