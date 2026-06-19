import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client!: RedisClientType;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.client = createClient({
      url: this.configService.get<string>('REDIS_URL'),
    });

    try {
      await this.client.connect();
    } catch (error) {
      console.error(error);
      console.log('Unable to connect to redis server!');
    }
  }

  getClient() {
    return this.client;
  }
}
