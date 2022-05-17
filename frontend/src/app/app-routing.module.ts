// MODULES
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';

// COMPONENTS
import { TicketListComponent } from './pages/ticket-list/ticket-list.component';
import { TicketViewComponent } from './pages/ticket-view/ticket-view.component';

const routes: Routes = [
  {path: '', component: TicketViewComponent },
  {path: 'ticketlist', component: TicketListComponent },
  {path: 'login', component: LoginPageComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
