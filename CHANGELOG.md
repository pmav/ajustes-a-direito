# Change Log
All notable [changes](http://keepachangelog.com/) to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org/).

## [1.0.0][unreleased]
### Changed
- Vagrant file box: from ``ubuntu/trusty64``to ``phusion/ubuntu-14.04-amd64`` (run ``vagrant destroy`` and ``vagrant up`` to refresh your setup).
- Code moved to ``/src``.

### Added
- Config file: ``/config.js``.
- Documents directory: ``/docs``.
- NPM package file: ``package.json`` (run ``npm install`` inside ``/vagrant`` to download dependencies).

### Fixed
- Auto start docker containers.

### Removed
- ``/node_modules`` from versioning.
