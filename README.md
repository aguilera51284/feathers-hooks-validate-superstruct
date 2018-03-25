# feathers-hooks-validate-superstruct

FeathersJS hook for validating input using superstruct

## Install
```sh
npm install feathers-hooks-validate-superstruct
```

## Usage
```js
const validateSuperstruct = require('feathers-hooks-validate-superstruct');

const app = ...; // feathers app object
const Struct = ...; // superstruct instance

app.service('service-name').hooks({
  before: {
    create: validateSuperstruct(Struct)
  }
});
```
