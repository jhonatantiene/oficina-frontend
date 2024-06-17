import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http'; // Importe o HttpClientModule
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'clientes',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    SidenavComponent,
    HttpClientModule,
    MatSnackBarModule,
  ], // Adicione HttpClientModule aos imports
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss',
})
export class Clientes implements OnInit {
  clientes: any[] = [];
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private notification: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.read();
  }

  read() {
    this.http.get('http://localhost:3000/cliente/read').subscribe((res: any) => {
      this.clientes = res.res;
    });
  }

  openDialog(cliente: object = {}, tipo: number) {
    let dialogRef = this.dialog.open(ClientesModal, {
      data: [cliente, tipo],
      width: '500px',
      height: 'auto',
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.read();
    });
  }

  deletar(id: any) {
    this.http
      .delete('http://localhost:3000/cliente/delete', {params: id})
      .subscribe(() => {
        this.notification.open('Cliente deletado com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.read()
      });
  }
}

@Component({
  selector: 'app-root-modal',
  standalone: true,
  templateUrl: './clientes-modal.html',
  styleUrl: './clientes-modal.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
})
export class ClientesModal implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ClientesModal>,
    private http: HttpClient,
    private notification: MatSnackBar
  ) {}

  ngOnInit() {
    console.log(this.data);
  }

  form: FormGroup = new FormGroup({
    nome: new FormControl(
      this.data[0].nome ? this.data[0].nome : '',
      Validators.required
    ),
    telefone: new FormControl(
      this.data[0].telefone ? this.data[0].telefone : '',
      Validators.required
    ),
    telefone2: new FormControl(
      this.data[0].telefone2 ? this.data[0].telefone2 : ''
    ),
    endereco: new FormControl(
      this.data[0].endereco ? this.data[0].endereco : '',
      Validators.required
    ),
  });

  cadastrar() {
    this.http
      .post('http://localhost:3000/cliente/create', this.form.value)
      .subscribe(() => {
        this.dialogRef.close();
        this.notification.open('Cliente cadastrado com sucesso!', 'Fechar', {
          duration: 3000,
        });
      });
  }

  editar() {
    this.http
      .put('http://localhost:3000/cliente/update', {
        data: this.form.value,
        id: this.data[0].id,
      })
      .subscribe(() => {
        this.dialogRef.close();
        this.notification.open('Cliente editado com sucesso!', 'Fechar', {
          duration: 3000,
        });
      });
  }
}
