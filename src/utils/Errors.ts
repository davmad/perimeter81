import { Request, Response, NextFunction } from "express";

export abstract class HTTPError extends Error {
  readonly statusCode!: number;
  readonly name!: string;

  constructor(message: object | string) {
    if (message instanceof Object) {
      super(JSON.stringify(message));
    } else {
      super(message);
    }
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HTTP400Error extends HTTPError {
  readonly statusCode = 400;

  constructor(message: string | object = "Bad Request") {
    super(message);
  }
}

export class HTTP401Error extends HTTPError {
  readonly statusCode = 401;

  constructor(message: string | object = "Unauthorized") {
    super(message);
  }
}

export class HTTP403Error extends HTTPError {
  readonly statusCode = 403;

  constructor(message: string | object = "Forbidden") {
    super(message);
  }
}

export class HTTP404Error extends HTTPError {
  readonly statusCode = 404;

  constructor(message: string | object = "Not found") {
    super(message);
  }
}

export class HTTP409Error extends HTTPError {
  readonly statusCode = 409;

  constructor(message: string | object = "Conflict") {
    super(message);
  }
}

export const notFoundError = (req: Request, res: Response, next: NextFunction) => {
  throw new HTTP404Error("Method not found.");
};

export const responseError = (err: ITopLevelError, res: Response, next: NextFunction) => {
  if (err instanceof HTTPError) {
    // console.warn(err);
    res.status(err.statusCode).send(err.message);
  } else {
    // console.error(err);
    if (err.status === 400 && 'body' in err && err["type"] === 'entity.parse.failed') {
      res.status(400).send({message: 'JSON malformed'});
    } else {
      res.status(500).send("Internal Server Error");
    }  
  }
};
