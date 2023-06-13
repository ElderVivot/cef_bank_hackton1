import { Module } from '@nestjs/common';

import { connectionFactory } from './connection';

@Module({
  providers: [connectionFactory],
  exports: [connectionFactory],
})
export class ConnectionModule {}
