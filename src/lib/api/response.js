import { NextResponse } from "next/server";

export class ApiResponse {
  static success(data, status = 200) {
    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status }
    );
  }

  static error(message, status = 500, errors = null) {
    return NextResponse.json(
      {
        success: false,
        error: message,
        ...(errors && { errors }),
      },
      { status }
    );
  }

  static unauthorized(message = "Unauthorized") {
    return this.error(message, 401);
  }

  static forbidden(message = "Forbidden") {
    return this.error(message, 403);
  }

  static notFound(message = "Resource not found") {
    return this.error(message, 404);
  }

  static badRequest(message, errors = null) {
    return this.error(message, 400, errors);
  }

  static created(data) {
    return this.success(data, 201);
  }
}
