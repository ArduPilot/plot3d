/* global self, caches, Promise, fetch */

/*
This file is part of Flight Plotter.

    Flight Plotter is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Flight Plotter is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Flight Plotter.  If not, see <https://www.gnu.org/licenses/>.
*/

/* 
    Created on      : Sep 2020
    Updated         : Apr 2021 v1.2 with corrected centering
    Updated         : Apr 2021 v1.3 with F3C and 0 alt
    Updated         : May 2021 v1.3.5 with IMAC box and sites
    Updated         : June 2021
    Author          : Artur Uzieblo
*/

"use strict";

const VER='v2.3.1H';

var immutableRequests = [
    './libs/jquery-ui/jquery-ui.min.css',
    './libs/bootstrap/bootstrap.css',
    './libs/vue/bootstrap-vue.min.css',
    './libs/element/theme-chalk/index.css',
    './libs/chartist/chartist.min.css',
    './libs/three/main.css',
    './libs/jquery/jquery-3.5.1.min.js',
    './libs/jquery-ui/jquery-ui.min.js',
    './libs/vue/vue.min.js',
    './libs/bootstrap/bootstrap-vue.min.js',    
    './libs/three/three.module142.js',
    './libs/three/controls/OrbitControls.js',
    './libs/three/controls/TransformControls.js',       
    './libs/three/loaders/MTLLoader.js',
    './libs/three/loaders/OBJLoader.js',
    './libs/three/utils/BufferGeometryUtils.js',
    './libs/chartist/chartist.min.js',
    './libs/FileSaver/FileSaver.js',
    './libs/three/RobotoMono-Medium.woff2',
    './libs/three/RobotoMono-Regular.woff2',
    './libs/unpack/unpack.js',
    './templates/F3A/F21_template_150.json',
    './templates/F3A/F21_template_170.json',
    './templates/F3A/F23_template_150.json',
    './templates/F3A/F23_template_170.json',
    './templates/F3A/P21_template_150.json',
    './templates/F3A/P21_template_170.json',
    './templates/F3A/P23_template_150.json',
    './templates/F3A/P23_template_170.json',
    './textures/grasslight-big.jpg',
    './models/heli/customHeli.obj',
    './models/heli/customHeli.mtl',
    './models/jet/Jet.obj',
    './models/jet/Jet.mtl',
    './models/osbipe/Biplane.obj',
    './models/osbipe2/bipe2.obj',
    './models/osbipe2/bipe2.mtl',
    './models/leader/leader.obj',
    './models/leader/leader.mtl',
    './models/thomas/model.obj',
    './models/thomas/model.mtl'
];

var mutableRequests = [
    './libs/element/index.js',
    './plotter.html',
    './css/fp.css',
    './css/mansplitter.css',
    './js/env.js',
    './js/geometries/RibbonMesh.js',
    './js/plotter.js',
    './js/attitude/attitudeBase.js',
    './js/attitude/attitudeTop.js',
    './js/attitude/attitudeFront.js',
    './js/attitude/attitudeSide.js',
    './js/binreader/binreader.js',
    './js/jsonreader/jhash.js',
    './js/jsonreader/jsonreader.js',
    './js/docready.js',
    './vue/vue-gui-BL.js',
    './vue/vue-gui-Inst.js',
    './vue/vue-gui-SM.js',
    './vue/vue-gui-ScM.js',
    './vue/vue-gui-TM.js',
    './vue/vue-gui-TL.js',
    './vue/vue-gui-TR.js',
    './siteDB/sites.json',
    './styles/components/circle.js',
    './styles/components/disc.js',            
    './styles/components/grid.js',
    './styles/components/line.js',
    './styles/components/pilot.js',
    './styles/components/pole.js',
    './styles/components/runway.js',                       
    './styles/components/sprite.js',                        
    './styles/F2BStyle.js',
    './styles/F3AStyle.js',
    './styles/F3SStyle.js',
    './styles/F3CStyle.js',
    './styles/GenericStyle.js',
    './styles/GroundStyle.js',
    './styles/IMACStyle.js',
    './styles/Style.js',
    './schedulesDB/schedules.json',
    './service-worker.js'
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(VER).then(function(cache) {
            var newImmutableRequests = [];
            return Promise.all(
                immutableRequests.map(function(url) {
                    return caches.match(url).then(function(response) {
                        if (response) {
                            return cache.put(url, response);
                        } else {
                            newImmutableRequests.push(url);
                            return Promise.resolve();
                        }
                    });
                })
            ).then(function() {
                return cache.addAll(newImmutableRequests.concat(mutableRequests));
            }).then(function() {
                self.skipWaiting();
            });
        })
    );
});

self.addEventListener( "activate", event => {
    // console.log('WORKER: activate event in progress.');
    
    // clear all other versions other than the current
    var cachesToKeep = [VER];

    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (cachesToKeep.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

// always go to network first and update cache, use cache if offline
self.addEventListener('fetch', event => {
    
    if (event.request.method !== 'GET') return;
        
    event.respondWith(
            async function() {
                // Try to get the response from a cache.
                const cache = await caches.open(VER);
                const cachedResponse = await cache.match(event.request);

                if (cachedResponse) {
                    // If we found a match in the cache, return it, but also
                    // update the entry in the cache in the background.
                    event.waitUntil(cache.add(event.request));
                    return cachedResponse;
                }
                // If we didn't find a match in the cache, use the network and add to the cache                
                return fetch(event.request).then(function (res) {
                    cache.put(event.request, res.clone());
                    return res;
                });                                               
            }()
    );
        
});

/*
self.addEventListener('updatefound', () => {
    // currently not used
    //console.log("updated SW "+ VER);    
});
*/