import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors();
  app.enableCors({
    origin: '*',
    methods: 'GET, PUT, POST, DELETE, PATCH',
    allowedHeaders: '*',
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api/userauth');

  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Athire User Manager')
    .setDescription('Athire user Manager API documentaion')
    .setVersion('1.0')
    .addTag('UserManager')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/userauth/doc', app, document);

  const port = parseInt(process.env.SERVER_PORT);
  await app.listen(port);
}
bootstrap();
