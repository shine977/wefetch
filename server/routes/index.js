var express = require('express');
var router = express.Router();

// interceptor request
router.get('/interceptor/request', function(req, res, next) {
  res.json({title:'interceptor', content: 'this is a interceptor request'});
});

// interceptor response
router.get('/interceptor/response', function(req, res, next) {
  res.set({'interceptor': true})
  res.json({title:'interceptor', content: 'this is a interceptor response'});
});

// get request
router.get('/get', function(req, res, next) {
  res.json(req.query)
})
router.get('/abortGet', function (req, res, next) {
  setTimeout(() => {
    res.json(req.query)
  }, 5000)
})
router.post('/post', function(req, res, next) {
  res.json(req.body)
})
router.post('/postJson', function(req, res, next) {
  res.json(req.body)
})
router.head('/head', function (req, res, next) {
  res.set({'title': 'Head Test'})
  res.set({'content': 'this is a head request'})
  res.end()
})
router.put('/put', function (req, res, next) {
  res.json(req.body)
})
router.delete('/delete', function (req, res, next) {
  res.json(req.body)
})
router.trace('/trace', function (req, res, next) {
  res.json(req.body)
})
router.options('/options', function (req, res, next) {
  res.json(req.body)
})
router.options('/connect', function (req, res, next) {
  res.json(req.body)
})
module.exports = router;
