import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './Modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ReportModule } from './Modules/crime-report/report.module';
import { AuthModule } from './Modules/auth/auth.module';

@Module({
  imports: [
    // ====== DB CONNECTION ======
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'crime_reporting_system',
      autoLoadEntities: true,
      synchronize: true,
    }),

    // ====== ENV CONFIGURATION ======
    ConfigModule.forRoot({ isGlobal: true }),

    // ====== FEATURES/MODULES ======
    UserModule,
    ReportModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
