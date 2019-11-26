const g = require('./globals');

const googleConfig = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirect: 'https://your-website.com/google-auth' // this must match your google api settings
  };
  
  /**
   * Create the google auth object which gives us access to talk to google's apis.
   */
  function createConnection() {
    return new google.auth.OAuth2(
      googleConfig.clientId,
      googleConfig.clientSecret,
      googleConfig.redirect
    );
  }