var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../Models/User');
var debug = true;

