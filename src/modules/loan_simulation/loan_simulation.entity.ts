interface IInstallments {
  numero: number;
  valorAmortizacao: number;
  valorJuros: number;
  valorPrestacao: number;
}

interface IResultSimulation {
  tipo: 'SAC' | 'PRICE';
  parcelas: IInstallments[];
}

export class LoanSimulation {
  codigoProduto: number;
  descricaoProduto: string;
  taxaJuros: number;
  resultadoSimulacao: IResultSimulation[];
}
