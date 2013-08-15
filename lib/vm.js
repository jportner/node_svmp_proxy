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

 // NOT TESTED

 var cloud = require('pkgcloud');
 var config = require('../config/config');
 var Q = require('q');

 var client = pkgcloud.providers.compute.createClient(config.vmprovider);

 function checkVmStatus(vmId) {
 	// Should I check status and if not running return an error
 	client.getServer(vmId, function(err, server) {
 		if(err) throw Error("Error fetching VM info: ", err);
 		else return server;
 	});
 }

 function createServer(user) {
 	var deferred = Q.defer();
 	client.createServer({image: flavor: }, function (err, server) {
 		if(err) {
 			deferred.reject("Can't create server");
 		} else {
 			user.vminstance_id = server.id;
 			deferred.resolve(user);
 		}
 	})
 	return deferred.promise;
 }

 function checkRunning(user) {
 	// Poll openstack for running state
 	user.vminstance_ip = server.ip;
 	return user;
 }

 function updateUserInfo(user) {
 	// save user
 }

 /**
  * Flow
  * user = new User(req.body)
  * createServer(user)
  * .then(checkRunning)
  * .then(updateUserinfo)
  * .fail()
  * .done();
  */

  