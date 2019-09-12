'use strict';

const precond = require('precond');

class BaseError extends Error {
  /**
   * Creates an instance of the BaseError class
   * @param {Object} options - The error options
   * @prop {String} name - The name of the error
   * @prop {Number} code - The error code
   * @prop {String} message - The error message
   */
  constructor(options) {
    const message = precond.checkIsString(options.message);
    super(message);

    this.name = precond.checkIsString(options.name);
    this.code = precond.checkIsNumber(options.code);
  }

  toLambdaJson() {
    const responseBody = {
      name: this.name,
      message: this.message,
    };

    return {
      statusCode: this.code,
      body: JSON.stringify(responseBody)
    };
  }
}

// 400 BadRequestError
class BadRequestError extends BaseError {
  constructor(message) {
    const baseOptions = {
      name: 'BadRequestError',
      code: 400,
      message: message || 'The server could not understand the request.'
    }
    super(baseOptions);
  }
}

// 404 NotFoundError
class NotFoundError extends BaseError {
  constructor(message) {
    const baseOptions = {
      name: 'NotFoundError',
      code: 404,
      message: message || 'The requested resource was not found.'
    };
    super(baseOptions);
  }
}

// 500 Internal Server Error
class InternalServerError extends BaseError {
  constructor(cause, context) {
    const baseOptions = {
      name: 'InternalServerError',
      code: 500,
      message: 'An Internal Server Error has occured.',
      cause,
      context,
    }
    super(baseOptions);
  }
}

module.exports = {
  BaseError,
  BadRequestError,
  NotFoundError,
  InternalServerError,
}