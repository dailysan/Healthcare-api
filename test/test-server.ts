import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export async function createTestServer() {
  const app = await NestFactory.create(AppModule);
  
  const httpServer = app.getHttpServer();
  
  const config = new DocumentBuilder()
    .setTitle('Healthcare API')
    .setDescription('API para gestión de atención médica')
    .setVersion('1.0')
    .addTag('healthcare')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.init();
  
  return app;
}
