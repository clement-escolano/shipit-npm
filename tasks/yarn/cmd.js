var utils = require('shipit-utils');
var chalk = require('chalk');
var argv = require('yargs').argv;

/**
 * Runs a specified command.
 */

module.exports = function (gruntOrShipit) {
    utils.registerTask(gruntOrShipit, 'yarn:cmd', task);

    function task() {
        var shipit = utils.getShipit(gruntOrShipit);

        function cmd(remote) {
            var method = remote ? 'remote' : 'local';
            var cdPath = remote ? shipit.releasePath || shipit.currentPath : shipit.config.workspace;
            var yarnOrNpm = shipit.config.yarn.command;

            if (!cdPath) {
                var msg = remote
                    ? 'Please specify a path to deploy to (shipit.config.deployTo)'
                    : 'Please specify a workspace (shipit.config.workspace)';
                throw new Error(
                    shipit.log(chalk.red(msg))
                );
            }

            if (!argv.cmd && shipit.config.yarn) {
                argv.cmd = shipit.config.yarn.cmd;
            }

            if (!argv.cmd) {
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

            shipit.log('Running -', chalk.blue(yarnOrNpm, argv.cmd));

            var command = 'cd ' + cdPath + ' && ' + yarnOrNpm + ' ' + argv.cmd;

            return shipit[method](command);
        }

        if (shipit.yarn_inited) {
            return cmd(shipit.config.yarn.remote)
                .then(function () {
                    shipit.log('Complete -', chalk.green(shipit.config.yarn.command, argv.cmd));
                })
                .catch(function (e) {
                    shipit.log(chalk.red(e));
                });
        } else {
            throw new Error(
                shipit.log(
                    chalk.gray('You should run yarn:init before yarn:cmd')
                )
            );
        }
    }
};
