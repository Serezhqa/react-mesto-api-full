const jwt = require('jsonwebtoken');
const AuthError = require('../errors/not-found-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, '42672c1e982828bee6a455759a41b1202afdd6ee4f489affa90795486df046a5');
  } catch (error) {
    next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
