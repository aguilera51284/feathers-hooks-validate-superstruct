import test from 'ava';
import feathers from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import { struct } from 'superstruct';

import validateSuperstruct from '../lib';

test('superstruct valid data', async t => {
  const app = feathers();

  let createCalled = false;
  app.use('tests', {
    async create(data) {
      createCalled = true;

      t.deepEqual(data, {
        id: 5,
        someString: 'hello'
      });

      return data;
    }
  });

  const Data = struct({
    id: 'number',
    someString: 'string',
    optionalBool: 'boolean?'
  });

  app.service('tests').hooks({
    before: {
      create: [validateSuperstruct(Data)]
    }
  });

  const createPromise = app.service('tests').create({
    id: 5,
    someString: 'hello'
  });

  await t.notThrows(createPromise);

  t.true(createCalled);
});

test('superstruct invalid data', async t => {
  const app = feathers();

  app.use('tests', {
    async create(data) {
      t.fail('expected service function to not be called');
      return data;
    }
  });

  const Data = struct({
    id: 'number',
    someString: 'string',
    optionalBool: 'boolean?'
  });

  app.service('tests').hooks({
    before: {
      create: [validateSuperstruct(Data)]
    }
  });

  const createPromise = app.service('tests').create({
    id: 'lul',
    wow: 'cool'
  });

  const err = await t.throws(createPromise);

  t.truthy(err instanceof BadRequest);
  t.is(Object.keys(err.errors).length, 3);
});
