var utils = require('shipit-utils');
var path = require('path');

/**
 * Init task.
 * - Emit yarn_inited event.
 */

module.exports = function (gruntOrShipit) {
    utils.registerTask(gruntOrShipit, 'yarn:init', task);

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
        shipit.config.yarn.useNpm = shipit.config.yarn.useNpm || false;

        var triggerEvent = shipit.config.yarn.remote ? 'updated' : 'fetched';
        shipit.config.yarn.triggerEvent = shipit.config.yarn.triggerEvent !== undefined ? shipit.config.yarn.triggerEvent : triggerEvent;

        shipit.yarn_inited = true;
        shipit.emit('yarn_inited');
    }
};
