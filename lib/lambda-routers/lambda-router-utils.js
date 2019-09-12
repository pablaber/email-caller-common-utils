'use strict';

const precond = require('precond');
const { BaseError, InternalServerError } = require('./errors');

class LambdaRouterUtils {
  constructor(options) {
    this.logger = precond.checkIsObject(options.logger);
  }

  throwLambdaError(error) {
    if (!(error instanceof BaseError)) {
      error = new InternalServerError(error)
    }
    this.logger.error(error);
    return error.toLambdaJson()
  }
}

module.exports = LambdaRouterUtils;