var utils = require('shipit-utils');
var path = require('path');
var chalk = require('chalk');

/**
 * Init task.
 * - Emit yarn_inited event.
 */

module.exports = function (gruntOrShipit) {
    utils.registerTask(gruntOrShipit, 'yarn:init', task);

    function initYarnOrNpm(command) {
        var shipit = utils.getShipit(gruntOrShipit);

        shipit.log(chalk.green("Chosen package manager:", command));
        shipit.config.yarn.command = command;
        shipit.yarn_inited = true;
        shipit.emit('yarn_inited');
    }

    function checkCommand(method, command, onError) {
        var shipit = utils.getShipit(gruntOrShipit);

        return shipit[method]('command -v ' + command + ' >/dev/null 2>&1')
            .then(function () { initYarnOrNpm(command); })
            .catch(onError);
    }

    function findBestCommand(method) {
        var shipit = utils.getShipit(gruntOrShipit);
        shipit.log(chalk.blue('Checking best available package manager on', method));

        return checkCommand(method, 'yarn', function () {
            return checkCommand(method, 'npm', function () {
                throw new Error(
                    shipit.log(chalk.red('Neither Yarn nor NPM is installed on', method))
                );
            });
        });
    }

    function task() {
        var shipit = utils.getShipit(gruntOrShipit);

        shipit.config = shipit.config || {};
        shipit.releasePath = shipit.releasePath || undefined;
        shipit.config.deployTo = shipit.config.deployTo || undefined;
        shipit.config.workspace = shipit.config.workspace || undefined;
        shipit.currentPath = shipit.config.deployTo ? path.join(shipit.config.deployTo, 'current') : undefined;
        shipit.config.yarn = shipit.config.yarn || {};
        shipit.config.yarn.remote = shipit.config.yarn.remote !== false;
        shipit.config.yarn.installArgs = shipit.config.yarn.installArgs || [];
        shipit.config.yarn.installFlags = shipit.config.yarn.installFlags || [];

        var triggerEvent = shipit.config.yarn.remote ? 'updated' : 'fetched';
        shipit.config.yarn.triggerEvent = shipit.config.yarn.triggerEvent !== undefined ? shipit.config.yarn.triggerEvent : triggerEvent;

        var method = shipit.config.yarn.remote ? 'remote' : 'local';

        shipit.config.yarn.yarnOrNpm = shipit.config.yarn.yarnOrNpm || 'yarn';

        if (shipit.config.yarn.yarnOrNpm !== 'best') {
            return initYarnOrNpm(shipit.config.yarn.yarnOrNpm);
        }

        return findBestCommand(method);
    }
};
