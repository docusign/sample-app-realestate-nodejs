require('dotenv').config(); //env variables
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const helmet = require('helmet'); // https://expressjs.com/en/advanced/best-practice-security.html
const moment = require('moment'); //https://www.npmjs.com/package/moment
const path = require('path');
const { updateToken } = require('./controllers/authController');


//route imports
const leadRouter = require('./routes/leadRouter');
const authRouter = require('./routes/authRouter');
const roomsRouter = require('./routes/roomsRouter');

const port = process.env.PORT || 5000;
const maxSessionMinutes = 180;
const sessionTtlMs = maxSessionMinutes * 60 * 1000;

const app = express()
  .set('trust proxy', 1) // trust first proxy
  .use(helmet())
  .use(bodyParser.json())
  .use(cookieParser())
  .use(session({
    name: 'roomApp',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({ checkPeriod: sessionTtlMs }),
    cookie: {
      maxAge: sessionTtlMs,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    },
  }))
//Refresh the token if expired
app.use(async (req, res, next) => {
  if (req.session.token) {
    const currentTime = moment();
    //1 minute buffer 
    const minuteBuffer = 1;
    //check if you need to update the token
    const update = moment(req.session.tokenExpirationTimestamp).subtract(
      minuteBuffer, 'm').isBefore(currentTime);
    //only refresh if expired
    if (update) {
      console.log("Update is required");
      await updateToken(req)
    }
  }
  next();
})

const corsOptions = {
  origin: process.env.FRONTEND_APP_URL || 'http://localhost:3000',
  credentials: true,
}
app.use(cors(corsOptions));

//backend routing
app.use('/api/leads', leadRouter);
app.use('/api/auth', authRouter);
app.use('/api/rooms', roomsRouter);

console.log("Node env: " + process.env.NODE_ENV);
//serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  console.log("We are in production");
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Server started on port ${port}`));