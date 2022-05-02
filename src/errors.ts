export class APIError extends Error {
  status: number;
  constructor(message: any, status: number) {
    super(message);
    this.status = status;
  }
}

export class NotAllowedMethod extends APIError {
  constructor() {
    super("api/method-not-allowed", 405);
  }
}

export class DocumentNotFound extends APIError {
  constructor() {
    super("api/document-not-found", 404);
  }
}

export class MissingCredentials extends APIError {
  constructor() {
    super("auth/missing-credentials", 400);
  }
}

export class NotFound extends APIError {
  constructor(model: string) {
    super("auth/" + model + "-not-found", 404);
  }
}
