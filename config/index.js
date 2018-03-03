var nconf = require('nconf');
var path = require('path');

nconf.argv()
  .env()
  .file({ file: path.join(__dirname, 'config.json' )});

nconf.set('mongoose:uri', process.env.DATABASE_URL);
nconf.set('e-mail', process.env.EMAIL);
nconf.set('mailer:auth:user', process.env.EMAIL_USER);
nconf.set('mailer:auth:pass', process.env.EMAIL_PASS);
nconf.set('session:secret', process.env.SESSION_SECRET_KEY);
nconf.set('session:key', process.env.SESSION_KEY);

module.exports = nconf;
