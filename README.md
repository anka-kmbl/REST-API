# REST-API
A test task solving using express, jwt and mongoose.

## Instructions
1) install mongodb and run it (default port - 27017)
2) you can make requests listed below:
  * GET /signin - allows you to get a page with a sign-in form.
  * POST /signin - allows you to send 'userId' and 'password' and get a bearer token.
  * GET /signup - allows you to get a page with a sign-up form.
  * POST /signup - allows you to register ('userId' and 'password' fields should be sent).
  * GET /info - allows you to get userId and userId type in JSON format. You should send 'Authorization' header assigned to a token (format 'Bearer XXX.XXX.XXX'). *only if your token is valid* 
  * GET /latency - allows you to measure latency of the request to www.google.com. You should send 'Authorization' header assigned to a token (format 'Bearer XXX.XXX.XXX'). *only if your token is valid* 
  * POST /logout - allows you to log out (You should send 'req.body.token' field with a valid token).
3) **note:** every request returns a new prolonged token, so please resend a new one with every request to /info, /latency, /logout routes (with 'Authorization' header).
