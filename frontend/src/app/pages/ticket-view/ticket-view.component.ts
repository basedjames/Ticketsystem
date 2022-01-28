// MODULES
import { Component, OnInit } from '@angular/core';
import { Ticket } from 'src/app/Ticket';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.scss']
})
export class TicketViewComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private http: HttpClient
  ) { }

// VARIABLES
  image;
  model = new Ticket();
  
// SELECT ATTACHMENT 
  selectedImage(event) {
    if (event?.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
    };
  };

// RESET TICKET AFTER CREATE
  resetTicket() {
    this.model = new Ticket();

  };

// SEND THE FORMDATA TO THE BACKEND (POST REQUEST)
  sendUpload() {
    const formData = new FormData();
    formData.append('email', this.model.email);
    formData.append('subject', this.model.subject);
    formData.append('description', this.model.description);
    formData.append('image', this.image);

    this.http.post<any>('http://localhost:3000/ticket/ticketlist/', formData).subscribe(
      (res) => {
        console.log(res);
        this.toastr.success('Ticket successfully created');
        this.resetTicket();
      },
      (err) => {
        console.log(err);
        this.toastr.error('Ticket creation failed');
      }
      );
  };

  ngOnInit(): void {
  };

}
