import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: '*', // Autorise toutes les origines (à sécuriser plus tard)
    });
    await app.init();
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
