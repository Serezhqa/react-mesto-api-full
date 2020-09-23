const Card = require('../models/card');

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((result) => res.send({ data: result }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({
          message: error.message,
        });
        return;
      }

      res.status(500).send({
        message: `На сервере произошла ошибка: ${error.message}`,
      });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((result) => res.send({ data: result }))
    .catch((error) => res.status(500).send({
      message: `На сервере произошла ошибка: ${error.message}`,
    }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((result) => {
      if (result) {
        res.send({ data: result });
        return;
      }

      res.status(404).send({
        message: 'Карточка не найдена',
      });
    })
    .catch((error) => res.status(500).send({
      message: `На сервере произошла ошибка: ${error.message}`,
    }));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    {
      new: true,
    })
    .then((result) => {
      if (result) {
        res.send({ data: result });
        return;
      }

      res.status(404).send({
        message: 'Карточка не найдена',
      });
    })
    .catch((error) => res.status(500).send({
      message: `На сервере произошла ошибка: ${error.message}`,
    }));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    })
    .then((result) => {
      if (result) {
        res.send({ data: result });
        return;
      }

      res.status(404).send({
        message: 'Карточка не найдена',
      });
    })
    .catch((error) => res.status(500).send({
      message: `На сервере произошла ошибка: ${error.message}`,
    }));
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
