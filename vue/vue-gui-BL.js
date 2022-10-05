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

/* global fpenv, scene, renderer, THREE, rm, model, pathArray, camera, controls, plot, split, binReader, modal, JDURFACTOR, guiTL, guiScM */

var guiBL = new Vue({
    
    locale: 'en',
    
    el: '#guiBL',
    
    created: function() {
        
        this.manlen = this.mans.length;
        this.pntcount = this.mans[this.manlen-1].stop - this.mans[0].start;
        this.pntsDensity = this.pntcount/100;
        this.wdAdjustmentStep = this.adv/this.pntsDensity;
        this.calculatePointsfromWDs();
        
    },

    data: {
        attGraph: false,
        velGraph: false,
        splitterMode: false, // false - Single, true - Multi
        splitter: false,
        splitterbuttons: false,
        buttons: false,
        roll: 0,
        pitch: 0,
        yaw: 0,
        overlap: 200,    // max overlap points
        adv: 30,  // increment advance
        lastSelectedSplitter: 0,
        currentSelectedSplitter: 0,
        lastSelectedFirst: false,
        duration: 0,
        // used to display allocation of maneuvers to the position points
        mans: [
            {name: 'tkoff', "k" : 0, id: 'sp_0', sp: 0, wd: 3, start: 0, stop: 2600, sel: false, background: ''},
            {name: 'v8', "k" : 1, id: 'sp_1', sp: 1, wd: 5.5, start: 2600, stop: 3800, sel: false, background: ''}, // fig 8
            {name: 'stall', "k" : 1, id: 'sp_2', sp: 2, wd: 5.5, start: 3800, stop: 4350, sel: false, background: ''}, // stall turn
            {name: 'sqL', "k" : 1, id: 'sp_3', sp: 3, wd: 5.5, start: 4350, stop: 5100, sel: false, background: ''}, // square
            {name: '9', "k" : 1, id: 'sp_4', sp: 4, wd: 5.5, start: 5100, stop: 5720, sel: false, background: ''}, // 9
            {name: 'ke', "k" : 1, id: 'sp_5', sp: 5, wd: 5.5, start: 5720, stop: 6100, sel: false, background: ''}, // ke
            {name: 'sS', "k" : 1, id: 'sp_6', sp: 6, wd: 5.5, start: 6100, stop: 6400, sel: false, background: ''}, // sS
            {name: 'golf', "k" : 1, id: 'sp_7', sp: 7, wd: 5.5, start: 6400, stop: 7200, sel: false, background: ''}, // loop
            {name: 'shark', "k" : 1, id: 'sp_8', sp: 8, wd: 5.5, start: 7200, stop: 7800, sel: false, background: ''}, // shark
            {name: 'dImm', "k" : 1, id: 'sp_9', sp: 9, wd: 5.5, start: 7800, stop: 8700, sel: false, background: ''}, // imm
            {name: 'hB', "k" : 1, id: 'sp_10', sp: 10, wd: 5.5, start: 8700, stop: 9350, sel: false, background: ''}, // hb
            {name: 'rollC', "k" : 1, id: 'sp_11', sp: 11, wd: 5.5, start: 9350, stop: 9700, sel: false, background: ''}, // rollk
            {name: 'tHat', "k" : 1, id: 'sp_12', sp: 12, wd: 5.5, start: 9700, stop: 10400, sel: false, background: ''}, // spin
            {name: 'Z', "k" : 1, id: 'sp_13', sp: 13, wd: 5.5, start: 10400, stop: 10900, sel: false, background: ''}, // Z
            {name: 'com', "k" : 1, id: 'sp_14', sp: 14, wd: 5.5, start: 10900, stop: 11450, sel: false, background: ''}, // comet
            {name: 'rollC', "k" : 1, id: 'sp_15', sp: 15, wd: 5.5, start: 11450, stop: 11600, sel: false, background: ''}, // rk
            {name: 'sqL', "k" : 1, id: 'sp_16', sp: 16, wd: 5.5, start: 11600, stop: 12000, sel: false, background: ''}, // soc
            {name: 'av', "k" : 1, id: 'sp_17', sp: 17, wd: 5.5, start: 12000, stop: 12800, sel: false, background: ''}, // av
            {name: 'lnd', "k" : 0, id: 'sp_18', sp: 18, wd: 3, start: 12800, stop: 14000, sel: false, background: ''}            
        ],        
        timing: [],
        manlen: 19,
        speed: 0
    },
    
    computed:   {
        
        progress_event: function () {

        }
        
    },
    
    methods:    {
        
        loadSplitter: function()  {
            this.splitterRecalcs();
            this.splitterOn();
            this.buttonsOn();
        },
        
            // refresh to new splits loaded via JSON
        splitterRecalcs: function() {
            this.manlen = this.mans.length;
            this.pntcount = this.mans[this.manlen-1].stop - this.mans[0].start;
            this.pntsDensity = this.pntcount/100;
            this.wdAdjustmentStep = this.adv/this.pntsDensity;
            this.calculatePointsfromWDs();
            this.calculateTiming();
            this.updateSplits();
        },
        
        errormessage: function(text) {
            this.$message.error(text);
        },   
                
        splitterOn: function()  {
            this.splitter = true;
            this.splitterbuttons = true;
            this.currentSelectedSplitter = this.lastSelectedSplitter;
        },
        
        buttonsOn: function()  {
            this.buttons = true;
        },

            // splitter mouse event handler function
        splitsF : function(current) {
            
            this.currentSelectedSplitter = current;
                
            this.splitterMode ? this.splitsManyF() : this.splitsSingleF() ;
            plot.redrawRMC();

        },
        
            // splitter mouse event handler function
        splitLeft : function() {
            
            if (this.currentSelectedSplitter !== 0) {
                this.currentSelectedSplitter--;
                guiScM.setMan(this.currentSelectedSplitter);
                this.splitterMode ? this.splitsManyF() : this.splitsSingleF() ;
                plot.redrawRMC();
            }

        },
        
        splitRight : function() {
            
            if (this.currentSelectedSplitter < this.mans.length-1 ) {
                this.currentSelectedSplitter++;
                guiScM.setMan(this.currentSelectedSplitter);
                this.splitterMode ? this.splitsManyF() : this.splitsSingleF() ;
                plot.redrawRMC();
            }

        },
        
            // single/multi handler
        setSplitterMode : function()  {
            // false - Single, true - Multi
            if (this.splitterMode)  {
                this.splitterbuttons = false;
            }   else {
                this.retainFirstSplit();
                this.splitterbuttons = true;                          
            }
            plot.redrawRMC();
        },
            // close/open splitter handler
        openSplitter : function()  {
            this.updateSplits();
            if (this.splitter && !this.splitterMode)  {
                this.splitterbuttons = true;
            }   else {
                this.splitterbuttons = false;
            }
        },
        
            // load new maneuvers after loading dB or new bin conversion
        updateMans : function(mans)    {
            this.mans = JSON.parse(JSON.stringify( mans ));  // deep copy
            //this.splitter = true;
            this.clearSplits();    // clear all splits            
        },
                
        model1st : function()  {
            fpenv.setModelPos(0);
            plot.advanceModel();
            plot.render();
        },
        
        modelLast : function()  {
            fpenv.lastModelPos();
            plot.advanceModel();
            plot.render();
        },
        
        modelPrev : function()  {
            fpenv.decModelPos();
            plot.advanceModel();
            plot.render();
        },
        
        modelNext : function()  {
            fpenv.incModelPos();
            plot.advanceModel();
            plot.render();
        },
        
        modelRun : function()  {
            fpenv.flipFlying();
        },
        
        openAtt : function()  {
            fpenv.setAtt(this.attGraph);
            plot.updateCharts();
        },
        
        openVel : function()  {
            fpenv.setVel(this.velGraph);
            plot.updateCharts();
        },
        
        setVel : function(speed)  {
            if (speed !== undefined)    {
                this.speed = speed.toFixed(1);
            }   else {
                this.speed = 0;
            }

        },
        
        setAttDeg : function(roll, pitch, yaw)  {
            this.roll = roll.toFixed(1);
            this.pitch = pitch.toFixed(1);
            this.yaw = yaw.toFixed(1);
        },
        
        
        /* code below manages the Splitter operations
         * use for internal purpose only (not outside this module
         */
        
        splitsSingleF: function()    {
        
            let sp = this.currentSelectedSplitter;
            let last = this.lastSelectedSplitter;

            if ( last !== null )  {                    
                // some splitter already selected
                if (last !== sp )  {
                    // different splitter
                    this.mans[last].background = ""; // reset old splitter
                    this.mans[last].sel = false;
                    this.mans[sp].background = "dodgerblue"; // set new splitter
                    this.mans[sp].sel = true;
                    this.lastSelectedSplitter = sp;
                }   else {
                    // same splitter
                    if (this.mans[sp].sel)    {
                        // already selected
                        this.mans[sp].background = ""; // set new splitter
                        this.mans[sp].sel = false;
                        this.lastSelectedSplitter = null;
                        fpenv.setStart(this.mans[0].start);
                        fpenv.setStop(this.mans[this.mans.length -1].stop);
                        return;
                    }   else {
                        //different splitter
                        this.mans[last].background = ""; // reset old splitter
                        this.mans[last].sel = false;
                        this.mans[sp].background = "dodgerblue"; // set new splitter
                        this.mans[sp].sel = true;
                        this.lastSelectedSplitter = sp;
                    }
                }
            }   else {
                // no splitter selected yet
                this.mans[sp].background = "dodgerblue"; // set new splitter        
                this.mans[sp].sel = true;
                this.lastSelectedSplitter = sp;
            }

            fpenv.setStart(this.mans[sp].start);
            fpenv.setStop(this.mans[sp].stop);

        },
        
        splitsManyF: function()    {
    
            let sp = this.currentSelectedSplitter;
            let sels = this.findSelected();
            let first = sels[0];
            let last = sels[sels.length-1];

            if (sels.length !== 0)  {
                // already something selected

                // find if sp is smaller or larger than first aleady selected
                if (sp > first && sp < last)   {
                    // adjust left
                    this.clearSplits();
                    if (!this.lastSelectedFirst)  {
                        this.selectSplits(sp, last);
                        fpenv.setStart(this.mans[sp].start);
                        fpenv.setStop(this.mans[last].stop);
                        this.lastSelectedFirst = true;
                    }   else {
                        this.selectSplits(first, sp);
                        fpenv.setStart(this.mans[first].start);
                        fpenv.setStop(this.mans[sp].stop);
                        this.lastSelectedFirst = false;
                    }
                }   else if (sp < first && sp < last)  {
                    // adjust left
                    this.selectSplits(sp, last);
                    fpenv.setStart(this.mans[sp].start);
                    fpenv.setStop(this.mans[last].stop);
                }   else if (sp > first && sp > last)  {
                    // adjust right
                    this.selectSplits(first, sp);
                    fpenv.setStart(this.mans[first].start);
                    fpenv.setStop(this.mans[sp].stop);
                }   else if (sp === first)   {
                    // do nothing
                    this.lastSelectedFirst = true;
                }   else if (sp === last)   {
                    // do nothing
                    this.lastSelectedFirst = false;
                }


            }   else {
                // nothing selected yet, first select
                this.selectSplits(sp,sp);
                fpenv.setStart(this.mans[sp].start);
                fpenv.setStop(this.mans[sp].stop);
            }
        },
        
        findSelected: function () {
            
            let sels = [];
            let indx = 0;

            for (var i = 0; i < this.mans.length; i++)  {        
                if (this.mans[i].sel)
                    sels[indx++] = i;
            }

            return sels;
        },
        
        clearSplits: function()  {
            
            for (var i = 0; i < this.mans.length; i++)  {
                this.mans[i].sel = false;
                this.mans[i].background = "";
            }
            
        },
        
        selectSplits: function(first, last)  {
    
            for (var i = first; i <= last; i++)  {
                this.mans[i].sel = true;
                this.mans[i].background = "dodgerblue";
            }
        },
        
        updateSplits: function()  {
        
            for (var i = 0; i < this.mans.length; i++)  {
                this.mans[i].sel ? 
                        (this.lastSelectedSplitter = this.mans[i].sp, this.mans[i].background = "dodgerblue") : 
                        this.mans[i].background = "";
            }
        },
        
        retainFirstSplit: function()  {
        
            // used to switch from multimode to single mode
            // retains only one, first from the left split

            let first = true;

            for (var i = 0; i < this.mans.length; i++)  {

                if (this.mans[i].sel && first)  { 
                    this.lastSelectedSplitter = this.mans[i].sp;
                    this.mans[i].background = "dodgerblue";
                    first = false;
                    fpenv.setStart(this.mans[i].start);
                    fpenv.setStop(this.mans[i].stop);
                }   else {
                    this.mans[i].sel = false;
                    this.mans[i].background = "";
                }

            }

        },
                       
        decreaseStop: function() {

            if (this.splitter && !this.splitterMode) {
                var sel = this.findSelected();
                if (sel.length === 1)   {
                    this.adjustManPercentage(sel[0],false);
                    this.calculatePointsfromWDs();
                    this.calculateTiming();
                    fpenv.setStop(this.mans[sel[0]].stop);
                }
                fpenv.setModelPos(0);
                plot.redrawRMC();
            }

        },
        
        increaseStop: function()    {

            if (this.splitter && !this.splitterMode) {
                var sel = this.findSelected();
                if (sel.length === 1)   {
                    this.adjustManPercentage(sel[0]);
                    this.calculatePointsfromWDs();
                    this.calculateTiming();
                    fpenv.setStop(this.mans[sel[0]].stop);
                }
                fpenv.setModelPos(0);
                plot.redrawRMC();
            }
        },

        calculatePointsfromWDs: function() {
        
            this.mans[0].start = 0;
            this.mans[0].stop = Math.round(this.mans[0].wd/100 * this.pntcount);
            
            let totP = this.mans[0].wd/100;
            for (let i = 1; i < this.manlen - 1; i++)   {                
                this.mans[i].start = this.mans[i - 1].stop;
                this.mans[i].stop = this.mans[i].start + Math.round(this.mans[i].wd/100 * this.pntcount);
                totP += this.mans[i].wd/100;
            }

            this.mans[this.mans.length-1].start = this.mans[this.mans.length-2].stop;
            this.mans[this.mans.length-1].stop =  this.pntcount-1;
        },
        
        setDuration: function(dur)  {
            this.duration = dur;
        },
        
        passScores: function(scArr) {
            for (let i = 0; i < this.manlen; i++)   {
                this.timing[i].val = scArr[i].toString();
            }
            this.$mount();
        },
        
        calculateTiming: function() {
            
            let leftAdd = 0;
            this.timing = [];
            for (let i = 0; i < this.manlen; i++)   {
                this.timing.push({});
                this.timing[i].id = i;
                    let str = this.mans[i].start;
                    str >= plot.pathArray.length ? str = plot.pathArray.length - 1 : str;
                let start = plot.getPathArrayPoint(str);
                start = start.time/1000000;
                    let stp = this.mans[i].stop;
                    stp >= plot.pathArray.length ? stp = plot.pathArray.length - 1 : stp;
                let stop = plot.getPathArrayPoint(stp);
                stop = stop.time/1000000;
                let dur = stop - start;
                //this.timing[i].left = (leftAdd + 0.5*dur)/this.duration*100;
                this.timing[i].left = this.mans[i].wd/2 + leftAdd - 0.5;
                leftAdd += this.mans[i].wd;
                this.timing[i].val = dur.toFixed(1);
            }
            
            let takeoffMan = this.mans[0].start;
            let lastMan = this.mans[this.mans.length - 2].stop;
            lastMan >= plot.pathArray.length ? lastMan = plot.pathArray.length - 1 : lastMan;
            let jduration = (plot.getPathArrayPoint(lastMan).time - plot.getPathArrayPoint(takeoffMan).time)/1000000*JDURFACTOR;
            let jdurMins = Math.floor(jduration/60);
            let jdurSecs = Math.round(jduration - jdurMins*60);
            jduration= jdurMins.toFixed(0) + "m" + jdurSecs.toFixed(0) + "s";
            guiTL.setJudgingDuration(jduration !== undefined ? jduration : "uknown");

        },
        
        adjustManPercentage: function(sel = 0, inc = true) {
            
            // adjust wd by a step, only if it does not go to negative or over 100            
            if (this.mans[sel].wd >= this.wdAdjustmentStep && this.mans[sel].wd < (100 - this.wdAdjustmentStep) ) {
                if (inc)    {
                    // increase
                    this.mans[sel].wd += this.wdAdjustmentStep;
                } else  {
                    // reduce (only if it does not go below this.wdAdjustmentStep
                    this.mans[sel].wd > this.wdAdjustmentStep ? this.mans[sel].wd -= this.wdAdjustmentStep : this.mans[sel].wd = this.wdAdjustmentStep ;
                }
            }   else {
                // should never happen, correct width to be just above this.wdAdjustmentStep
                this.mans[sel].wd = this.wdAdjustmentStep;
            }

            
            // if adjustments are related to takeoff, scale the rest of mans to reflect the original proportions
            // calculate previous lenghts
            let prev = 0;
            for (var i = 0; i <= sel; i++) { // loops over remaining manouvers only
                prev += this.mans[i].wd;
            }
            // remaining
            let rem = 100 - prev;
            
            // reduction ratio formula
            //let ratio = (100 - prev - this.wdAdjustmentStep) / rem;
            let ratio = (100 - prev) / rem;
            // adjust all remaining mans
            for (var i = sel+1; i < this.manlen-1; i++) { // loops over remaining manouvers only
                this.mans[i].wd *= ratio;
            }            
            
            // confirm that the adjusted mans add to 100, if not adjust
            let left = this.manlen - sel;
            let adj = this.wdAdjustmentStep / left;
            
            let allUp = 0;            
            for (var i = 0; i < this.manlen-1; i++) { // loops over manouvers only
                allUp += Math.abs(this.mans[i].wd);
            }                      
            if (allUp > 100)    {
                // make all mans subsequent to sel equal and allocate the rest to landing
                let prev = 0;
                for (var i = 0; i <= sel; i++) {
                    prev += this.mans[i].wd;
                }
                let rest = 100 - prev;
                adj = rest/left;
                for (var i = sel + 1; i < this.manlen-1; i++) { // loops over manouvers only
                    // allocate the rest of space evenly
                    this.mans[i].wd = adj;
                }
                // recalculate allUp
                allUp = 0;
                for (var i = 0; i < this.manlen-1; i++) { // loops over manouvers only
                    allUp += Math.abs(this.mans[i].wd);
                }
                this.mans[this.manlen-1].wd -= 100 - allUp;
            }   else    {
                this.mans[this.manlen-1].wd -= 100 - allUp;
            }
            
        }
        
        
    }        
});