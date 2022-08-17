In the client directory run `npm install`
Then run `npm run start`



Open a second terminal in the server directory and run `npm install`

This app requires a SendGrid account to send emails. You can create a free account at [sendgrid.com](https://sendgrid.com/)

Create a .env file in the server directory with the following entries:
```
SENDGRID_API_KEY=[Your SendGrid API Key]
SENDGRID_EMAIL_SENDER=[Your SendGrid sender email address]
```

 Then in the server directory run `nodemon run dev`