export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, `${resource} no encontrado`);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Acceso denegado') {
    super(403, message);
  }
}
