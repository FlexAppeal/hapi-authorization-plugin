const { setConfig, can, check } = require('flexappeal-acl');

const authorizationPlugin = {
  register: (server, options, next) => {
    const roleKey = options.roleKey ? options.roleKey : 'role';
    setConfig({ actions: options.actions, role: roleKey });

    server.ext('onPostAuth', (req, reply) => {
      const user = req.auth.credentials;
      user[roleKey] = options.role(user, req.params);

      reply.continue({
        credentials: user,
      });
    });

    next();
  },
};

authorizationPlugin.register.attributes = {
  name: 'hapi-acl-plugin',
  version: '0.0.1',
};

module.exports = authorizationPlugin;
module.exports.can = can;
module.exports.check = check;
