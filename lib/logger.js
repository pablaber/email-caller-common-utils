'use strict';

class Logger {
  constructor(config) {
    this.debugging = config.app.debug;
  }

  info(message) {
    const messageObject = this._convertMessageToObject(message);
    console.log(messageObject);
  }

  debug(message) {
    if (this.debugging) {
      const messageObject = this._convertMessageToObject(message);
      console.log(messageObject);
    }
  }

  error(message) {
    const messageObject = this._convertMessageToObject(message);
    console.log({ error: messageObject });
  }

  _convertMessageToObject(message) {
    if (typeof message === 'object') {
      return message;
    } else {
      return { message }
    }
  }
}

module.exports = Logger;