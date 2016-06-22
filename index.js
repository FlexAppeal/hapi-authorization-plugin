const { setConfig, can, check } = require('flex-authorization');

const authorizationPlugin = {
  register: (server, options, next) => {
    const roleKey = options.roleKey ? options.roleKey : 'role';
    setConfig({ actions: options.actions, role: roleKey });

    server.ext('onPostAuth', (req, reply) => {
      const user = req.auth.credentials;
      user.set(roleKey, options.role(user, req.params));

      reply.continue({
        credentials: user,
      });
    });

    next();
  },
};

authorizationPlugin.register.attributes = {
  name: 'flex-hapi-authorization',
  version: '0.0.1',
};

module.exports = authorizationPlugin;
module.exports.can = can;
module.exports.check = check;
