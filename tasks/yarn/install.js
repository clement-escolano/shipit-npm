var utils = require('shipit-utils');
var chalk = require('chalk');
var sprintf = require('sprintf-js').sprintf;
var Bluebird = require('bluebird');

/**
 * Runs yarn install
 */

module.exports = function (gruntOrShipit) {
  utils.registerTask(gruntOrShipit, 'yarn:install', task);

  function task() {
    var shipit = utils.getShipit(gruntOrShipit);

    function install(remote) {

      shipit.log('Installing yarn modules.');
      var method = remote ? 'remote' : 'local';
      var cdPath = remote ? shipit.releasePath || shipit.currentPath : shipit.config.workspace;

      if(!cdPath) {
        var msg = remote ? 'Please specify a deploy to path (shipit.config.deployTo)' : 'Please specify a workspace (shipit.config.workspace)'
        throw new Error(
          shipit.log(chalk.red(msg))
        );
      }

      var args = Array.isArray(shipit.config.yarn.installArgs) ? shipit.config.yarn.installArgs.join(' ') : shipit.config.yarn.installArgs;
      var flags = Array.isArray(shipit.config.yarn.installFlags) ? shipit.config.yarn.installFlags.join(' ') : shipit.config.yarn.installFlags;
      var AF = args ? flags ? args.concat(' ',flags) : args : flags ? flags : '';

      return shipit[method](
        sprintf('node -v && cd %s && yarn install %s', cdPath, AF)
      );

    }

    if(shipit.yarn_inited) {

      return install(shipit.config.yarn.remote)
      .then(function () {
        shipit.log(chalk.green('yarn install complete'));
      })
      .then(function () {
        shipit.emit('yarn_installed')
      })
      .catch(function (e) {
        shipit.log(chalk.red(e));
      });

    }else {
      throw new Error(
        shipit.log(
          chalk.gray('try running yarn:init before yarn:install')
        )
      );
    }
  }
};
