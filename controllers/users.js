const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/validation-error');
const NotFoundError = require('../errors/not-found-error');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((result) => res.send({ data: result }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ValidationError(error.message));
      }

      next(error);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '42672c1e982828bee6a455759a41b1202afdd6ee4f489affa90795486df046a5', { expiresIn: '7d' });
      res.send(token);
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((result) => res.send({ data: result }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((result) => {
      if (!result) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send({ data: result });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    })
    .then((result) => res.send({ data: result }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ValidationError(error.message));
      }

      next(error);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    })
    .then((result) => res.send({ data: result }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ValidationError(error.message));
      }

      next(error);
    });
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};
