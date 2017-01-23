var utils = require('shipit-utils');
var chalk = require('chalk');
var sprintf = require('sprintf-js').sprintf;
var Bluebird = require('bluebird');
var argv = require('yargs').argv;

/**
 * cmd task allows access to any yarn cli command
 */

module.exports = function (gruntOrShipit) {
  utils.registerTask(gruntOrShipit, 'yarn:cmd', task);

  function task() {
    var shipit = utils.getShipit(gruntOrShipit);

    function cmd(remote) {

      var method = remote ? 'remote' : 'local';
      var cdPath = remote ? shipit.releasePath || shipit.currentPath : shipit.config.workspace;
      var yarnCommand = shipit.config.yarn.useNpm ? 'npm' : 'yarn';

      if(!cdPath) {
        var msg = remote ? 'Please specify a deploy to path (shipit.config.deployTo)' : 'Please specify a workspace (shipit.config.workspace)';
        throw new Error(
          shipit.log(chalk.red(msg))
        );
      }

        if (!argv.cmd && shipit.config.yarn) {
          argv.cmd = shipit.config.yarn.cmd;
        }

      if(!argv.cmd) {
        throw new Error(
          shipit.log(
            chalk.red('Please specify a yarn command eg'),
            chalk.gray('shipit staging yarn:init yarn:cmd'),
            chalk.white('--cmd "update"'),
            chalk.red('\nor'),
            chalk.gray('(in your shipitfile)'),
            chalk.white('yarn: { cmd: \'run build\' }')
          )
        );
      }

      shipit.log('Running - ', chalk.blue('yarn ', argv.cmd));

      return shipit[method](
        sprintf('cd %s && %s %s', cdPath, yarnCommand, argv.cmd)
      );

    }

    if(shipit.yarn_inited) {

      return cmd(shipit.config.yarn.remote)
      .then(function () {
        shipit.log(chalk.green('Complete - yarn ' + argv.cmd));
      })
      .catch(function (e) {
        shipit.log(e);
      });

    }else {
      throw new Error(
        shipit.log(
          chalk.gray('try running yarn:init before yarn:cmd')
        )
      );
    }
  }
};
