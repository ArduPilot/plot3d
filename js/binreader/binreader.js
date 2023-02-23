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
    Created on : Oct. 2020
    Author     : Artur Uzieblo
*/

/* global parseInt, binReader, guiSM, fpenv, jsonver, guiBL, split, rootpath */

const siteMargin = 50; 
//const minAlt = 1;   // 1m below origin
const minAlt = 10;   // 10m below origin

/*
 * binReader closely works with the Site and schedule Modal but it has been kept separate.
 * This calls for the sharing the same data. Master data is stored in binReader and only minimum
 * data that is required to be selected byu the user or displayed is duplicated to the Modal
 * The data is synchronised over Env variables that can be accessed from different parts of the program
 */

class BinReader {
    
    constructor() {
        // the class is initiatised with static values and 
        // some requests for further updates are sent to the network/cache
        // when response arrives the data needs ot be updated and some GUI parts redrawn
        
        this.reader = null;
        this.binstring = null;
        this.fmtcodes= []; // associative array to store block codes
        this.str= '';
        this.data = [];
        this.data2 = [];
        this.that = this;
        this.modal = document.getElementById('siteModal');
        this.count = 0;
        this.count2 = 0;
        this.json = null;
        fpenv.setMinAlt(minAlt);
        // initialise with the largest set of mans (make generic the largest)
        this.mans = [                    
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
                    {"name" : "Lnd", "id": "sp_21", "sp": 21, "wd": 5, "start": 0, "stop": 0, "sel": false, "background": ""}
                ];
        this.site = {
            notfound: true, // false if valid site was found
            meast: 16,
            mnorth: 8,
            malt: 0,
            rot: 72,
            siteSel: ['AUS','VIC','GMAC','EW'], // defaults to GMAC
            name: 'AUS_VIC_GMAC_EW'
        };
        this.pilotGPS = {
            lat: 0.00,
            lng: 0.00,
            alt: 0.00
        };
        this.centerGPS = {
            lat: 0.00,
            lng: 0.00,
            alt: 0.00
        };
        this.orgGPS = {
            lat: 0.00,
            lng: 0.00,
            alt: 0.00
        };
        this.bfname = '';
        // used to pre-allocate maneuvers to flight points
        this.schedule = JSON.parse(JSON.stringify( fpenv.getSchedule() ));        
        this.schedules = {}; this.getSchedulesDB(); // initialise with Generic or cookie schedule
        this.sites = []; this.getSiteDB();     // to be populated from the network or cache
        this.output =    {
            version : jsonver,
            comments : "DO NOT EDIT",
            name : '',
            parameters : {
                rotation :  0,
                moveEast :  0,
                moveNorth : 0,
                elevate :   0,
                start :     0,
                stop :      20000,
                wingspan :  fpenv.getWingspan(),
                modelwingspan : fpenv.getModelWingspan(),
                originLat:  0.00,
                originLng:  0.00,
                originAlt:  0.00,
                schedule:   this.schedule
            },        
            view : {
                position : {
                    x : -120,
                    y : 130.5,
                    z : 265
                },
                target : {
                    x : -22,
                    y : 160,
                    z : -204         
                }
            },
            mans : this.mans,
            data : this.data,
            data2 : this.data2
        };
        this.event = new Event('newJSON');
        
    }
    
    getSites() {
        return this.sites;
    }
    
    setOrigin(origin) {
        this.orgGPS  = JSON.parse(JSON.stringify( origin ));
    }
    
    async getSiteDB() {
        // AJAX call to retrieve the latest site dB
        // the results are cached by service worker
        
        var response = await fetch(rootpath+'/siteDB/sites.json');
        var json = await response.json();
        
        this.sites = JSON.parse(JSON.stringify( json ));
        // skip the first
        this.sites.shift();
        // use the rest
        guiSM.sites = JSON.parse(JSON.stringify( json ));
        // instruct GUI to skip the first too
        guiSM.sites.shift();
        
    }

    async getSchedulesDB() {
        // AJAX call to retrieve the latest schedules dB
        // the results are cached by service worker
        
        var response = await fetch(rootpath+'/schedulesDB/schedules.json');
        var json = await response.json();
        
        // the code below will execute after above requests are completed 
        // and most likely after the initialisation code already completed
        // some objects like plot do not exist at the time of the request
        // but are likely to exist when response arrives
        
        // updates schedules and GUI
        this.schedules = JSON.parse(JSON.stringify( json ));  // deep copy both
        guiSM.schedules = JSON.parse(JSON.stringify( json ));
        
        // find the mans for the current style/class for the splitter
        let classIdx = 0;   // default is 0 -> Generic        
        let styleIdx = this.schedules.findIndex(p => p.value === this.schedule[0]);        
        if (styleIdx !== -1 && this.schedules[styleIdx].children !== undefined)  {
            classIdx = this.schedules[styleIdx].children.findIndex(p => p.value === this.schedule[1]);
        }
        this.mans = this.schedules[styleIdx].children[classIdx].mans;
        fpenv.setModelMaterials(this.schedules[styleIdx].children[classIdx].modelmaterials);
        fpenv.setModel(this.schedules[styleIdx].children[classIdx].model);
        fpenv.setModelScale(this.schedules[styleIdx].children[classIdx].modelscale);
        
        // update GUI, splitter
        guiBL.updateMans(this.mans);
        // update GUI, box
        if (window.plot !== undefined)
            window.plot.updateBox();
    }

    // this is the main handler triggered by user
    changeH(event)    {        
        
        // copy manouvers
        let classIdx = 0;
        let styleIdx = this.schedules.findIndex(p => p.value === this.schedule[0]);
        if (styleIdx !== -1 && this.schedules[styleIdx].children !== undefined)  {
            classIdx = this.schedules[styleIdx].children.findIndex(p => p.value === this.schedule[1]);
        }
        this.mans = this.schedules[styleIdx].children[classIdx].mans;
        
        // process event of the user selecting and starting the BIN upload
        const fileList = event.target.files;
        
        const name = fileList[0].name ? fileList[0].name : 'NOT SUPPORTED';
        const type = fileList[0].type ? fileList[0].type : 'NOT SUPPORTED';
        const size = fileList[0].size ? fileList[0].size : 'NOT SUPPORTED';
        //alert("name: "+name+"\r\ntype: "+type+"\r\nsize: "+size);
        /*
        if (type 
                && type.indexOf('application/octet-stream') === -1 
                && type.indexOf('application/macbinary') === -1 
                && type.indexOf('application/dflog') === -1) {
            return;
        }
        */
       
        // if the file is there and right type create reader
        var that = this;
        // re-initialise members for second read
        this.binstring = null;
        this.bfname = name.split('.')[0];
        //this.bfname = ( name.split('.')[0] * 1 ).toString(); // remove leading 0s
        this.fmtcodes= []; // associative array to store block codes
        this.str= '';
        this.data = [];
        this.data2 = [];
        this.count = 0;
        this.count2 = 0;
        this.json = null;
        // define the handler for processing complete BIN file
        this.reader = new FileReader();
        this.reader.addEventListener('load', function(event) { that.processBin_part1(event); } );
        this.reader.readAsBinaryString(fileList[0]);     
    }
    
    // this is the main handler when file finished loading
    processBin_part1(event)    {

        this.binstring = event.target.result;
        
        // clear selected file so it can be reloaded if requested
        $("#bin-file-selector").val("");
        
        this.processFMTs();
        
        this.processMessages(); // includes origin
        
        this.findSite();  // also sets up the modal        
        
        // open modal
        this.modal.style.display = 'block';
        
    }
        
        // Bin file processing top function
    processBin_part2()   {
        
        // triggered by modal closure
        this.schedule = JSON.parse(JSON.stringify(guiSM.schedule));
        
        // copy manouvers
        let classIdx = 0;
        let styleIdx = this.schedules.findIndex(p => p.value === this.schedule[0]);
        if (styleIdx !== -1 && this.schedules[styleIdx].children !== undefined)  {
            classIdx = this.schedules[styleIdx].children.findIndex(p => p.value === this.schedule[1]);
        }
        let currsched = this.schedules[styleIdx].children[classIdx];        
        this.mans = currsched.mans;        
        guiBL.updateMans(this.mans);
        
        // set min alt
        this.minalt = currsched.minalt === 'undefined' ? 
                fpenv.getMinAlt() : 
                currsched.minalt;
        fpenv.setMinAlt(this.minalt);
        
        // set model
        currsched.model === 'undefined' ? fpenv.getModel() : fpenv.setModel(currsched.model);
        currsched.modelmaterials === 'undefined' ? fpenv.getModelMaterials() : fpenv.setModelMaterials(currsched.modelmaterials);
        currsched.modelscale === 'undefined' ? fpenv.getModelScale() : fpenv.setModelScale(currsched.modelscale);
        
        // work out positions, rotation and moves
        this.pilotGPS = JSON.parse(JSON.stringify( fpenv.getPilot() ));
        this.centerGPS = JSON.parse(JSON.stringify( fpenv.getCenter() ));                
        this.site.rot =  this.rotation( this.pilotGPS, this.centerGPS);
        this.site.mnorth =  this.moveOrgN2p( this.pilotGPS, this.orgGPS);
        this.site.meast =  this.moveOrgE2p( this.pilotGPS, this.orgGPS);
      
        // work with the site
        this.site.siteSel =  JSON.parse(JSON.stringify( fpenv.getSite() ));
        this.site.siteSel[0] === '' ? 
            this.site.name = 'manual' : 
            this.site.name =  this.site.siteSel[0] +'_'+ this.site.siteSel[1] +'_'+ this.site.siteSel[2] +'_'+ this.site.siteSel[3];
        
        let dist = Math.sqrt( Math.pow(this.site.meast, 2) + Math.pow(this.site.mnorth, 2) );
                        
        if (dist > siteMargin)  {
            alert('Provided site GPS coordinates are more than '+siteMargin+'m from the origin');
            return;
        }                
        
        this.processMetaData();
                
        this.json = JSON.stringify(this.output);
        
        // fire new json event to pass control to json reader
        document.dispatchEvent(
            new CustomEvent("newJSON", {
                // details are set to json
                detail: this.json,
                bubbles: true,
                cancelable: true,
                composed: false
            })
        );

        this.setDefView(this.schedule);
                
    }
    
    setDefView(sched)  {
        
        let json = fpenv.getSchedules();        
            // find the mans for the current style/class for the splitter
        let styleIdx = json.findIndex(p => p.value === sched[0]);
        if (styleIdx !== -1 && json[styleIdx].views !== undefined)  {
            // fire event to adjust default view in Plotter
            document.dispatchEvent(
                new CustomEvent("adjustDefView", {
                    // details are set to json
                    detail: json[styleIdx].views,
                    bubbles: true,
                    cancelable: true,
                    composed: false
                })
            );
        }
    }
    
    findSite()  {
                
        // review all sites and find one with closest origin distance        
        
        let dist = null;
        let closeSites = 0;
        let countryL = '';
        let districtL = '';
        let siteL = '';
        let lineL = '';        
                
        for (let country = 0; country < this.sites.length; country++)    {
            countryL = this.sites[country].value;
            for (let district = 0; this.sites[country].children && district < this.sites[country].children.length; district++)    {
                districtL = this.sites[country].children[district].value;
                for (let site = 0; site < this.sites[country].children[district].children.length; site++)    {
                    siteL = this.sites[country].children[district].children[site].value;
                    for (let line = 0; line < this.sites[country].children[district].children[site].children.length; line++)    {
                        lineL = this.sites[country].children[district].children[site].children[line].value;
                            // find distance between Origin and Pilot
                        dist = this.distance(this.orgGPS, this.sites[country].children[district].children[site].children[line].pilotGPS);
                        //console.log('distance ' + dist);
                        
                        if (dist < siteMargin)  {                            
                                // found first site                           
                            if ( closeSites === 0 ) {
                                // first close site found
                                this.pilotGPS = this.sites[country].children[district].children[site].children[line].pilotGPS;
                                this.centerGPS = this.sites[country].children[district].children[site].children[line].centerGPS;
                                let rot = this.rotation(this.pilotGPS,this.centerGPS);
                                let bearing = this.rotation(this.pilotGPS,this.orgGPS);
                                fpenv.setObearingRad(bearing);
                                guiSM.pilotGPS = this.pilotGPS;
                                guiSM.centerGPS = this.centerGPS;
                                guiSM.selectSite = false;
                                this.site = {
                                    notfound: false, // false if valid site was found
                                    mnorth: this.moveOrgN2p(
                                                this.sites[country].children[district].children[site].children[line].pilotGPS,
                                                this.orgGPS),
                                    meast: this.moveOrgE2p(
                                                this.sites[country].children[district].children[site].children[line].pilotGPS,
                                                this.orgGPS),
                                    malt: this.moveOrgA2p(
                                                this.sites[country].children[district].children[site].children[line].pilotGPS,
                                                this.orgGPS),
                                    rot: rot,
                                    siteSel: [ countryL, districtL, siteL, lineL],
                                    name: countryL + '_' + districtL + '_' + siteL + '_' + lineL
                                };
                                guiSM.siteSel = [ countryL, districtL, siteL, lineL];
                                fpenv.setSite(this.site);
                                console.log("found first site " + this.site.name + ' with distance ' + dist);
                                closeSites++;                                
                            }   else {
                                // more close sites found, reset and exit for manual selection
                                this.site.notfound = true; // false if valid site was found
                                guiSM.selectSite = true;
                                console.log("found another site " + countryL + '_' + districtL + '_' + siteL + '_' + lineL + " with distance " + dist);
                            }                                                        
                        }
                    }                    
                }
            }
        }                
    }
    
    processMetaData()   {
        // metadata is extracted or calculated from the data points and is placed before the main data section
        
        // filter data for minimum altitude
        // do that across all flight
        for (var i=0; i < this.data.length; i++) {
                        
            if (this.data[i].D > this.minalt)    {
                this.data.splice(i, 1);
                i=i-1;
            }
            
        }
        
        // split the points against mans
        this.count = this.data.length;
        let ln = this.mans.length;
        this.mans[0].start = 0;
        this.mans[0].stop = Math.round(this.mans[0].wd/100 * this.count);
        for (let i = 1; i < ln; i++)   {                
            this.mans[i].start = this.mans[i - 1].stop;
            this.mans[i].stop = this.mans[i].start + Math.round(this.mans[i].wd/100 * this.count);
        }
        this.mans[this.mans.length-1].start = this.mans[this.mans.length-2].stop;
        this.mans[this.mans.length-1].stop =  this.count-1;
        
        // calculate rotation and move        
        this.output.name = 
                this.site.name + '_' +
                guiSM.schedule[0] + '_' +
                guiSM.schedule[1] + '_' +
                this.formatDate() + '_' +
                this.bfname + 
                '.json';
        this.output.parameters.rotation = this.site.rot;
        this.output.parameters.moveEast = this.site.meast;
        this.output.parameters.moveNorth = this.site.mnorth;
        this.output.parameters.elevate = fpenv.getElevate();
        this.output.parameters.start = 0;
        this.output.parameters.stop = this.count;
        this.output.parameters.wingspan = fpenv.getWingspan();
        this.output.parameters.modelwingspan = fpenv.getModelWingspan();
        this.output.parameters.originLat= this.orgGPS.lat;
        this.output.parameters.originLng= this.orgGPS.lng;
        this.output.parameters.originAlt= this.orgGPS.alt;
        this.output.parameters.pilotLat= this.pilotGPS.lat;
        this.output.parameters.pilotLng= this.pilotGPS.lng;
        this.output.parameters.pilotAlt= this.pilotGPS.alt;
        this.output.parameters.centerLat= this.centerGPS.lat;
        this.output.parameters.centerLng= this.centerGPS.lng;
        this.output.parameters.centerAlt= this.centerGPS.alt;
        this.output.parameters.schedule= fpenv.getSchedule();
        this.output.mans = this.mans;
        this.output.data = this.data;
        this.output.data2 = this.data2;

    }

    processFMTs()  {
        // these are the log format messages that define how to access the data section
        // some information needs to be extracted here first before reading the data section
            
        let fmtheader = 'a39580';  // ardupilot values
        let fmtheaderbytes = this.hex2bin(fmtheader);  // convert to bin for string searching    
        let pos = this.strpos(this.binstring, fmtheaderbytes, 0); // start searching from position 0    
        let fmtunpack = 'C2/C/Ct/Cl/a4FMT/a70Type';    // upack format
        var un = unpack(fmtunpack, this.binstring.slice(pos,pos+1000) );    // unpack to the known format   

        while (pos !== false)  {
            // scan through all FMT blocks
            pos = this.strpos(this.binstring, fmtheaderbytes, pos + 1); // find next block
            if (pos)   {   // if found next block
                un = unpack(fmtunpack, this.binstring.slice(pos,pos+1000) );
                this.fmtcodes[un['FMT']] = [];
                this.fmtcodes[un['FMT']]['code'] = un['t'];   // store block code for each type
                if ( un['Type'].indexOf('QB') < 0)
                    this.fmtcodes[un['FMT']]['format'] = 'Q';
                else
                    this.fmtcodes[un['FMT']]['format'] = 'QB';
            }    
        }
        
    }

    get_lat_lon_NED(loc1, loc2) {
        var longitude_scale = Math.cos(this.toRadians(loc1.lat));
        var LATLON_TO_M = 0.011131884502145034 * 1.0e7;
        var ret = {}
        ret.N = (loc2.lat - loc1.lat) * LATLON_TO_M;
        ret.E = (loc2.lng - loc1.lng) * LATLON_TO_M * longitude_scale;
        ret.D = loc1.alt - loc2.alt;
        return ret;
    }

    processMessages()  {
        // processing the main data section
        // currently it reads:
            // current configuration AHRS_EKF_TYPE=3 will use EKF3 filter 
                // this filter is better suited for vehicle that spends a significant amount of time pointing directly up or down.
                // EKF3 estimates for all 3 axis accelerometer offsets
            // EKx_IMU-MASK = 1 will use only the first IMU, if it was set to 3, it would use both
            // the output from EKF3 filter is logged in XKF1-5 messages
            // origin position - just one GPS position

        var pos = 1; // start from beginning
        var point = {};
        var un = {};
        this.data = [];
        this.data2 = [];

        // start looking for pose blocks, start from 0
        var msgtype = "POST";
        var pose = "a395" + this.dechex(this.fmtcodes[msgtype]['code']);
        var posebytes = this.hex2bin(pose);
        var poseunpack = 'C2header/Ctype/QTime/fPN/fPE/fPD/fQ1/fQ2/fQ3/fQ4/fRoll/fPitch/fYaw';

        // origin
        let orgn = "a395" + this.dechex(this.fmtcodes['ORGN']['code']);    // name:ORGN, type:QBLLe,TimeUS,Type,Lat,Lng,Alt
        let orgnbytes = this.hex2bin(orgn);
        let orgnunpack = 'C2header/Ctype/QTime/CType/lLat/lLng/lAlt'; // unpacking format (converting from binary to variables
        let posorgn = this.strpos(this.binstring, orgnbytes, pos + 1);
        let org = unpack(orgnunpack, this.binstring.slice(posorgn, posorgn + 500));
        this.orgGPS = {
            lat: org['Lat']*1.0e-7,
            lng: org['Lng']*1.0e-7,
            alt: org['Alt']*0.01
        };

        // use to force Origin to different location
        //this.orgGPS.lat = '53.354006';//53.354006, -1.197863
        //this.orgGPS.lng = '-1.197863';
        //this.orgGPS.alt = '108';
        
        console.log("found Origin " + this.orgGPS.lat + " " + this.orgGPS.lng + " " + this.orgGPS.alt);
        guiSM.originGPS = this.orgGPS;

        // handle loading dual logs
        if (fpenv.getShowDual()) {

            var msgtype = "VEH";
            var veh_marker = "a395" + this.dechex(this.fmtcodes[msgtype]['code']);
            var veh_bytes = this.hex2bin(veh_marker);

            pos = 1
            var veh_unpack = 'C2header/Ctype/QTime/CSysID/LTSec/LTUsec/LLat/LLon/fAlt/fR/fP/fY';

            while (pos !== false)  {

                point = {};

                pos = this.strpos(this.binstring, veh_bytes, pos + 1);

                if (pos) {
                    un = unpack(veh_unpack, this.binstring.slice(pos, pos + 500) );
                    var loc = {};
                    loc.lat = un['Lat'] * 1.0e-7;
                    loc.lng = un['Lon'] * 1.0e-7;
                    loc.alt = un['Alt'];

                    var NED = this.get_lat_lon_NED(this.orgGPS, loc);
                    // alert("PARSE NED: " + NED.N + " " + NED.E + " " + NED.D)

                    point.time  = un['Time'];
                    point.utc_time = un['TSec'] + un['TUsec']*1.0e-6;
                    point.N     = NED.N;
                    point.E     = NED.E;
                    point.D     = NED.D;
                    point.r     = un['R'];
                    point.p     = un['P'];
                    point.yw    = un['Y'];
                    if (un['SysID'] == 2) {
                        this.data2[this.count2] = point;
                        this.count2++;
                    } else {
                        this.data[this.count] = point;
                        this.count++;
                    }
                }
            }
            console.log("found " + this.count + " valid VEH points");
            return;
        }
        
        while (pos !== false)  {

            point = {};

            pos = this.strpos(this.binstring, posebytes, pos + 1);        // POSE1       

            if (pos)   {

                un = unpack(poseunpack, this.binstring.slice(pos, pos + 500) );        // position, velocities and angles

                if ( un['PN'] !== 0.0 
                    && un['PE'] !== 0.0 
                    && un['PD'] < minAlt )   {    // inverted as all altitudes increase towards -             
                        // proceed only if PXs are non zero
                        point.time  = un['Time'];
                        point.N     = un['PN'];
                        point.E     = un['PE'];
                        point.D     = un['PD'];
                        point.r     = un['Roll'];
                        point.p     = un['Pitch'];
                        point.yw    = un['Yaw'];
                        this.data[this.count] = point;
                        this.count++;
                    }
            }
        }

        // start looking for pose blocks, start from 0
        if (fpenv.getShowActual()) {
            var msgtype = "POSM";
            var pose = "a395" + this.dechex(this.fmtcodes[msgtype]['code']);
            var posebytes = this.hex2bin(pose);
            pos = 1

            while (pos !== false)  {

                point = {};

                pos = this.strpos(this.binstring, posebytes, pos + 1);        // POSE1

                if (pos)   {

                    un = unpack(poseunpack, this.binstring.slice(pos, pos + 500) );        // position, velocities and angles

                    if ( un['PN'] !== 0.0
                         && un['PE'] !== 0.0
                         && un['PD'] < minAlt )   {    // inverted as all altitudes increase towards -
                        // proceed only if PXs are non zero
                        point.time  = un['Time'];
                        point.N     = un['PN'];
                        point.E     = un['PE'];
                        point.D     = un['PD'];
                        point.r     = un['Roll'];
                        point.p     = un['Pitch'];
                        point.yw    = un['Yaw'];
                        this.data[this.count] = point;
                        this.count++;
                    }
                }
            }
        }
        
        if (this.count === 0)  {
            console.log("did not find useful pose data in BIN file. Please refer to FAQ pages.");
            alert("BIN Converter did not find useful pose data in the BIN file.\r\n\r\nPlease refer to FAQ pages.");
        }   else {            
            console.log("found " + this.count + " valid pose position points");
        }


    }

// utilities
    hex2bin(s) {

        let ret = [];
        let i = 0;
        let l;
        let str = '';

        s += '';

        for (l = s.length; i < l; i += 2) {

            var c = parseInt(s.substr(i, 1), 16);
            var k = parseInt(s.substr(i + 1, 1), 16);
            if (isNaN(c) || isNaN(k)) return false;
            ret.push((c << 4) | k);

            str = (c << 4) | k;
            str = str.toString();
        }
        
        //return String.fromCharCode.apply(null, ret);
        return String.fromCharCode.apply(String, ret);

    }

    dechex (number) {        
        if (number < 0) {number = 0xFFFFFFFF + number + 1;}    
        return parseInt(number, 10).toString(16);    
    }

    strpos (haystack, needle, offset) {    
        let i = (haystack+'').indexOf(needle, (offset || 0));    
        return i === -1 ? false : i;    
    }

    moveOrgN2p(g1, g2)   {
        
            // calculate north Origin adjustment            
            // get bearing from pilot to origin
        let rot = this.rotation(g1, g2);
            // get distance from pilot to origin
        let dist = this.distance( g1, g2 );
        
        return dist * Math.sin(rot);
    }
    
    moveOrgE2p(g1, g2)   {
            // calculate north Origin adjustment            
            // get bearing from pilot to origin
        let rot = this.rotation(g1, g2);
            // get distance from pilot to origin
        let dist = this.distance( g1, g2 );
        
        return dist * Math.cos(rot);    
    }
    
    moveOrgA2p(g1, g2)   {
            // calculate difference between origin and pilot alt        
        return g1.alt - g2.alt;
    }
    
    rotation(g1, g2){
        
        let startLat = this.toRadians(g1.lat);
        let startLng = this.toRadians(g1.lng);
        let destLat = this.toRadians(g2.lat);
        let destLng = this.toRadians(g2.lng);

        let y = Math.sin(destLng - startLng) * Math.cos(destLat);
        let x = Math.cos(startLat) * Math.sin(destLat) -
              Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
        let brng = Math.atan2(y, x);
        //console.log('bearing ' + this.toDegrees(brng));
        return brng;
        
    }
    
    distance(g1, g2) {
        
        const R = 6371000; // m
        
        let dLat = this.toRadians(g2.lat-g1.lat);
        let dLon = this.toRadians(g2.lng-g1.lng);
        let lat1 = this.toRadians(g1.lat);
        let lat2 = this.toRadians(g2.lat);

        let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        return R * c;
    }
        
    formatDate() {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear().toString().substr(-2);

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('_');
    }
            // Converts from degrees to radians.
    toRadians(degrees) {
        return degrees * Math.PI / 180;
    };
 
        // Converts from radians to degrees.
    toDegrees(radians) {
        return radians * 180 / Math.PI;
    }

}


