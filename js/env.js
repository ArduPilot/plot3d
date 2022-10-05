/* 
 * This file is part of Flight Plotter.
 
 * 
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
    Created on : Sep. 2020
    Author     : Artur Uzieblo
*/


/* global guiTL, plot */

// Flight Plotter ENVironment, mostly holds 'global' variables used by all modules
// it has been shaped to a singleton class (just one global variable)

const VER = 'v2.3.1H';  // used to provide running version
const jsonver = "1.3";
const rootpath = ".";
const MODEL = "/osbipe2/bipe2.obj";  // ./models/osbipe/Biplane.obj
const MODELMATERIALS = "/osbipe2/bipe2.mtl";  // ./models/osbipe/Biplane.obj
const MODELSCALE = 2000;

var fpenv = (function() {

// private members

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);    
    var start = 0;
    var stop = 20000;
    var elevate = 0.0;
    var minalt = -10;
    var mOriginEnable = false;
    var moveEast = 0.0;   // move originGPS East that many m
    var moveNorth = 0.0;  // move originGPS North that many m
    var moveDown = 0.0;  // move originGPS Down that many m
    var rrotation = 0;
    var obearing = 0;
    var wingspan = 4;
    var modelwingspan = 16;
    var model = MODEL;
    var modelmaterials = MODELMATERIALS;
    var modelscale = MODELSCALE;
    var modelPos = 0;
    var flying = false;
    var dropFrames = 1;
    var zooms = false;
    var zooms2 = false;
    let performance = true;
    var template = ['F3A', '23', 'P23_template_150.json'];   // default value
    var schedule = ['Generic', 'Generic'];    
    var schedules = [
        {
        "value": "Generic",
        "label": "Generic",
        "views": {
            "default": {
                "camera" : [178.8,164.4,586.6],
                "target" : [10.0,0.0,-215.0]
            },
            "judge": {
                "camera" : [41.0,17.5,404.9],
                "target" : [4.1,173.7,-295.3]
                },
            "top": {
                "camera" : [4.2,713.5,12.7],
                "target" : [4.7,160.0,-33.8]
                },
            "left": {
                "camera" : [-498.4,75.3,-1.4],
                "target" : [64.8,85.4,-20.2]
                },
            "right":    {
                "camera" : [450.2,49.7,-6.1],
                "target" : [-114.5,99.9,-31.3]
                },
            "mid":  {
                "camera" : [2.3,121.5,553.0],
                "target" : [15.5,115.5,-284.1]
                }
        },
        "children": [
            { 
                "value": "Generic", 
                "label": "Generic",
                "minalt": -10,
                "model" : "/osbipe/Biplane.obj",
                "modelscale" : 2000,
                "mans": [                    
                    {"name" : "tkoff", "id" : "sp_0", "sp": 0, "wd": 5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "1", "id": "sp_1", "sp": 1, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "2", "id": "sp_2", "sp": 2, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "3", "id": "sp_3", "sp": 3, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "4", "id": "sp_4", "sp": 4, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "5", "id": "sp_5", "sp": 5, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "6", "id": "sp_6", "sp": 6, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "7", "id": "sp_7", "sp": 7, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "8", "id": "sp_8", "sp": 8, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "9", "id": "sp_9", "sp": 9, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "10", "id": "sp_10", "sp": 10, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "11", "id": "sp_11", "sp": 11, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "12", "id": "sp_12", "sp": 12, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "13", "id": "sp_13", "sp": 13, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "14", "id": "sp_14", "sp": 14, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "15", "id": "sp_15", "sp": 15, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "16", "id": "sp_16", "sp": 16, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "17", "id": "sp_17", "sp": 17, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "18", "id": "sp_18", "sp": 18, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "19", "id": "sp_19", "sp": 19, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "20", "id": "sp_20", "sp": 20, "wd": 4.5, "start": 0, "stop": 0, "sel": false, "background": ""},
                    {"name" : "lnd", "id": "sp_21", "sp": 21, "wd": 5, "start": 0, "stop": 0, "sel": false, "background": ""}
                ]
            }
        ]
        }
    ];    
    const fpVer = jsonver;
    var FCVer = VER;
    var fileVer = "";
    var file = "logdata.js";
    var originGPS = {
        lat: 0.00,
        lng: 0.00,
        alt: 0.00
    };
    var pilotGPS =    {
        lat: 0.00,
        lng: 0.00,
        alt: 0.00
    };
    var centerGPS =  {
        lat: 0.00,
        lng: 0.00,
        alt: 0.00
    };
    var siteSel = ['AUS','VIC','GMAC','EW'];
    var openAtt = false;
    var openVel = false;


    // private member functions
    function readParameters ()   {
        
        getSchedules(); // run it first as it is asycn and make take longer
        
        elevate = urlParams.get('elevate') !== null ? parseInt(urlParams.get('elevate')) : 0;   // null if empty
        elevate = elevate < -10 || elevate > 50 ? 0 : elevate;
        
        mOriginEnable = urlParams.get('moveOrigin') === 'true' ? true : false;   // null if empty        
        
        zooms = urlParams.get('zooms') === 'true' ? true : false;   // null if empty
        zooms2 = urlParams.get('zooms2') === 'true' ? true : false;   // null if empty

        ck = getCookie("FP[wingspan]");
        if (ck)
            wingspan = parseInt(ck);
        wingspan = wingspan > 10 ? 10 : wingspan;
        wingspan = wingspan < 2 ? 2 : wingspan;

        ck = getCookie("FP[modelwingspan]");
        if (ck)
            modelwingspan = parseInt(ck);   
        modelwingspan = modelwingspan > 16 ? 5 : modelwingspan;
        modelwingspan = modelwingspan < 2 ? 2 : modelwingspan;

        ck = getCookie("FP[performance]");
        if (ck)
            performance = ck === 'false' ? false : true;
        
        ck = getCookie("FP[schedule]");
        if (ck)
            schedule = JSON.parse(ck);
        
        ck = getCookie("FP[template]");
        if (ck)
            template = JSON.parse(ck);
                
        ck = getCookie("FP[pilot]");
        if (ck)
            pilotGPS = JSON.parse(ck);
        
        ck = getCookie("FP[site]");
        if (ck) {
            siteSel = JSON.parse(ck);
        }   else {
            siteSel = ['manual','','',''];
            document.cookie = "FP[site]="+JSON.stringify(siteSel)+";max-age=31536000;";
        }
        
        ck = getCookie("FP[center]");
        if (ck)
            centerGPS = JSON.parse(ck);
        
        ck = getCookie("FP[model]");
        if (ck) {
            model = JSON.parse(ck);
        }   else {
            model = MODEL;
            document.cookie = "FP[model]="+JSON.stringify(MODEL)+";max-age=31536000;";
        }
        
        ck = getCookie("FP[modelmaterials]");
        if (ck) {
            modelmaterials = JSON.parse(ck);
        }   else {
            modelmaterials = MODELMATERIALS;
            document.cookie = "FP[modelmaterials]="+JSON.stringify(MODELMATERIALS)+";max-age=31536000;";
        }
        
        ck = getCookie("FP[modelscale]");
        if (ck) {
            modelscale = JSON.parse(ck);
        }   else {
            modelscale = MODELSCALE;
            document.cookie = "FP[modelscale]="+JSON.stringify(modelscale)+";max-age=31536000;";
        }

        ck = getCookie("FP[dropFrames]");
        if (ck) {
            dropFrames = JSON.parse(ck);
            dropFrames = dropFrames > 20 ? dropFrames=20 : dropFrames;
        }   else {
            dropFrames = 0;
            document.cookie = "FP[dropFrames]="+JSON.stringify(dropFrames)+";max-age=31536000;";
        }

        ck = getCookie("FP[zooms]");
        if (ck)
            zooms = JSON.parse(ck);
        
        ck = getCookie("FP[zooms2]");
        if (ck)
            zooms2 = JSON.parse(ck);
                        
    }
    
    function getCookie(name) {
        // Split cookie string and get all individual name=value pairs in an array
        var cookieArr = document.cookie.split(";");    
        // Loop through the array elements
        for(var i = 0; i < cookieArr.length; i++) {
            var cookiePair = cookieArr[i].split("=");        
            /* Removing whitespace at the beginning of the cookie name
            and compare it with the given string */
            if(name === cookiePair[0].trim()) {
                // Decode the cookie value and return
                return decodeURIComponent(cookiePair[1]);
            }
        }    
        // Return null if not found
        return null;
    }
    
    async function getSchedules()  {
            // read the file once only, at the opening
        var response = await fetch(rootpath+'/schedulesDB/schedules.json');
        schedules = await response.json();
        
    }


    return    {
        
        // public interface
        
        load: function () { readParameters(); },
        // reset invalidates all parameters passed to the program, needs to be reviwed, introduced with JSON
        reset: function () { 
            start = 0;
            stop = 1;
            elevate = 0;
            mOriginEnable = false;
            moveEast = 0;
            moveNorth = 0;
            moveDown = 0;
            rrotation = 0;
            obearing = 0;
            wingspan = 4;
            modelwingspan = 16;
            model = MODEL;
            modelmaterials = MODELMATERIALS;
            modelscale = MODELSCALE;
            modelPos = 0;
            flying = false;
            zooms = false;
            zooms2 = false;
            performance = true;
            originGPS = {
                lat: 0.00,
                lng: 0.00,
                alt: 0.00
            };
        },
        
        getFile: function () { return file; },
        
        getPerformance: function () { return performance; },
        setPerformance: function (pf) {             
            document.cookie = "FP[performance]="+JSON.stringify(pf)+";max-age=31536000;";},
        
        getSchedules: function () { return schedules; },
        
        getSchedule: function () { return schedule; },
        setSchedule: function (st) { 
            schedule = typeof st !== "undefined" ? st : ['Generic', 'generic'];
            document.cookie = "FP[schedule]="+JSON.stringify(st)+";max-age=31536000;";},
        
        getTemplate: function () { return template; },
        setTemplate: function (st) { 
            template = typeof st !== "undefined" ? st : ['F3A', '23', 'P23_template_150.json'];
            document.cookie = "FP[template]="+JSON.stringify(st)+";max-age=31536000;";},
        
        getStart: function () { return start; },
        setStart: function (st) { st = parseInt(st); start = st; },
            
        getStop: function () { return stop; },
        setStop: function (st) { st = parseInt(st); stop = st; },        
            
        getElevate: function () { return elevate; },
        setElevate: function (st) { st = st !== null ? parseInt(st) : 0; elevate = st;},    // do not set cookie, only parameter driven
        
        getMinAlt: function () { return minalt; },
        setMinAlt: function (st) { st = st !== null ? parseInt(st) : 0; minalt = st;},    // do not set cookie, only parameter driven
        
        getMoveOrigin: function () { return mOriginEnable; },
            
        getWingspan: function () { return wingspan; },
        setWingspan: function (st) { st = parseInt(st); wingspan = st; document.cookie = "FP[wingspan]="+st+";max-age=31536000;";},
            
        getModelWingspan: function () { return modelwingspan; },
        setModelWingspan: function (st) { st = parseInt(st); modelwingspan = st; document.cookie = "FP[modelwingspan]="+st+";max-age=31536000;";},
        
        getDropFrames: function () { return dropFrames; },
        setDropFrames: function (st) { st = parseInt(st); dropFrames = st; document.cookie = "FP[dropFrames]="+st+";max-age=31536000;";},
        
        getModel: function () { return "./models"+model; },
        setModel: function (st) { model = st; document.cookie = "FP[model]="+JSON.stringify(st)+";max-age=31536000;";},
        
        getModelMaterials: function () { return "./models"+modelmaterials; },
        setModelMaterials: function (st) { modelmaterials = st; document.cookie = "FP[modelmaterials]="+JSON.stringify(st)+";max-age=31536000;";},
        
        getModelScale: function () { return modelscale; },
        setModelScale: function (st) { st = st !== null ? parseInt(st) : 2000; modelscale = st; document.cookie = "FP[modelscale]="+JSON.stringify(st)+";max-age=31536000;"; },
        
        getMoveEast: function () { 
            return moveEast; 
        },
        setMoveEast: function (m) { moveEast = m; },
        
        getMoveNorth: function () { 
            return moveNorth; 
        },
        setMoveNorth: function (m) { moveNorth = m; },
        
        getMoveDown: function () { 
            return moveDown; 
        },
        setMoveDown: function (m) { moveDown = m; },
        
        getOrigin: function () { return originGPS; },
        setOrigin: function (lat, lng, alt) { originGPS.lat = lat; originGPS.lng = lng; originGPS.alt = alt; guiTL.originGPS.lat = lat; guiTL.originGPS.lng = lng; guiTL.originGPS.alt = alt; },
        
        getPilot: function () { return pilotGPS; },
        setPilot: function (gps) { 
            pilotGPS = JSON.parse(JSON.stringify(gps)); 
            document.cookie = "FP[pilot]="+JSON.stringify(pilotGPS)+";max-age=31536000;"; 
                    guiTL.pilotGPS.lat = pilotGPS.lat; 
                    guiTL.pilotGPS.lng = pilotGPS.lng; 
                    guiTL.pilotGPS.alt = pilotGPS.alt;},
        
        getCenter: function () { return centerGPS; },
        setCenter: function (gps) { 
            centerGPS = JSON.parse(JSON.stringify(gps)); document.cookie = "FP[center]="+JSON.stringify(centerGPS)+";max-age=31536000;";
                    guiTL.centerGPS.lat = centerGPS.lat; guiTL.centerGPS.lng = centerGPS.lng; guiTL.centerGPS.alt = centerGPS.alt;
                },
        
        getSite: function () { return siteSel; },
        setSite: function (site) { siteSel = JSON.parse(JSON.stringify( site )); document.cookie = "FP[site]="+JSON.stringify(siteSel)+";max-age=31536000;";},
            
        getRotationRad: function () { return rrotation; },
        getRotationDeg: function () { return rrotation/Math.PI*180; },
        setRotationDeg: function (st) { rrotation = st/180*Math.PI; //document.cookie = "FP[rotation]="+rrotation+";max-age=31536000;";
                                        },
        setRotationRad: function (st) { rrotation = st; //document.cookie = "FP[rotation]="+rrotation+";max-age=31536000;";
                                        },
                                        
        setObearingRad: function (st) { obearing = st;},
        getObearingRad: function () { return obearing;},
        
        getVersion: function () { return fpVer; },
        
        getFCVersion: function () { return FCVer; },
        setFCVersion: function (ver) { FCVer = ver;},
        
        setFileVersion: function (st) { fileVer = st;},
        getFileVersion: function () { return fileVer;},
        
        getFlying: function () { return flying;},
        stopFlying: function () { flying = false;},
        flipFlying: function () { flying = !flying;},
        
        getZooms: function () { return zooms;},
        setZooms: function (vw) { zooms = vw; document.cookie = "FP[zooms]="+JSON.stringify(zooms)+";max-age=31536000;";},
        
        getZooms2: function () { return zooms2;},
        setZooms2: function (vw) { zooms2 = vw; document.cookie = "FP[zooms2]="+JSON.stringify(zooms)+";max-age=31536000;";},
        
        getAtt: function () { return openAtt;},
        setAtt: function (state) { openAtt = state;},
        
        getVel: function () { return openVel;},
        setVel: function (state) { openVel = state;},
        
        getModelPos: function () { return modelPos;},
        setModelPos: function (st) { modelPos = st < 0 ? 0 : st;},
        incModelPos: function () {
            modelPos++;       
            if (modelPos > stop - start - 1)  {
                modelPos = stop - start - 1;
            }
            return modelPos;
        },
        decModelPos: function () {                
            modelPos--;
            if (modelPos < 0 )  {
                modelPos = 0;
            }
        },
        lastModelPos: function () {
            modelPos = stop - start - 1;
        }        

    };
    
})();

fpenv.load();
