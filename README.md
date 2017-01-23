# shipit-yarn

A set of tasks for [Shipit](https://github.com/shipitjs/shipit) used for
[yarn](https://yarnpkg.com) specific tasks on deploy.

Heavily inspired by the [shipit-npm](https://github.com/callerc1/shipit-npm)
extension by callerc1.


**Features:**

- Triggered on the `updated` or `fetched` event from [shipit-deploy](https://github.com/shipitjs/shipit-deploy)
- Has a direct pass though task to [yarn cli](https://yarnpkg.com/en/docs/cli/)
- Works via [shipit-cli](https://github.com/shipitjs/shipit) and [grunt-shipit](https://github.com/shipitjs/grunt-shipit)

## Install

```
npm install shipit-yarn --save-dev
```

## Usage

Run: (This triggers the `yarn` task on the deploy `updated` or
`fetched` event. No additional config necessary.)

```
shipit staging deploy
```

Or you can run the tasks separatly :

```
shipit staging yarn:init yarn:install
shipit staging yarn:run --cmd "update"
```


## Options `shipit.config.yarn`

### `yarn.remote`

Type: `Boolean`
Default: `true`

A Boolean to determine whether to run the task in local workspace or on the
remote.

### `yarn.installArgs`

Type: `Array` or `String`
Default: []

An array or string specifying yarn args passed to the
[yarn install](https://yarnpkg.com/en/docs/cli/install) cmd.

### `yarn.installFlags`

Type: `Array` or `String`
Default: []

An array or string specifying yarn flags passed to the
[yarn install](https://yarnpkg.com/en/docs/cli/install) cmd.

### `yarn.triggerEvent`

Type: `String`,`Boolean`
Default: `updated` or `fetched` (depending on `yarn.remote` value)

An event name that triggers `yarn:install`. Can be set to false to prevent the
`yarn:install` task from listening to any events.
[yarn install](https://yarnpkg.com/en/docs/cli/install) cmd.

### `yarn.useNpm`

Type: `Boolean`
Default: `false`

A Boolean to determine whether the npm command should be used instead of yarn.
This is particularly useful when yarn is not available on all servers.

### `yarn.cmd`

Type: `String`
Default: `''` (empty string)

A string specifying the command to be run by the 
[yarn:cmd](https://github.com/clement-escolano/shipit-yarn#workflow-tasks) 
task (e.g. `'run build'`) **overridden if the `--cmd` argument is set on the command line**.


### Example `shipitfile.js` options usage

```js
module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
  require('shipit-yarn')(shipit);

  shipit.initConfig({
    default: {
      yarn: {
        remote: true,
        installFlags: ['--production']
      }
    }
  });
};
```

## Workflow tasks

- yarn
  - yarn:init
      - Emit event "yarn_inited".
  - yarn:install
    - Runs yarn install (with any Args `yarn.installArgs` or Flags
      `yarn.installFlags` defined in options)
    - Emit event "yarn_installed"
  - yarn:run
      - Runs yarn command.

##### Event flow:

- on Event "deploy" (shipit-deploy initialized)
  - Runs *yarn:init*
  - on Event "yarn_inited"
    - Runs *yarn:install* (Triggered on the `updated` or `fetched` event from
      [shipit-deploy](https://github.com/shipitjs/shipit-deploy) or by a custom
      `yarn.triggerEvent` as mentioned above.)

## License

MIT
