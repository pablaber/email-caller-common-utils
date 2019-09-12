'use strict';

const AWS = require('aws-sdk');
const precond = require('precond');

const TABLE_NAME = 'user-info';

const { UserInfoModel } = require('../models');

/**
 * A class to use for accessing items in the user-info dynamo table
 */
class UserInfoDynamoConnector {
  constructor(options) {
    const awsDynamoRegion = precond.checkIsString(options.awsDynamoRegion);
    const awsDynamoEndpoint = precond.checkIsString(options.awsDynamoEndpoint);
    const convertEmptyValues = options.convertEmptyValues === true;

    const dynamoDbConfig = {
      region: awsDynamoRegion,
      endpiont: awsDynamoEndpoint,
    };

    this.dynamoDocumentClient = new AWS.DynamoDB.DocumentClient({
      service: new AWS.DynamoDB(dynamoDbConfig),
      convertEmptyValues,
    });
  }

  /**
   * Finds a user info object by its unique identifier
   * @param {String} id - The unique identifier of the user to find
   * @returns {UserInfoModel} - The user with the supplied unique identifier
   */
  async findById(id) {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': id,
      }
    };

    let docs;
    try {
      docs = await this.dynamoDocumentClient.query(params).promise();
    } catch (err) {
      return { error: err }
    }
    const [doc] = docs.Items;
    if (!doc) {
      return;
    }
    return UserInfoModel.create(doc);
  }

  /**
   * Finds a user info object by its email
   * @param {String} email - The email address of the user to find
   * @returns {UserInfoModel} - THe user with the supplied email address
   */
  async findByEmail(email) {
    const params = {
      TableName: TABLE_NAME,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    }

    let docs;
    try {
      docs = await this.dynamoDocumentClient.query(params).promise();
    } catch (err) {
      return { error: err }
    }
    const [doc] = docs.Items;
    return UserInfoModel.create(doc);
  }

  /**
   * Saves a UserInfoModel to the user-info table
   * @param {UserInfoModel} userInfoModel - the model to save
   * @returns {UserInfoModel} - The saved model
   */
  async save(userInfoModel) {
    precond.checkState(userInfoModel instanceof UserInfoModel);

    const params = {
      TableName: TABLE_NAME,
      Item: userInfoModel,
    };

    try {
      await this.dynamoDocumentClient.put(params).promise();
    } catch (err) {
      return { error: err }
    }

    return userInfoModel;
  }
}

module.exports = UserInfoDynamoConnector;