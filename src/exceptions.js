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
module.exports = {ClientError, InvariantError, NotFoundError};