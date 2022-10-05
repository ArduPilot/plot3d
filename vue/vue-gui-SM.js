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

var guiSM = new Vue({
    
    locale: 'en',
    
    el: '#siteModal',
    
    created: function() {
                
        this.pilotGPS = JSON.parse(JSON.stringify( fpenv.getPilot()));
        this.centerGPS = JSON.parse(JSON.stringify( fpenv.getCenter()));
        this.schedule = JSON.parse(JSON.stringify( fpenv.getSchedule()));
        this.siteSel = JSON.parse(JSON.stringify( fpenv.getSite()));
    },

    data: {
        originGPS:   {
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
        },
        schedule: ['F3A','P21'],            // default value
        schedules: [],
        selectSite: true,
        siteSel: ['AUS','VIC','GMAC','EW'], // default value
        sites: []
    },
    
    computed:   {
                
        displayMove: function () {
            return !this.schedule[0].localeCompare("F3C");
        },

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
        
        readClip: function()    {
            
            let that = this;
            
            navigator.clipboard.readText().then( function (txt) {                
                let cl;
                try {
                    cl = JSON.parse(txt);
                } catch(e) {
                    alert("No site data in Clipboard"); // error in the above string (in this case, yes)!
                }
                if (cl.site === undefined || cl.pilot === undefined || cl.center === undefined)  {
                    alert("No site data in Clipboard"); // error in the above string (in this case, yes)!
                }
                if (that.siteSel[0] === "")   {
                    that.pilotGPS  = JSON.parse(JSON.stringify( cl.pilot ));
                    that.centerGPS = JSON.parse(JSON.stringify( cl.center ));
                    fpenv.setPilot(that.pilotGPS);
                    fpenv.setCenter(that.centerGPS);
                    guiSM.pilotGPS = that.pilotGPS;
                    guiSM.centerGPS = that.centerGPS;
                    fpenv.setSite(['manual','','','']);
                }
            });            
        },
                
        handleScheduleSelection: function(command) {            
            this.schedule = command;
        },
        
        copyOrigin: function()  {
            if (this.siteSel[0] === "")   {
                this.pilotGPS  = JSON.parse(JSON.stringify( this.originGPS ));
                this.centerGPS = JSON.parse(JSON.stringify( this.originGPS ));
            }
        },
                
        processBin_part2: function() {
            // triggered by user pressing Modal Submit button
            this.close();
            // run sets below as user may not change them
            fpenv.setPilot(this.pilotGPS);
            fpenv.setCenter(this.centerGPS);
            fpenv.setSite(this.siteSel);
            fpenv.setSchedule(this.schedule);
            binReader.processBin_part2();
        },

        siteSelection: function()   {            
            
            var countryIdx = this.sites.findIndex(p => p.value === this.siteSel[0]);
            var distIdx = 0;
            var locIdx = 0;
            var siteIdx = 0;
            if (countryIdx !== -1 && this.sites[countryIdx].children !== undefined)  {
                // existing site
                distIdx = this.sites[countryIdx].children.findIndex(p => p.value === this.siteSel[1]);
                locIdx = this.sites[countryIdx].children[distIdx].children.findIndex(p => p.value === this.siteSel[2]);
                siteIdx = this.sites[countryIdx].children[distIdx].children[locIdx].children.findIndex(p => p.value === this.siteSel[3]);

                this.pilotGPS = this.sites[countryIdx].children[distIdx].children[locIdx].children[siteIdx].pilotGPS;
                this.centerGPS = this.sites[countryIdx].children[distIdx].children[locIdx].children[siteIdx].centerGPS;
                fpenv.setPilot(this.pilotGPS);
                fpenv.setCenter(this.centerGPS);
                fpenv.setSite(this.siteSel);
                
            }   else {
                // set to manual
                this.pilotGPS = fpenv.getPilot();
                this.centerGPS = fpenv.getCenter();
                guiSM.pilotGPS = this.pilotGPS;
                guiSM.centerGPS = this.centerGPS;
                fpenv.setSite(['manual','','','']);
                
            }

        },
        
        manual: function()  {
            // resets the site selected from dB to manual
            this.siteSel = ['','','',''];
        },
               
        close: function() {            
            document.getElementById("siteModal").style.display = "none";
        }
        
    }
});