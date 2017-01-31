var utils = require('shipit-utils');
var chalk = require('chalk');

/**
 * Runs yarn install
 */

module.exports = function (gruntOrShipit) {
    utils.registerTask(gruntOrShipit, 'yarn:install', task);

    function task() {
        var shipit = utils.getShipit(gruntOrShipit);

        function install(remote) {

            shipit.log('Installing npm modules.');
            var method = remote ? 'remote' : 'local';
            var cdPath = remote ? shipit.releasePath || shipit.currentPath : shipit.config.workspace;
            var yarnCommand = shipit.config.yarn.useNpm ? 'npm' : 'yarn';

            if (!cdPath) {
                var msg = remote
                    ? 'Please specify a path to deploy to (shipit.config.deployTo)'
                    : 'Please specify a workspace (shipit.config.workspace)';
                throw new Error(
                    shipit.log(chalk.red(msg))
                );
            }

            var args = Array.isArray(shipit.config.yarn.installArgs) ? shipit.config.yarn.installArgs.join(' ') : shipit.config.yarn.installArgs;
            var flags = Array.isArray(shipit.config.yarn.installFlags) ? shipit.config.yarn.installFlags.join(' ') : shipit.config.yarn.installFlags;
            var AF = args ? flags ? args.concat(' ', flags) : args : flags ? flags : '';

            var command = 'node -v && cd ' + cdPath + ' && ' + yarnCommand + ' install ' + AF;

            return shipit[method](command);
        }

        if (shipit.yarn_inited) {
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
        } else {
            throw new Error(
                shipit.log(
                    chalk.gray('You should run yarn:init before yarn:install')
                )
            );
        }
    }
};
