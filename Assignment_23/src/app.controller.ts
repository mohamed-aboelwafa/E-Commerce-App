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


  // http://localhost:3000/app/error_test1
  @Get("/error_test1")
  error_test1():any {
    return this.appService.error_test1();
  }


  // http://localhost:3000/app/custom_excption_test
  @Get("/custom_excption_test")
  custom_excption_test():any {
    return this.appService.custom_excption_test();
  }

}
