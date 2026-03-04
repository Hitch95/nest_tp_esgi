import { Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
