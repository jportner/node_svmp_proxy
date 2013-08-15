/*
 * Copyright 2013 The MITRE Corporation, All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this work except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * author Dave Bryson
 *
 */
'use strict';

var net = require('net'),
    tls = require('tls'),
    fs = require('fs'),
    env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env],
    mongoose = require('mongoose');

// Setup db connection
mongoose.connect(config.db);
mongoose.connection.on('error',function(err) {
	console.log('STOPPING Proxy. Unable to connect to MongoDB. Is it running?');
	process.exit(1);
})

// Load model
require('./lib/user');
var proxy = require('./lib/proxy');

var tls_options = {
    key: fs.readFileSync('./tls/private-key.pem'),
    cert: fs.readFileSync('./tls/public-cert.pem')
};

function onConnection(proxySocket) {
    proxy.proxyConnection(proxySocket);
}

var server = config.tls_proxy ? tls.createServer(tls_options, onConnection) : net.createServer(onConnection);
server.listen(config.port);
console.log("Proxy running on port", config.port, " Using TLS? : ", config.tls_proxy);
