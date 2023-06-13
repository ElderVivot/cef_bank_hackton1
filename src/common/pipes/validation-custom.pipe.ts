import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

export class ValidationPipeCustom extends ValidationPipe {
  constructor(private options?: ValidationPipeOptions) {
    super({ ...options, whitelist: true });
  }
}
