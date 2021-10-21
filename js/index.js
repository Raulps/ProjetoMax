/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);
cordova.plugins.diagnostic.isLocationEnabled(successCallback, errorCallback);

function successCallback(res) {
    console.log("Location is " + (res ? "Enabled" : "not Enabled"));
    if (!res) {
        alert("Por favor ative o GPS para usar o Foodfixe");
        cordova.plugins.diagnostic.switchToLocationSettings()
    } else {

    }
}

function errorCallback(err) {
    console.log("Error: " + JSON.stringify(err));
}

function requestGPSpermission() {
    window.navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
    }, function (error) {
        if (error.code = error.PERMISSION_DENIED) {
            alert("Por favor aceite o pedido de permissão para usar o Foodfixe")
            requestGPSpermission();
        }
    })
}
requestGPSpermission();

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}
