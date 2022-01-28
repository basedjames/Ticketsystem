// MODULES
import { Component, OnInit } from '@angular/core';
import { Ticket } from 'src/app/Ticket';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {

// CONSTRUCTOR FOT THE MODULES AND INIT FOR THE LIST
  constructor(
    private HttpClient: HttpClient,
    private toastr: ToastrService,
  ) 
  { 
    this.list = [];
  };
// VARIABLES 
  list: Ticket[];

// GET THE TICKET LIST FROM THE BACKEND (GET REQUEST)
  getList() {
    this.HttpClient.get<any>('http://localhost:3000/ticket/ticketlist').subscribe(
      response => {
        this.list = response;
        console.log(response);
      }
    );
  };

// DELELTE THE CHOSEN TICKET (DELETE REQUEST)
  deleteTicket(_id: any, index:any) {
    this.HttpClient.delete<any>(`http://localhost:3000/ticket/ticketlist/${_id}`, ).subscribe(
      response => {
        this.list.splice(index, 1);
        console.log(response);
        this.toastr.error('Ticket successfully deleted');
      }
    )
  };

// TOASTIFY FOR THE "NEW TICKET" BUTTON
  showNewTicketInfo() {
    this.toastr.info('New Ticket');
  }

  ngOnInit(): void {
    this.getList();
  };

}
