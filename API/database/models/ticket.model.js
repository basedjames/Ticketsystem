const mongoose = require('mongoose');

// TICKETSCHEMA FOR INCOMING TICKETS
const TicketSchema = new mongoose.Schema({
    email: { type: String, required: true},
    subject: { type: String, required: true, minlength: 1, trim: true},
    description: { type: String, required: true},
    image: { type: String },
    _userId: { type: mongoose.Types.ObjectId, required: true }
}, {
    timestamps: true,
});

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = { Ticket }