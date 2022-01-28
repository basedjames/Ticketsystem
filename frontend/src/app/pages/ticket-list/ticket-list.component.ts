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

  list: Ticket[];

  getList() {
    this.HttpClient.get<any>('http://localhost:3000/ticket/ticketlist').subscribe(
      response => {
        this.list = response;
        console.log(response);
      }
    );
  }


  deleteTicket(_id: any, index:any) {
    this.HttpClient.delete<any>(`http://localhost:3000/ticket/ticketlist/${_id}`, ).subscribe(
      response => {
        this.list.splice(index, 1);
        console.log(response);
        this.toastr.error('Ticket successfully deleted');
      }
    )
  };

  showNewTicketInfo() {
    this.toastr.info('New Ticket');
  }

  constructor(
    private HttpClient: HttpClient,
    private toastr: ToastrService,
  ) 
  { 
    this.list = [];
  }

  ngOnInit(): void {
    this.getList();
  }

}
