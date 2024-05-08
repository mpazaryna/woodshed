Just Another React Starter Project
==================================

A small sample application for teaching React.js

[![NPM version][shield-npm]](#)
[![Build status][travis-build]](#)
[![MIT licensed][shield-license]](#)

Table of Contents
-----------------

  * [Requirements](#requirements)
  * [Usage](#usage)
  * [License](#license)

Requirements
------------

Requires the following to run:

  * [Node.js][node] 0.10+
  * [npm][npm] (normally comes with Node.js)

Usage
-----

```
> $ . ~/.nvm/nvm.sh  
> $ nvm use 5.0  
```

* You'll need to have [git](https://git-scm.com/) and [node](https://nodejs.org/en/) installed in your system.
* Fork and clone the project:

```
> $ git clone https://github.com/wisesmile/another-jarsap.git
```

Then install the dependencies:

```
> $ npm install
```

Install webpack and the development server:

```
> $ npm i webpack-dev-server webpack -g
```

You can simply run webpack build using this command:

```
> $ npm run build
```

If you want to run with webpack-dev-server simply run this command:

```
> $ npm run dev
```

Open the web browser to `http://localhost:8080/`

Contributing
------------

To contribute, clone this repo locally and commit your code on a separate branch. Please
write unit tests for your code, and run the linter before opening a pull-request:

```sh
npm run test  # run all unit tests
npm run lint  # run the linter
```

License
-------

another-jarsap is licensed under the [MIT](#) license.  
Copyright &copy; 2016, Matthew Pazaryna

[node]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[shield-coverage]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg
[shield-license]: https://img.shields.io/badge/license-MIT-blue.svg
[shield-node]: https://img.shields.io/badge/node.js%20support-0.10–5-brightgreen.svg
[shield-npm]: https://img.shields.io/badge/npm-v3.2.0-blue.svg
[travis-build]: https://travis-ci.org/wisesmile/jarsap.svg?branch=master
