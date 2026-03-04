import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // sans argument = capture TOUTES les exceptions (HTTP et non-HTTP)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  private statusToError(status: number): string {
    const statusMap: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      500: 'Internal Server Error',
    };
    return statusMap[status] || 'Unknown Error';
  }

  // l'argument host de la fonction catch() est une abstraction générique que NestJS utilise dans les filtres et interceptors.
  // NestJS peut fonctionner sur plusieurs protocoles : HTTP, WebSockets, microservices (TCP, Redis...)
  catch(exception: unknown, host: ArgumentsHost): void {
    // préciser quel est le protocole de communication utilisé.
    // ctx est une convention pour context, ici : "tout ce dont j'ai besoin pour interagir avec la requête HTTP en cours".
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | string[];
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      // class-validator retourne ses messages dans body.message (tableau de strings)
      message =
        typeof body === 'string'
          ? body
          : ((body as any).message ?? exception.message);
      error = this.statusToError(status);
    } else {
      // Erreur interne non anticipée
      status = 500;
      error = 'Internal Server Error';
      message = 'An unexpected error occurred. Please contact support.';
      // Détail de l'erreur loggé côté serveur uniquement — jamais exposé au client
      this.logger.error(
        'Unhandled exception',
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
