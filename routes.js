module.exports = function(app) {
    let login = require('./controllers/login');
    let events = require('./controllers/events');
    let users = require('./controllers/users');
    let search = require('./controllers/search');

    // Login routes
    app.post('/login', login.login);
    app.post('/register', login.register);
    app.post('/reset_password', login.reset);

    // Event routes
    app.get('/event/:id', events.findById);
    app.get('/event/organizer/:organizer', events.get_events);
    app.get('/event/volunteer/:volunteer', events.get_registered)
    app.post('/event/:organizer', events.create_event);
    app.post('/event/register/:volunteer/:id', events.register);
    app.post('/event/unregister/:volunteer/:id', events.unregister);
    app.put('/event/:organizer/:id', events.edit_event);

    // Profile data routes
    app.get('/volunteer/:id', users.volunteerById);
    app.get('/organizer/:id', users.organizerById);

    // Search routes
    app.get('/search', search.search);
}
