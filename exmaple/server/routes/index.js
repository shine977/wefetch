var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/interceptor', function(req, res, next) {
  res.send('interceptor test');
});

module.exports = router;
