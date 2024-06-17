import { Component, Inject, OnInit } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import Chart from 'chart.js/auto';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-vendas',
  standalone: true,
  imports: [
    SidenavComponent,
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    HttpClientModule,
  ],
  templateUrl: './vendas.component.html',
  styleUrl: './vendas.component.scss',
})
export class Vendas implements OnInit {
  constructor(public dialog: MatDialog, private http: HttpClient) {
    this.onYearChange()
  }

  myChart: Chart | undefined;
  pecas: any[] = [];
  produtosMaisVendidos: any[] = [];
  vendasPorAno: { [ano: string]: any[] } = {}; // Armazenar as vendas por ano
  anosDisponiveis: string[] = []; // Lista de anos disponíveis para seleção
  anoSelecionado: string = ''; // Ano selecionado pelo usuário

  ngOnInit(): void {
    // Inicialize os anos disponíveis e selecione o primeiro ano por padrão
    this.initYears();
    this.anoSelecionado = this.anosDisponiveis[0];

    // Leia as vendas para o ano selecionado
    this.read();
    this.popularAnosDisponiveis()
    this.onYearChange()
  }

  vendas: any[] = [];

  openDialog() {
    let dialogRef = this.dialog.open(VendasModal, {
      data: this.pecas,
      width: '50%',
      height: '40%',
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.read();
    });
  }

  async read() {
    this.http
      .get('http://localhost:3000/venda/read')
      .subscribe(async (res: any) => {
        this.vendas = res.res;
        this.renderChart();
        this.analyzeProducts();
      });
  }

  popularAnosDisponiveis() {
    // Verifique se há vendas antes de tentar extrair os anos
    if (this.vendas.length > 0) {
      // Extraia os anos das vendas e remova os duplicados usando um conjunto
      const anosVendas = new Set(this.vendas.map(venda => this.extractYearFromDate(venda.data_venda)));
      // Converta o conjunto de anos para uma lista e ordene
      this.anosDisponiveis = Array.from(anosVendas).sort();
    } else {
      // Caso não haja vendas, defina a lista de anos disponíveis como vazia
      this.anosDisponiveis = [];
    }
  }

  // Método para inicializar a lista de anos disponíveis
  initYears() {
    // Obtenha o ano atual
    const currentYear = new Date().getFullYear();
    // Adicione os últimos 5 anos à lista de anos disponíveis
    for (let i = 0; i < 5; i++) {
      this.anosDisponiveis.push((currentYear - i).toString());
    }
  }

  // Método para atualizar os dados quando o ano selecionado é alterado
  onYearChange() {
    this.read();
  }

  // Método para extrair o ano da data de venda
  extractYearFromDate(dateString: string): string {
    return dateString.split('/')[2]; // Assumindo o formato DD/MM/YYYY
  }

  renderChart() {
    if (this.myChart) {
      this.myChart.destroy();
    }
  
    // Filtra as vendas pelo ano selecionado
    const vendasDoAnoSelecionado = this.vendas.filter(venda =>
      this.extractYearFromDate(venda.data_venda) === this.anoSelecionado
    );
  
    // Inicializar um array para armazenar os totais de vendas para cada mês
    const totaisPorMes = new Array(12).fill(0);
  
    // Calcular o total de vendas para cada mês do ano selecionado
    vendasDoAnoSelecionado.forEach((venda) => {
      // Extrair o mês da data da venda (assumindo formato 'DD/MM/YYYY')
      const parts = venda.data_venda.split('/');
      const mesIndex = parseInt(parts[1], 10) - 1;
      totaisPorMes[mesIndex] +=
        parseFloat(venda.preco.replace(',', '.')) * venda.qtd_venda;
    });
  
    // Nomes dos meses para etiquetas do eixo x
    const meses = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
  
    // Configurar o gráfico
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [
          {
            label: 'Total de Vendas por Mês',
            data: totaisPorMes,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  analyzeProducts() {
    // Limpa a lista de produtos mais vendidos
    this.produtosMaisVendidos = [];

    // Mapeia as vendas para um objeto que conta a quantidade vendida de cada produto
    console.log(this.vendas);
    const produtosQuantidades = this.vendas.reduce((acc, venda) => {
      acc[venda.peca_vendida] = acc[venda.peca_vendida] || 0;
      acc[venda.peca_vendida] += venda.qtd_venda;
      return acc;
    }, {});

    // Converte o objeto de quantidades vendidas em um array de objetos para facilitar a ordenação
    const produtosArray = Object.keys(produtosQuantidades).map((produto) => ({
      nome: produto,
      quantidade: produtosQuantidades[produto],
    }));

    // Ordena os produtos pelo número de vendas (quantidade) em ordem decrescente
    produtosArray.sort((a, b) => b.quantidade - a.quantidade);

    // Adiciona os produtos mais vendidos à lista produtosMaisVendidos
    this.produtosMaisVendidos = produtosArray.slice(0, 10); // Exibe os top 10 produtos mais vendidos

    console.log(this.produtosMaisVendidos);
  }
}

@Component({
  selector: 'app-venda-modal',
  standalone: true,
  templateUrl: './vendas-modal.html',
  styleUrl: './vendas-modal.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
})
export class VendasModal implements OnInit {
  form: FormGroup = new FormGroup({
    data_venda: new FormControl('', Validators.required),
    qtd_venda: new FormControl('', Validators.required),
    preco: new FormControl('', Validators.required),
    cliente: new FormControl('', Validators.required),
    peca_vendida: new FormControl('', Validators.required),
    id: new FormControl(),
  });

  clientes: any[] = [];
  pecas: any[] = [];
  quantidadeDisponivel: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VendasModal>,
    private http: HttpClient,
    private notification: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.readCliente();
    this.readPecas();
  }

  readPecas() {
    this.http.get('http://localhost:3000/peca/read').subscribe((res: any) => {
      this.pecas = res.res;
    });
  }

  readCliente() {
    this.http
      .get('http://localhost:3000/cliente/read')
      .subscribe((res: any) => {
        this.clientes = res.res;
      });
  }

  // onPecaChange() {
  //   console.log(this.pecas)
  //   const selectedPeca = this.pecas.find(peca => peca.nome_peca == this.form.value.peca_vendida);
  //   this.quantidadeDisponivel = selectedPeca ? selectedPeca.quantidade : 0;
  // }

  create() {
    const selectedPeca = this.pecas.find(
      (peca) => peca.nome_peca === this.form.value.peca_vendida
    );
    const qtdVenda = this.form.value.qtd_venda;

    this.http
      .post('http://localhost:3000/venda/create', this.form.value)
      .subscribe(() => {
        this.notification.open('Venda cadastrada com sucesso!', 'Fechar', {
          duration: 3000,
        });

        // Atualizar a quantidade da peça vendida no backend
        this.http
          .put('http://localhost:3000/peca/update', {
            data: { qtd: String(selectedPeca.qtd - qtdVenda) },
            id: selectedPeca.id,
          })
          .subscribe(() => {
            this.readPecas(); // Atualizar a lista de peças no frontend
            this.dialogRef.close();
          });
      });
  }
}
