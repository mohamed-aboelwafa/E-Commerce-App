import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service.js';
import type { Request } from 'express';

// http://localhost:3000/app
@Controller("/app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  // http://localhost:3000/app/say-hello
  @Get("/say-hello")
  sayHello(): string {
    return this.appService.sayHello();
  }
}
