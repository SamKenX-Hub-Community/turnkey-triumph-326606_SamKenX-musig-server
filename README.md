# @arkecosystem/multisig-server

<p align="center">
    <img src="https://raw.githubusercontent.com/ARKEcosystem/multisig-server/master/banner.png" />
</p>

[![Latest Version](https://badgen.now.sh/npm/v/@arkecosystem/multisig-server)](https://www.npmjs.com/package/@arkecosystem/multisig-server)
[![Node Engine](https://badgen.now.sh/npm/node/@arkecosystem/multisig-server)](https://www.npmjs.com/package/@arkecosystem/multisig-server)
[![Build Status](https://badgen.now.sh/circleci/github/ArkEcosystem/multisig-server)](https://circleci.com/gh/ArkEcosystem/multisig-server)
[![Codecov](https://badgen.now.sh/codecov/c/github/ArkEcosystem/multisig-server)](https://codecov.io/gh/ArkEcosystem/multisig-server)
[![License: MIT](https://badgen.now.sh/badge/license/MIT/green)](https://opensource.org/licenses/MIT)

## Installation

```bash
yarn global add @arkecosystem/multisig-server-cli
```

## Usage

> All commands support a `-h` flag to show help for the specified command.

```sh
$ multisig-server
A server for helping building multi-signatures transactions.

VERSION
  @arkecosystem/multisig-server-cli/1.0.0 linux-x64 node-v11.15.0

USAGE
  $ multisig-server [COMMAND]

COMMANDS
  autocomplete  display autocomplete installation instructions
  command
  commands      list all the commands
  help          display help for multisig-server
  log           Show the log
  restart       Restart the MultiSignature server
  run           Run the MultiSignature server (without pm2)
  start         Start the MultiSignature server
  status        Show the MultiSignature server status
  stop          Stop the MultiSignature server
  update        Update the MultiSignature server installation
```

### `start`

> Start the MultiSignature server

```sh
multisig-server start
```

| Flag       | Description                                    | Default | Required |
| ---------- | ---------------------------------------------- | ------- | -------- |
| --host=    | the host that should be used to expose the API | 0.0.0.0 | No       |
| --port=    | the port that should be used to expose the API | 8008    | No       |
| --network= | the Network on which the server will be used   | testnet | No       |

### `restart`

> Restart the MultiSignature server

```sh
multisig-server restart
```

### `stop`

> Stop the MultiSignature server

```sh
multisig-server stop
```

| Flag   | Description                | Default | Required |
| ------ | -------------------------- | ------- | -------- |
| --kill | kill the process or daemon | n/a     | No       |

### `run`

> Run the MultiSignature server without pm2 **(exits on CTRL+C)**

```sh
multisig-server run
```

| Flag       | Description                                    | Default | Required |
| ---------- | ---------------------------------------------- | ------- | -------- |
| --host=    | the host that should be used to expose the API | 0.0.0.0 | No       |
| --port=    | the port that should be used to expose the API | 8008    | No       |
| --network= | the Network on which the server will be used   | testnet | No       |

### `status`

> Show the MultiSignature server status

```sh
multisig-server status
```

### `update`

> Update the MultiSignature server installation

```sh
multisig-server update
```

### `log`

> Show the log

```sh
multisig-server log
```

| Flag     | Description             | Default | Required |
| -------- | ----------------------- | ------- | -------- |
| --error= | only show error output  | n/a     | No       |
| --lines= | number of lines to tail | 15      | No       |

## Security

If you discover a security vulnerability within this package, please send an e-mail to security@ark.io. All security vulnerabilities will be promptly addressed.

## Credits

This project exists thanks to all the people who [contribute](../../contributors).

## License

[MIT](LICENSE) © [ARK Ecosystem](https://ark.io)
