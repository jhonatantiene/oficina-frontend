import { Component, Inject, OnInit } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-estoque',
  standalone: true,
  templateUrl: './estoque.component.html',
  styleUrl: './estoque.component.scss',
  imports: [
    MatButtonModule,
    MatTableModule,
    SidenavComponent,
    HttpClientModule,
    MatSnackBarModule,
  ],
})
export class Estoque {
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private notification: MatSnackBar
  ) {}

  pecas: any = []

  async ngOnInit() {
    await this.read();
  }

  openDialog(peca: object, tipo: number) {
    let dialogRef = this.dialog.open(EstoqueModal, {
      data: {peca, tipo},
      width: '500px',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.read();
    });
  }

  async read() {
    this.http.get('http://localhost:3000/peca/read').subscribe((res: any) => {
      this.pecas = res.res
    });
  }

  deletar(id: number) {

  }
}

@Component({
  selector: 'app-estoque-modal',
  standalone: true,
  templateUrl: './estoque-modal.html',
  styleUrl: './estoque-modal.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
})
export class EstoqueModal implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EstoqueModal>,
    private http: HttpClient,
    private notification: MatSnackBar
  ) {}

  form: FormGroup = new FormGroup({
    nome_peca: new FormControl(this.data.peca.nome_peca ? this.data.peca.nome_peca : '', Validators.required),
    modelo: new FormControl(this.data.peca.modelo ? this.data.peca.modelo : '', Validators.required),
    data_compra: new FormControl(this.data.peca.data_compra ? this.data.peca.data_compra : '', Validators.required),
    preco_peca: new FormControl(this.data.peca.preco_peca ? this.data.peca.preco_peca : '', Validators.required),
    qtd: new FormControl(this.data.peca.qtd ? this.data.peca.qtd : 0, Validators.required),
    alert_estoque: new FormControl(this.data.peca.alert_estoque ? this.data.peca.alert_estoque : 0,Validators.required),
  });

  ngOnInit(): void {
    console.log(this.data)
  }

  cadastrar() {
    this.http.post('http://localhost:3000/peca/create', this.form.value).subscribe(res => {
      this.dialogRef.close()
      this.notification.open('Peça cadastrada com sucesso!', 'Fechar', {
        duration: 3000
      })
    })
  }

  editar() {
    // this.form.value.qtd = Number(this.form.value.qtd)
    this.http.put('http://localhost:3000/peca/update', {data:this.form.value, id: this.data.peca.id}).subscribe(res => {
      this.dialogRef.close()
      this.notification.open('Peça atualizada com sucesso!', 'Fechar', {
        duration: 3000
      })
    })
  }
  
}
