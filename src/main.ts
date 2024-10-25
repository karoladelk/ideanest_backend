import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  console.log('Nest application has started successfully');  // Simple startup log
  
  await app.listen(8080);
  app.use(cors({
    origin: 'http://localhost:3000',
  }));
  console.log(app.getHttpAdapter().getInstance()._router.stack.map(layer => layer.route));

}
bootstrap();
