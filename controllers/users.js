const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/validation-error');
const NotFoundError = require('../errors/not-found-error');

const { NODE_ENV, JWT_SECRET } = process.env;

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
    .then((result) => res.send({
      data: {
        _id: result._id,
        name: result.name,
        about: result.about,
        avatar: result.avatar,
        email: result.email,
        __v: result.__v,
      },
    }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ValidationError(error.message));
      } else if (error.name === 'MongoError' && error.code === 11000) {
        const err = new Error('Пользователь с таким email уже зарегистрирован');
        err.statusCode = 409;
        next(err);
      }

      next(error);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'Eyjafjallajökull', { expiresIn: '7d' });
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
