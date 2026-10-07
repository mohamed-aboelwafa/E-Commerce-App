import { Injectable, NotFoundException } from '@nestjs/common';
import { AppError } from './common/exceptions/error.handle.js';

@Injectable()
export class AppService {
  sayHello(): string{
    return "hello";
  }

  error_test1(): any{
    throw new NotFoundException();
  }

  custom_excption_test(): any{
    throw new AppError();
  }
}
