const test = require('tape');
const sinon = require('sinon');
const authorizationPlugin = require('./index');
const { setRole, getRoleKey } = require('./index');

test('should get the right role key', t => {
  t.equal(getRoleKey('testRole'), 'testRole');
  t.equal(getRoleKey(), 'role');
  t.end();
});

test('should set the role to an user with a string', t => {
  const user = { scope: 'ADMIN' };

  const newUser = setRole(user, getRoleKey('role'), 'scope', {});

  t.equal(newUser.role, 'ADMIN');
  t.end();
});

test('should set the role to and user with a function', t => {
  const user = { hidden: { scope: 'ADMIN' } };
  const roleFn = user => user.hidden.scope;

  const newUser = setRole(user, getRoleKey('role'), roleFn, {});

  t.equal(newUser.role, 'ADMIN');
  t.end();
});
