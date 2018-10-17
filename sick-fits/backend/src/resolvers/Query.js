const {
  forwardTo // Direct proxy to the prisma db interface
} = require('prisma-binding');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db')
};

module.exports = Query;
