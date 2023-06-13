import { LoanSimulationModule } from '@modules/loan_simulation/loan_simulation.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [LoanSimulationModule],
})
export class AppModule {}
