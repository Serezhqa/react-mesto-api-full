const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '5f476840f9efa7088494464e',
  };

  next();
});
app.use(bodyParser.json());
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('/*', (req, res) => {
  res.status(404).send({
    message: 'Запрашиваемый ресурс не найден',
  });
});

app.listen(PORT);
