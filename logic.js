const mongoose = require("mongoose");
const assert = require("assert");

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/contact-manager");
const db = mongoose.connection;

function toLower(value) {
    return value.toLowerCase();
}

const contactSchema = mongoose.Schema({
    firstname: { type: String, set: toLower },
    lastname: { type: String, set: toLower },
    phone: { type: String, set: toLower },
    email: { type: String, set: toLower }
});

const Contact = mongoose.model("Contact", contactSchema);

const addContact = (contact) => {
    Contact.create(contact, (err) => {
        assert.equal(null, err);
        console.info("New contact added");
        db.close();
    });
}

const getContact = (name) => {
    const Search = new RegExp(name, "i");
    Contact.find({ $or: [{ firstname: Search }, { lastname: Search }] })
        .exec((err, contact) => {
            assert.equal(null, err);
            console.info(contact);
            console.info(`${contact.length} matches`);
            db.close();
        });
}

module.exports = { addContact, getContact };