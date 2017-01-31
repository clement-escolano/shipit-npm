var utils = require('shipit-utils');

/**
 * Register yarn tasks.
 * - yarn
 * - yarn:install
 * - yarn:run
 */

module.exports = function (gruntOrShipit) {
    var shipit = utils.getShipit(gruntOrShipit);

    require('./init')(gruntOrShipit);
    require('./install')(gruntOrShipit);
    require('./cmd')(gruntOrShipit);

    utils.registerTask(gruntOrShipit, 'yarn:run', [
        'yarn:init',
        'yarn:cmd'
    ]);

    shipit.on('deploy', function () {
        shipit.start('yarn:init');

        shipit.on('yarn_inited', function () {
            if (shipit.config.yarn.triggerEvent) {
                shipit.on(shipit.config.yarn.triggerEvent, function () {
                    shipit.start('yarn:install');
                });
            }
        });
    });
};
