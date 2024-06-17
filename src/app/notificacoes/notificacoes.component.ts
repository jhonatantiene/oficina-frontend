import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  templateUrl: './notificacoes.component.html',
  styleUrl: './notificacoes.component.scss',
  imports: [HttpClientModule, SidenavComponent],
})
export class Notificacoes implements OnInit {
  constructor(private http: HttpClient) {}

  notificacoes: string[] = []
  pecas: any[] = []

  async ngOnInit() {

    // if(this.notificacoes.length == 0) {
    //   this.notificacoes.push('Você não possue nenhuma notificação no momento.')
    // }
     this.readPecas();
  }

  // async read() {
  //   this.http
  //     .get('http://localhost:3000/notificacoes/read')
  //     .subscribe((res: any) => {
  //       this.notificacoes = res.res;
  //       console.log(this.notificacoes);
  //     });
  // }

  readPecas() {
    this.http.get('http://localhost:3000/peca/read').subscribe((res: any) => {
      this.pecas = res.res

      for(const peca of this.pecas) {
        if(peca.qtd <= peca.alert_estoque && peca.qtd != 0) {
          this.notificacoes.push(`Você possui apenas ${peca.qtd} unidades da peca ${peca.nome_peca} modelo ${peca.modelo}!`)
        }

        if(peca.qtd === 0) {
          this.notificacoes.push(`Seu estoque de ${peca.nome_peca} modelo ${peca.modelo} acabaram!`)
        }
      }

      console.log(this.notificacoes)
    });
  }
}
