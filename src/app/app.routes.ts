import { Routes } from '@angular/router';
import { Clientes } from './clientes/clientes';
import { Vendas } from './vendas/vendas.component';
import { Estoque } from './estoque/estoque.component';
import { Home } from './home/home.component';
import { Notificacoes} from './notificacoes/notificacoes.component';

export const routes: Routes = [
    {path: 'clientes', component: Clientes},
    {path: 'vendas', component: Vendas},
    {path: 'estoque', component: Estoque},
    {path: 'notificacoes', component: Notificacoes},
    {path: '', component: Home}
];

