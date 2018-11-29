var express = require('express');
var router = express.Router();
var azure = require('azure-sb');
var config = require('../config.json')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Azure SB Test Harness');
});
router.post('/:queue', function(req, res, next){
  var sbService = azure.createServiceBusService(config.connStr);
  sbService.createQueueIfNotExists(req.params.queue, function(err){
    var msg = req.body.message
    sbService.sendQueueMessage(req.params.queue, msg, function(err){
      if(err){
        res.send(err)
      }else {
        res.send('Sent ' + msg)
      }
    })
  })
})
router.get('/:queue', function(req, res, next){
  var sbService = azure.createServiceBusService(config.connStr);
  sbService.receiveQueueMessage(req.params.queue, {isPeekLock: true}, function(err, lockedMessage){
    if(err){
      res.send(err)
    } else{
      res.send(lockedMessage)
    }
  })
})
router.delete('/:msg', function(req, res, next){
  var sbService = azure.createServiceBusService(config.connStr);
  sbService.deleteMessage(req.params.msg, function(err){
    if(err){
      res.send(err)
    }else{
      res.send("Message Deleted.")
    }
  })
})

module.exports = router;
