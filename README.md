# synology-image-sort

Simple NodeJs CLI tool to sort (media) files on a synology nas.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/synology-image-sort.svg)](https://npmjs.org/package/synology-image-sort)
[![Downloads/week](https://img.shields.io/npm/dw/synology-image-sort.svg)](https://npmjs.org/package/synology-image-sort)
[![License](https://img.shields.io/npm/l/synology-image-sort.svg)](https://github.com/afinkndreas/synology-image-sort/blob/master/package.json)

<!-- toc -->
* [synology-image-sort](#synology-image-sort)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g synology-image-sort
$ synology-image-sort COMMAND
running command...
$ synology-image-sort (-v|--version|version)
synology-image-sort/1.0.3 darwin-x64 node-v12.13.1
$ synology-image-sort --help [COMMAND]
USAGE
  $ synology-image-sort COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`synology-image-sort help [COMMAND]`](#synology-image-sort-help-command)
* [`synology-image-sort move`](#synology-image-sort-move)
* [`synology-image-sort watch`](#synology-image-sort-watch)

## `synology-image-sort help [COMMAND]`

display help for synology-image-sort

```
USAGE
  $ synology-image-sort help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `synology-image-sort move`

sort files from the source directory

```
USAGE
  $ synology-image-sort move

OPTIONS
  -d, --destination=destination  (required) destination directory
  -e, --existing=existing        (required) existing directory
  -f, --format=format            [default: YYYY/MM.YYYY/DD.MM.YYYY] folder structure
  -h, --help                     show CLI help
  -n, --name=name                [default: DD.MM.YYYY-HH.mm.ss.SSS] file name
  -s, --source=source            (required) source directory
  -t, --tags                     enable tagging for media files. adds parent folder names as exif-tags
  -u, --unknown=unknown          (required) unknown directory

EXAMPLES
  $ synology-image-sort move -s ./source -d ./destination -u ./unknown -e ./existing
  $ synology-image-sort move -s ./source -d ./destination -u ./unknown -e ./existing -t
  $ synology-image-sort move -s ./source -d ./destination -u ./unknown -e ./existing -f YYYY/MM.YYYY/DD.MM.YYYY
  $ synology-image-sort move -s ./source -d ./destination -u ./unknown -e ./existing -n DD.MM.YYYY-HH.mm.ss.SSS
```

_See code: [src/commands/move.ts](https://github.com/afinkndreas/synology-image-sort/blob/v1.0.3/src/commands/move.ts)_

## `synology-image-sort watch`

watch for files in the source directory to be sorted. keep in mind that it is not recommended for folders with a huge amount of files.

```
USAGE
  $ synology-image-sort watch

OPTIONS
  -d, --destination=destination  (required) destination directory
  -e, --existing=existing        (required) existing directory
  -f, --format=format            [default: YYYY/MM.YYYY/DD.MM.YYYY] folder structure
  -h, --help                     show CLI help
  -n, --name=name                [default: DD.MM.YYYY-HH.mm.ss.SSS] file name
  -s, --source=source            (required) source directory
  -t, --tags                     enable tagging for media files. adds parent folder names as exif-tags
  -u, --unknown=unknown          (required) unknown directory

EXAMPLES
  $ synology-image-sort watch -s ./source -d ./destination -u ./unknown -e ./existing
  $ synology-image-sort watch -s ./source -d ./destination -u ./unknown -e ./existing -t
  $ synology-image-sort watch -s ./source -d ./destination -u ./unknown -e ./existing -f YYYY/MM.YYYY/DD.MM.YYYY
  $ synology-image-sort watch -s ./source -d ./destination -u ./unknown -e ./existing -n DD.MM.YYYY-HH.mm.ss.SSS
```

_See code: [src/commands/watch.ts](https://github.com/afinkndreas/synology-image-sort/blob/v1.0.3/src/commands/watch.ts)_
<!-- commandsstop -->
