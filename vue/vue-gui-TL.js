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

/*
 * Do NOT place any of the three.js components into Vue and it will make them reactive with all getters and setters and very slow
 * only do that if placed as static objects
 */

/* global fpenv, scene, renderer, THREE, rm, model, pathArray, camera, controls, plot, split, binReader, modal */

var guiTL = new Vue({
    
    locale: 'en',
    
    el: '#guiTL',
    
    created: function() {
        
        // get local version from fpenv
        this.SWVer = fpenv.getFCVersion();
        
        var data = {
            code: '12345'
        };

        var that = this;
        // get remote version from Ajax
        $.post('./Ajax_Get_Ver.php', data, function(response) {

            if(response) {
                try {                    
                    that.SWVerWeb = response;
                } catch(e) {
                    return;
                }
            }
        });
        this.zooms = fpenv.getZooms();
        this.zooms2 = fpenv.getZooms2();
        
    },
    
    data: {
        jsonFileName: 'file not loaded',
        SWVer: '',
        SWVerWeb: 'offline',
        zooms: false,
        zooms2: false,
        rollAngle: "",
        yawAngle: "",
        pitchAngle: "",
        rollDegRange: 0,
        cpos: 0,
        duration: "0m0s",
        judgingduration: "0m0s",
        followMe: false,
        captureCanvas: false,
        originGPS: {
            lat: 0.00,
            lng: 0.00,
            alt: 0.00
        },
        pilotGPS:   {
            lat: 0.00,
            lng: 0.00,
            alt: 0.00
        },
        centerGPS:  {
            lat: 0.00,
            lng: 0.00,
            alt: 0.00
        }
    },
    
    computed:   {
        
        originLink: function () {
            
            let url = 'https://www.google.com/maps/search/?api=1&query=' + 
                    this.originGPS.lat + ',' + 
                    this.originGPS.lng;
            
            return url;
        },
        
        pilotLink: function () {
            
            let url = 'https://www.google.com/maps/search/?api=1&query=' + 
                    this.pilotGPS.lat + ',' + 
                    this.pilotGPS.lng;
            
            return url;
        },
        
        centerLink: function () {
            
            let url = 'https://www.google.com/maps/search/?api=1&query=' + 
                    this.centerGPS.lat + ',' + 
                    this.centerGPS.lng;
            
            return url;
        }
    },
    
    methods:    {
                
        errormessage: function(text) {
            this.$message.error(text);
        },
        
        openZooms: function()   {
            this.zooms;
            fpenv.setZooms(this.zooms);
        },
        
        openZooms2: function()   {
            this.zooms2;
            fpenv.setZooms2(this.zooms2);
        },
        
        setRoll: function(r,y,p)   {
            r = r/Math.PI*180;
            y = y/Math.PI*180;
            p = p/Math.PI*180;
            this.rollAngle = r.toFixed(1);
            this.yawAngle = y.toFixed(1);
            this.pitchAngle = p.toFixed(1);
        },
        
        setDuration: function(dur)  {
            this.duration = dur;
        },
        
        setJudgingDuration: function(dur)  {
            this.judgingduration = dur;
        }
        
    }
});