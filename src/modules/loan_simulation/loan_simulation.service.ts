import {
  MakeErrorRequestResponseV2,
  ErrorRequestResponse,
} from '@common/factories/make-error-request-response';
import { Injectable } from '@nestjs/common';

import { ValidationSimulationDTO } from './dto/validate-simulation.dto';
import { LoanSimulation } from './loan_simulation.entity';
import { LoanSimulationRepository } from './loan_simulation.repository';

@Injectable()
export class LoanSimulationService {
  constructor(private repository: LoanSimulationRepository) {}

  private calculatePrice(dto: ValidationSimulationDTO, interestRate: number) {
    const installments = [];
    let debitBalance = dto.valorDesejado;

    const amountInstallment =
      (dto.valorDesejado * interestRate) /
      (1 - Math.pow(1 + interestRate, -dto.prazo));

    for (let i = 1; i <= dto.prazo; i++) {
      const valorJuros = debitBalance * interestRate;
      const valorAmortizacao = amountInstallment - valorJuros;
      installments.push({
        numero: i,
        valorJuros,
        valorPrestacao: amountInstallment,
        valorAmortizacao,
      });
      debitBalance = debitBalance - valorAmortizacao;
    }
    return installments;
  }

  private calculateSac(dto: ValidationSimulationDTO, interestRate: number) {
    const installments = [];
    let debitBalance = dto.valorDesejado;

    for (let i = 1; i <= dto.prazo; i++) {
      const valorJuros = debitBalance * interestRate;
      const valorAmortizacao = debitBalance / dto.prazo;
      installments.push({
        numero: i,
        valorJuros,
        valorPrestacao: valorAmortizacao + valorJuros,
        valorAmortizacao,
      });
      debitBalance = debitBalance - valorAmortizacao;
    }
    return installments;
  }

  async simulation(
    dto: ValidationSimulationDTO,
  ): Promise<LoanSimulation | { message: string } | ErrorRequestResponse> {
    try {
      const products = await this.repository.getProductByPrazoAndValorDesejado(
        dto,
      );
      if (products instanceof ErrorRequestResponse) throw products;

      if (!products || products.length === 0) {
        const productsByValorDesejado =
          await this.repository.getProductByValorDesejado(dto);
        if (productsByValorDesejado instanceof ErrorRequestResponse)
          throw productsByValorDesejado;

        const productByValorDesejado = productsByValorDesejado[0];

        return {
          message: `Não é possível financiar esse valor com tal prazo, altere a quantidade de parcelas para que fique ${
            !productByValorDesejado.NU_MAXIMO_MESES
              ? `igual ou acima de ${productByValorDesejado.NU_MINIMO_MESES}`
              : `entre ${productByValorDesejado.NU_MINIMO_MESES} e ${productByValorDesejado.NU_MAXIMO_MESES}`
          }`,
        };
      }

      const product = products[0];

      return {
        codigoProduto: product.CO_PRODUTO,
        descricaoProduto: product.NO_PRODUTO,
        taxaJuros: product.PC_TAXA_JUROS,
        resultadoSimulacao: [
          {
            tipo: 'PRICE',
            parcelas: this.calculatePrice(dto, product.PC_TAXA_JUROS),
          },
          {
            tipo: 'SAC',
            parcelas: this.calculateSac(dto, product.PC_TAXA_JUROS),
          },
        ],
      };
    } catch (error) {
      return MakeErrorRequestResponseV2(
        'public.loan_simulation',
        'simulation',
        __filename,
        error,
      );
    }
  }
}
