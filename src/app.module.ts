import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './Modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ReportModule } from './Modules/crime-report/report.module';
import { AuthModule } from './Modules/auth/auth.module';
import { AlertModule } from './Modules/alert/alert.module';

console.log('ENV URL', process.env.DATABASE_URL);

@Module({
  imports: [
    // ====== ENV CONFIGURATION ======
    ConfigModule.forRoot({ isGlobal: true }),

    // ====== DB CONNECTION ======
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: { rejectUnauthorized: false },
    }),

    // ====== FEATURES/MODULES ======
    UserModule,
    ReportModule,
    AuthModule,
    AlertModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
