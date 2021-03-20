'use strict'
var express = require('express');
var router = express.Router();

var socket = require('socket.io-client')('http://localhost:3001');

let dotenv = require('dotenv');
let request = require('request')

dotenv.config();

var apikey = process.env.apikey;
var apisecret = process.env.apisecret; 
var Host = process.env.HOSTNAME;


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'XUMM PoS' });
});

/* GET home page. */
router.get('/PoSPayload', function(req, res, next) {
var Generate = require('../generate.js')
  res.redirect('./done');
});

router.get('/done', function(req, res, next) {

  res.render('index', { title: 'XUMM PoS' });
});
module.exports = router;
