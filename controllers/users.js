const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
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

const getUsers = (req, res) => {
  User.find({})
    .then((result) => res.send({ data: result }))
    .catch((error) => res.status(500).send({
      message: `На сервере произошла ошибка: ${error.message}`,
    }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((result) => {
      if (result) {
        res.send({ data: result });
        return;
      }

      res.status(404).send({
        message: 'Пользователь не найден',
      });
    })
    .catch((error) => res.status(500).send({
      message: `На сервере произошла ошибка: ${error.message}`,
    }));
};

const updateUser = (req, res) => {
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

const updateAvatar = (req, res) => {
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

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};
