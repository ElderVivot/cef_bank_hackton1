import {
  ErrorRequestResponse,
  MakeErrorRequestResponseV2,
} from '@common/factories/make-error-request-response';
import { Connection } from '@database/connection';
import { Inject } from '@nestjs/common';

import { ValidationSimulationDTO } from './dto/validate-simulation.dto';
import { Product } from './product.entity';

export class LoanSimulationRepository {
  constructor(@Inject('CONNECTION') private connection: Connection) {}

  async getProductByPrazoAndValorDesejado(
    dto: ValidationSimulationDTO,
  ): Promise<Product[] | ErrorRequestResponse> {
    const { prazo, valorDesejado } = dto;
    try {
      const sql = `
        SELECT produto.* 
          FROM dbo.PRODUTO AS produto
         WHERE (    ( ${prazo} BETWEEN produto.NU_MINIMO_MESES AND produto.NU_MAXIMO_MESES ) 
                 OR ( ${prazo} > produto.NU_MINIMO_MESES AND produto.NU_MAXIMO_MESES IS NULL ) 
               )
           AND (    ( ${valorDesejado} BETWEEN produto.VR_MINIMO AND produto.VR_MAXIMO )
                 OR ( ${valorDesejado} > produto.VR_MINIMO AND produto.VR_MAXIMO IS NULL )
               )
      `;

      const result = await this.connection.query<Product>(sql);
      return result;
    } catch (error) {
      return MakeErrorRequestResponseV2(
        'public.loan_simulation',
        'getProductByPrazoAndValorDesejado',
        __filename,
        error,
      );
    }
  }

  async getProductByValorDesejado(
    dto: ValidationSimulationDTO,
  ): Promise<Product[] | ErrorRequestResponse> {
    const { valorDesejado } = dto;
    try {
      const sql = `
        SELECT produto.* 
          FROM dbo.PRODUTO AS produto
         WHERE (    ( ${valorDesejado} BETWEEN produto.VR_MINIMO AND produto.VR_MAXIMO )
                 OR ( ${valorDesejado} > produto.VR_MINIMO AND produto.VR_MAXIMO IS NULL )
               )
      `;

      const result = await this.connection.query<Product>(sql);
      return result;
    } catch (error) {
      return MakeErrorRequestResponseV2(
        'public.loan_simulation',
        'getProductByValorDesejado',
        __filename,
        error,
      );
    }
  }
}
