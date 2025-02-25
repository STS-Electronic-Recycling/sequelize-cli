import path from 'path';
import process from 'process';

const resolve = require('resolve').sync;
import getYArgs from '../core/yargs';

const args = getYArgs().argv;

const generic = {
  getEnvironment: () => {
    return args.env || process.env.NODE_ENV || 'development';
  },

  getEnvironmentNamespace: () => {
    return args['env-ns'];
  },

  getSequelize: (file) => {
    const resolvePath = file ? path.join('sequelize', file) : 'sequelize';
    const resolveOptions = { basedir: process.cwd() };

    let sequelizePath;

    try {
      sequelizePath = require.resolve(resolvePath, resolveOptions);
    } catch (e) {
      // ignore error
    }

    try {
      sequelizePath = sequelizePath || resolve(resolvePath, resolveOptions);
    } catch (e) {
      console.error('Unable to resolve sequelize package in ' + process.cwd());
      process.exit(1);
    }

    return require(sequelizePath);
  },

  execQuery: (sequelize, sql, options) => {
    if (sequelize.query.length === 2) {
      return sequelize.query(sql, options);
    } else {
      return sequelize.query(sql, null, options);
    }
  },
};

module.exports = generic;
module.exports.default = generic;
