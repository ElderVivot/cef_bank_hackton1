import { ErrorRequestResponse } from '@common/factories/make-error-request-response';
import { ValidationPipeCustom } from '@common/pipes/validation-custom.pipe';
import { Body, Controller, Post } from '@nestjs/common';

import { ValidationSimulationDTO } from './dto/validate-simulation.dto';
import { LoanSimulation } from './loan_simulation.entity';
import { LoanSimulationService } from './loan_simulation.service';

@Controller('loan_simulation')
export class LoanSimulationController {
  constructor(private service: LoanSimulationService) {}

  @Post()
  async store(
    @Body(ValidationPipeCustom) dto: ValidationSimulationDTO,
  ): Promise<LoanSimulation | { message: string } | ErrorRequestResponse> {
    return await this.service.simulation(dto);
  }
}
