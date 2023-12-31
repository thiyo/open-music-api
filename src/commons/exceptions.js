class ClientError extends Error {
    constructor(message, statusCode = 400){
        super(message);
        this.statusCode = statusCode;
        this.name = 'ClientError';
    }
}

class InvariantError extends ClientError{
    constructor(message){
        super(message);
        this.name = 'InvariantError';
    }
}

class NotFoundError extends ClientError{
    constructor(message){
        super(message, 404);
        this.name = 'NotFoundError';
    }
}


class ForbiddenError extends ClientError {
    constructor(message) {
      super(message, 403);
      this.name = 'ForbiddenError';
    }
  }

class AuthenticationError extends ClientError{
    constructor(message){
        super(message, 401);
        this.name = 'AuthenticationError'
    }
}

class AuthorizationError extends ClientError {
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = {ClientError, InvariantError, NotFoundError, ForbiddenError, AuthenticationError, AuthorizationError};