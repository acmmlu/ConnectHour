module.exports = function(app) {
    let login = require('./controllers/login');
    let events = require('./controllers/events');
    let users = require('./controllers/users');
    let search = require('./controllers/search');

    // Login routes
    app.post('/login', login.login);
    app.post('/register', login.register);
    app.post('/reset_password', login.reset);
    app.post('/google_login', login.googleLogIn);

    // Event routes
    app.get('/event/:id', events.findById);
    app.get('/event/organizer/:organizer', events.get_events);
    app.get('/event/volunteer/:volunteer', events.get_registered)
    app.get('/event/organizer/registered/:id', events.get_registered_volunteers)
    app.get('/event/activity/:volunteer', events.activityTracking)
    app.get('/event/activityOrg/:organizer', events.activityOrg)
    app.post('/event/:organizer', events.create_event);
    app.post('/event/register/:volunteer/:id', events.register);
    // app.post('/event/unregister/:volunteer/:id', events.unregister);
    app.put('/event/:organizer/:id', events.edit_event);
    app.delete('/event/:organizer/:id', events.delete_event);


    // Profile data routes
    app.get('/volunteer/:volunteer', users.volunteerById);
    app.put('/volunteer/:volunteer', users.edit_volProfile);
    app.get('/organizer/:organizer', users.organizerById);
    app.put('/organizer/:organizer', users.edit_orgProfile);
    app.get('/profile/organization/:organizer', users.organizerId);
    app.put('pfp/:type/:id', users.upload_photo);

    // Search routes
    app.get('/search', search.search);
    app.get('/recommended/:volunteer', search.recommended);

    // Subscription routes
    app.post('/event/subscribe/:volunteer/:organizer',events.subscribe); //sonia
    app.post('/event/unsubscribe/:volunteer/:organizer',events.unsubscribe); //sonia
    app.get('/event/issubscribed/:volunteer/:organizer',events.issubsbribed);
    app.get('/event/get_subscribed/:organizer',events.get_subscribed); //sonia
    app.get('/event/get_subscribed_org/:volunteer',events.get_subscribed_org); //sonia
    
}
