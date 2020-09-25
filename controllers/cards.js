const Card = require('../models/card');
const ValidationError = require('../errors/validation-error');
const NotFoundError = require('../errors/not-found-error');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((result) => res.send({ data: result }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ValidationError(error.message));
      }

      next(error);
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((result) => res.send({ data: result }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((result) => {
      if (!result) {
        throw new NotFoundError('Карточка не найдена');
      }

      res.send({ data: result });
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    {
      new: true,
    })
    .then((result) => {
      if (!result) {
        throw new NotFoundError('Карточка не найдена');
      }

      res.send({ data: result });
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    })
    .then((result) => {
      if (!result) {
        throw new NotFoundError('Карточка не найдена');
      }

      res.send({ data: result });
    })
    .catch(next);
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
