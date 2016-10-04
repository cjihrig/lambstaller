# lambstaller

[![Current Version](https://img.shields.io/npm/v/lambstaller.svg)](https://www.npmjs.org/package/lambstaller)
[![Build Status via Travis CI](https://travis-ci.org/continuationlabs/lambstaller.svg?branch=master)](https://travis-ci.org/continuationlabs/lambstaller)
![Dependencies](http://img.shields.io/david/continuationlabs/lambstaller.svg)

[![belly-button-style](https://cdn.rawgit.com/continuationlabs/belly-button/master/badge.svg)](https://github.com/continuationlabs/belly-button)

`lambstaller` allows you to run `npm install --production` inside of a Docker container that very closely resembles the AWS Lambda environment. This is useful for installing compiled addons locally, and then deploying to AWS.

## Example

The following example copies the file `'/path/to/package/to/install/package.json'` to the directory `'/directory/to/write/files/to/'` and then runs `npm install --production` inside of an AWS Lambda Docker container.

```javascript
'use strict';
const Lambstaller = require('lambstaller');

Lambstaller({
  out: '/directory/to/write/files/to/',
  pkg: '/path/to/package/to/install/package.json'
}, (err) => {
  // If all went well, err will not exist. The `out` directory will contain a
  // copy of the `pkg` package.json file, and a node_modules directory.
});
```

## API

The function exported by `lambstaller` has the following specification:

  - Arguments
    - `options` (object) - A configuration object supporting the following schema.
      - `pkg` (string) - The path to a `package.json` file. This file will be the target of `npm install --production`.
      - `out` (string) - The directory where the `package.json` file will be copied and the install will occur.
    - `callback` (function) - A function which is called upon completion. This function takes the following arguments.
      - `err` (error) - Represents any error that occurs.
  - Returns
    - Nothing

## Things to be aware of

Because `lambstaller` runs [lambci/lambda:build](https://hub.docker.com/r/lambci/lambda/) image in a child process, you must have Docker installed. More information about the image is available [here](https://github.com/lambci/docker-lambda).

The install process is reflected on your local machine by creating a volume. Therefore, Docker must have access to the local install directory. If Docker does not have access, you may see an error similar to this:

```
Command failed: /bin/sh -c docker run -v "/var/folders/nz/bw4sh4w15bj7_9t2546w3dgh0000gn/T/lambstaller_tests":/var/task lambci/lambda:build npm install --production
docker: Error response from daemon: Mounts denied: mac/osxfs/#namespaces for more info.
.
15bj7_9t2546w3dgh0000gn/T/lambstaller_tests
is not shared from OS X and is not known to Docker.
You can configure shared paths from Docker -> Preferences... -> File Sharing.
See https://docs.docker.com/docker-for-.
```
