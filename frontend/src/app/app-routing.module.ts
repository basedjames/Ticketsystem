// MODULES
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENTS
import { TicketListComponent } from './pages/ticket-list/ticket-list.component';
import { TicketViewComponent } from './pages/ticket-view/ticket-view.component';

const routes: Routes = [
  {path: '', component: TicketViewComponent },
  {path: 'ticketlist', component: TicketListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
