const Boom = require('boom');
const { setConfig, can, check } = require('flexappeal-acl');

const getRoleKey = (roleKey) => {
  return roleKey ? roleKey : 'role';
}

const setRole = (user, roleKey, role, params) => {
  const userRole = typeof role === 'string' ? user[role] : role(user, params);
  if (user) user[roleKey] = userRole;

  return user;
};

const authorizationPlugin = {
  register: (server, options, next) => {
    const roleKey = getRoleKey(options.roleKey);
    setConfig({ actions: options.actions, role: roleKey });

    server.ext('onPostAuth', (req, reply) => {
      try {
        const user = setRole(req.auth.credentials, roleKey, options.role, req.params);
        if (!user) return reply.continue();

        reply.continue({ credentials: user });
      } catch (err) {
        console.log(`Authorization plugin error: ${err}`);
        reply.continue();
      };
    });

    next();
  },
};

authorizationPlugin.register.attributes = {
  name: 'flex-hapi-authorization-plugin',
  version: '0.0.1',
};

module.exports = authorizationPlugin;
module.exports.can = can;
module.exports.check = (user, action, itemToValidate, errMessage) => {
  if (itemToValidate && itemToValidate.isBoom) throw itemToValidate;

  try {
    check(user, action, itemToValidate, errMessage);

    return itemToValidate;
  } catch (err) {
    throw Boom.forbidden(errMessage || err);
  }
}
module.exports.setRole = setRole;
module.exports.getRoleKey = getRoleKey;
