'use strict';

const uuid = require('uuid/v4');
const moment = require('moment');
const precond = require('precond');

const CURRENT_VERSION = 'v1.0.0'

/**
 * Model representing data in the user-info dynamodb table
 */
class UserInfoModel {
  /**
   * @constructor
   */
  constructor(options) {
    this.id = precond.checkIsString(options.id);
    this.email = precond.checkIsString(options.email);
    this.created = precond.checkIsString(options.created);
    this.lastUpdated = precond.checkIsString(options.lastUpdated);
    this.version = precond.checkIsString(options.version);
  }

  /**
   * Create a new UserInfoModel instance
   *
   * @param {Object} options
   * @prop {String} [id] - The user id
   * @prop {String} email - The users email
   * @prop {String} [created] - The creation date
   * @prop {String} [lastUpdated] - The last updated date
   * @prop {String} [version] - The version
   */
  static create(options) {
    options.id = options.id || uuid();
    options.created = options.created || moment().utc().format();
    options.lastUpdated = options.lastUpdated || moment().utc().format();
    options.version = options.version || CURRENT_VERSION;

    return new UserInfoModel(options);
  }

  /**
   * Gets the users ID
   * @returns {String} - The id of the user
   */
  getId() {
    return this.id;
  }

  /**
   * Gets the users email
   */
  getEmail() {
    return this.email;
  }

  /**
   * Updates the users email address
   * @param {String} newEmail
   * @returns {UserInfoModel} this for chaining
   */
  setEmail(newEmail) {
    this.email = precond.checkIsString(newEmail);
    this._updateLastUpdated();
    return this;
  }

  _updateLastUpdated() {
    this.lastUpdated = moment().utc().format();
  }
}

module.exports = UserInfoModel;