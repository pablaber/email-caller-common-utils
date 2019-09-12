'use strict';

const precond = require('precond');
const { BaseError, InternalServerError } = require('./errors');

class LambdaRouterUtils {
  constructor(options) {
    this.logger = precond.checkIsObject(options.logger);
  }

  throwLambdaError(error) {
    if (!(error instanceof BaseError)) {
      const { stack } = error;
      const error = new InternalServerError(error)
      error.stack = stack;
    }
    this.logger.error(error);
    return error.toLambdaJson()
  }
}

module.exports = LambdaRouterUtils;