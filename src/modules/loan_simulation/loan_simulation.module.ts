import { ConnectionModule } from '@database/connection.module';
import { Module } from '@nestjs/common';

import { LoanSimulationController } from './loan_simulation.controller';
import { LoanSimulationRepository } from './loan_simulation.repository';
import { LoanSimulationService } from './loan_simulation.service';

@Module({
  imports: [ConnectionModule],
  controllers: [LoanSimulationController],
  providers: [LoanSimulationService, LoanSimulationRepository],
})
export class LoanSimulationModule {}
