// MODEL FOR THE FORMDATA TO SEND/RECEIVE THE TICKET
export class Ticket {

    constructor(
      public _id: string = '',
      public email: string = '',
      public subject: string = '',
      public description: string = '',
      public image: string = ''
    ) {  }
  
  };