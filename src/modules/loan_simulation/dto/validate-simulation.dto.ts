import { IsNotEmpty, IsNumber } from 'class-validator';

export class ValidationSimulationDTO {
  @IsNotEmpty()
  @IsNumber()
  valorDesejado: number;

  @IsNotEmpty()
  @IsNumber()
  prazo: number;
}
