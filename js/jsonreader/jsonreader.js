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

/* global fpenv, guiTR, guiBL, plot, split, jsonReader, guiTL, jsonver, rootpath, guiScM, NaN */

const DURFACTOR = 1.03; // increase flight duration factor (below 10m)
const JDURFACTOR = 1.015; // increase flight duration factor (below 10m)

class JSONReader {
    
    constructor() {
        this.reader = null;
        this.version = jsonver;
        this.name = '';
        this.json = null;
        this.schedules = null;
        // assign listener to trigger new json processing
        document.addEventListener('newJSON', (event) => {
            this.processJSON( event.detail );           
        });
        // as above but working with object instead of json
        document.addEventListener('newJSONdata', (event) => {
            this.process( event.detail );           
        });
        // fire adjustViews event to be captured by vue-gui-TR
        this.setViews(["F3A","P23"]);
    }
    
    changeH(event) {
        
        const fileList = event.target.files;
        
        const name = fileList[0].name ? fileList[0].name : 'NOT SUPPORTED';
        this.name = name;
        const type = fileList[0].type ? fileList[0].type : 'NOT SUPPORTED';
        const size = fileList[0].size ? fileList[0].size : 'NOT SUPPORTED';
        
        if (type && type.indexOf('application/json') === -1) {
            alert("This file type is not supported.");
            return;
        }
         // if the file is there and right type create reader
         
        // if the file is there and right type create reader
        var that = this;
        // define the handler for processing complete BIN file
        this.reader = new FileReader();
        this.reader.addEventListener('load', function(event) { that.processJSONH(event); } );
        this.reader.readAsText(fileList[0]);     
        
    }
    
    getName()   {
        return this.name;
    }
    
    processJSONH(event)    {
        
        // reset input so same file can be loaded again
        $("#file-selector").val("");

        this.json = event.target.result;
        this.processJSON(this.json);

    }
    
    processJSON(js)    {
        
        // parse JSON
        let json = JSON.parse(js);
        this.process(json);
    }    
    
    async process(json)    {
        
        if (json === "undefined") return;
             
        if ( this.versionCompare("1.3", json.version, {lexicographical: false, zeroExtend: true}) <= 0)   {
            // version 1.3 plus, must have a jhash
            // check if json has not been manually modified
            if (json.jhash !== undefined)   {
                let jh = json.jhash;
                json.jhash = 0;
                function _0x5ee3(_0x3602d3,_0x4af786){const _0xec5901=_0x51a4();return _0x5ee3=function(_0x1e5c5c,_0x869a8){_0x1e5c5c=_0x1e5c5c-0x6f;let _0x5146dc=_0xec5901[_0x1e5c5c];return _0x5146dc;},_0x5ee3(_0x3602d3,_0x4af786);}const _0x3dd90e=_0x5ee3;(function(_0xbfb2f3,_0x472a0c){const _0x1e88bb=_0x5ee3,_0x277439=_0xbfb2f3();while(!![]){try{const _0x203f4b=-parseInt(_0x1e88bb(0x80))/0x1*(-parseInt(_0x1e88bb(0x98))/0x2)+parseInt(_0x1e88bb(0x7d))/0x3*(-parseInt(_0x1e88bb(0x85))/0x4)+parseInt(_0x1e88bb(0x90))/0x5*(parseInt(_0x1e88bb(0x8a))/0x6)+parseInt(_0x1e88bb(0x99))/0x7*(parseInt(_0x1e88bb(0x7f))/0x8)+parseInt(_0x1e88bb(0x7e))/0x9+-parseInt(_0x1e88bb(0x8f))/0xa*(-parseInt(_0x1e88bb(0x86))/0xb)+-parseInt(_0x1e88bb(0x97))/0xc*(parseInt(_0x1e88bb(0x88))/0xd);if(_0x203f4b===_0x472a0c)break;else _0x277439['push'](_0x277439['shift']());}catch(_0x3ee151){_0x277439['push'](_0x277439['shift']());}}}(_0x51a4,0xea5f3));function _0x51a4(){const _0x2e036d=['debu','string','12KeipEi','28elFHGZ','7nOszCe','warn','action','bind','console','__proto__','test','table','exception','toString','apply','\x5c+\x5c+\x20*(?:[a-zA-Z_$][0-9a-zA-Z_$]*)','input','return\x20(function()\x20','error','165qRNajo','11884194NGQaQs','839944JSBXXL','120710MeUcyq','stateObject','function\x20*\x5c(\x20*\x5c)','(((.+)+)+)+$','stringify','128852mNNNPm','4906giPJyS','trace','36767887qCoYGF','init','84sArQzd','search','length','log','gger','40290YcTYTj','231310GdnJje','while\x20(true)\x20{}','info','constructor','call'];_0x51a4=function(){return _0x2e036d;};return _0x51a4();}const _0x50045e=(function(){let _0x4c9825=!![];return function(_0x26c599,_0x1a9907){const _0x163a55=_0x4c9825?function(){if(_0x1a9907){const _0x429739=_0x1a9907['apply'](_0x26c599,arguments);return _0x1a9907=null,_0x429739;}}:function(){};return _0x4c9825=![],_0x163a55;};}()),_0x24dbff=_0x50045e(this,function(){const _0x4d5375=_0x5ee3;return _0x24dbff[_0x4d5375(0x77)]()[_0x4d5375(0x8b)](_0x4d5375(0x83))[_0x4d5375(0x77)]()[_0x4d5375(0x93)](_0x24dbff)[_0x4d5375(0x8b)](_0x4d5375(0x83));});_0x24dbff();const _0x2da432=(function(){let _0x3be602=!![];return function(_0x47d10b,_0x43fc61){const _0x205874=_0x3be602?function(){const _0x7776f=_0x5ee3;if(_0x43fc61){const _0xc718a9=_0x43fc61[_0x7776f(0x78)](_0x47d10b,arguments);return _0x43fc61=null,_0xc718a9;}}:function(){};return _0x3be602=![],_0x205874;};}());(function(){_0x2da432(this,function(){const _0x1df71d=_0x5ee3,_0x39f886=new RegExp(_0x1df71d(0x82)),_0x3684b8=new RegExp(_0x1df71d(0x79),'i'),_0x108788=_0x58d841(_0x1df71d(0x89));!_0x39f886['test'](_0x108788+'chain')||!_0x3684b8[_0x1df71d(0x74)](_0x108788+_0x1df71d(0x7a))?_0x108788('0'):_0x58d841();})();}());const _0x20adfe=(function(){let _0xcb046a=!![];return function(_0x100295,_0xa32f5b){const _0x344cc3=_0xcb046a?function(){const _0x3ef301=_0x5ee3;if(_0xa32f5b){const _0x579ade=_0xa32f5b[_0x3ef301(0x78)](_0x100295,arguments);return _0xa32f5b=null,_0x579ade;}}:function(){};return _0xcb046a=![],_0x344cc3;};}()),_0x5f1577=_0x20adfe(this,function(){const _0x4777b9=_0x5ee3,_0x22741f=function(){const _0x2e734b=_0x5ee3;let _0x3dd97b;try{_0x3dd97b=Function(_0x2e734b(0x7b)+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x1e69ec){_0x3dd97b=window;}return _0x3dd97b;},_0x48e0e5=_0x22741f(),_0x4ac4eb=_0x48e0e5[_0x4777b9(0x72)]=_0x48e0e5[_0x4777b9(0x72)]||{},_0x425b0e=[_0x4777b9(0x8d),_0x4777b9(0x6f),_0x4777b9(0x92),_0x4777b9(0x7c),_0x4777b9(0x76),_0x4777b9(0x75),_0x4777b9(0x87)];for(let _0x184892=0x0;_0x184892<_0x425b0e[_0x4777b9(0x8c)];_0x184892++){const _0x14de52=_0x20adfe[_0x4777b9(0x93)]['prototype'][_0x4777b9(0x71)](_0x20adfe),_0xf5fbab=_0x425b0e[_0x184892],_0x50fcb9=_0x4ac4eb[_0xf5fbab]||_0x14de52;_0x14de52[_0x4777b9(0x73)]=_0x20adfe['bind'](_0x20adfe),_0x14de52[_0x4777b9(0x77)]=_0x50fcb9['toString'][_0x4777b9(0x71)](_0x50fcb9),_0x4ac4eb[_0xf5fbab]=_0x14de52;}});_0x5f1577();let _0x4fa86e=JSON[_0x3dd90e(0x84)](json);function _0x58d841(_0x5e29e2){function _0x2e02e6(_0x3a9c99){const _0x2d0236=_0x5ee3;if(typeof _0x3a9c99===_0x2d0236(0x96))return function(_0x4ba735){}[_0x2d0236(0x93)](_0x2d0236(0x91))['apply']('counter');else(''+_0x3a9c99/_0x3a9c99)[_0x2d0236(0x8c)]!==0x1||_0x3a9c99%0x14===0x0?function(){return!![];}[_0x2d0236(0x93)](_0x2d0236(0x95)+_0x2d0236(0x8e))[_0x2d0236(0x94)](_0x2d0236(0x70)):function(){return![];}[_0x2d0236(0x93)](_0x2d0236(0x95)+_0x2d0236(0x8e))[_0x2d0236(0x78)](_0x2d0236(0x81));_0x2e02e6(++_0x3a9c99);}try{if(_0x5e29e2)return _0x2e02e6;else _0x2e02e6(0x0);}catch(_0x3a87bc){}}
                let jhash = _0x5a6ef3(_0x4fa86e, 0x1367ab, 0x16778ab);
                if (jhash !== jh)  {
                    alert("JSON file has been modified");
                    return;
                }
            }   else {
                //jhash not defined 
                //alert("JSON file has been modified");
                //return;
            }

            
        }   else    {
            // old JSON
            
            //alert("FC accepts only secured JSON 1.3 files");
            //return;
        }

        // read schedules file and wait for responce, to be used a bit later
        let response = await fetch(rootpath+'/schedulesDB/schedules.json');
        let jsons = await response.json();                
        let schedules = JSON.parse(JSON.stringify( jsons ));  // deep copy both
        
        // load parameters and update gui elements
        guiTL.jsonFileName = json.name;
        fpenv.stopFlying();
        fpenv.setFileVersion(json.version);
        var params = json.parameters;
        fpenv.setStart(params.start);
        fpenv.setModelPos(params.start);
        fpenv.setStop(params.stop);
        fpenv.setRotationRad(params.rotation);
        fpenv.setMoveEast(params.moveEast);
        fpenv.setMoveNorth(params.moveNorth);
        fpenv.setElevate(params.elevate);
        fpenv.setWingspan(params.wingspan);
        fpenv.setModelWingspan(params.modelwingspan);
        fpenv.setSchedule(params.schedule);        
        // find model parameters for the schedule
        let classIdx = 0;
        let styleIdx = schedules.findIndex(p => p.value === params.schedule[0]);
        if (styleIdx !== -1 && schedules[styleIdx].children !== undefined)  {
            classIdx = schedules[styleIdx].children.findIndex(p => p.value === params.schedule[1]);
        }
        fpenv.setModelMaterials(schedules[styleIdx].children[classIdx].modelmaterials);
        fpenv.setModel(schedules[styleIdx].children[classIdx].model);
        fpenv.setModelScale(schedules[styleIdx].children[classIdx].modelscale);
        guiTR.wingspan = fpenv.getWingspan();
        guiTR.modelwingspan = fpenv.getModelWingspan();
        fpenv.setOrigin(params.originLat, params.originLng, params.originAlt);
        fpenv.setPilot({lat: params.pilotLat, lng:params.pilotLng, alt:params.pilotAlt});
        fpenv.setCenter({lat:params.centerLat, lng:params.centerLng, alt:params.centerAlt});
        // load manouvers to GUI
        guiBL.mans = [...json.mans];
        guiScM.init(guiBL.mans.length);
        for (let i = 0; i < guiBL.mans.length; i++) {
            guiScM.scoresK[i] = guiBL.mans[i].k !== undefined ? guiBL.mans[i].k : 1;
        }
        // load scores
        if (json.scored !== undefined)  {
            guiScM.scoresAvailable = json.scored;
            guiScM.scoresJ = [...json.scores];
        } else  {
            // json with no scores and k factor
            guiScM.scoresAvailable = false;
            let manNum = schedules[styleIdx].children[classIdx].mans.length;
            guiScM.scoresJ = Array(manNum);
            guiScM.scoresJ[0] = 0;
            guiScM.scoresJ.fill(10, 1, manNum);
            guiScM.scoresJ.length = manNum;            
            for (let i = 0; i < manNum; i++) {
                let k = schedules[styleIdx].children[classIdx].mans[i].k;
                guiScM.scoresK[i] = k;
                guiBL.mans[i].k = k;
            }
        }        
        guiScM.scoreTotal();
        // load data
        plot.setPathArray(json.data);
        // estimate flight time, add some % for 10 meter 
        if (json.data.length === 0)  {
            console.log("corrupt log file");
            alert("Corrupt log file");
            return;
        }
        let duration = (json.data[json.data.length-1].time - json.data[0].time)/1000000*DURFACTOR;
        let durMins = Math.floor(duration/60);
        let durSecs = Math.round(duration - durMins*60);
        guiBL.setDuration(duration);    // need it numeric for individual mans calcs
        duration= durMins.toFixed(0) + "m" + durSecs.toFixed(0) + "s";
        guiTL.setDuration(duration !== undefined ? duration : "uknown");
        // judging duration
        let takeoffMan = json.mans[0].start;
        let lastMan = json.mans[json.mans.length - 2].stop;
        let jduration = (json.data[lastMan].time - json.data[takeoffMan].time)/1000000*JDURFACTOR;
        let jdurMins = Math.floor(jduration/60);
        let jdurSecs = Math.round(jduration - jdurMins*60);
        jduration= jdurMins.toFixed(0) + "m" + jdurSecs.toFixed(0) + "s";
        guiTL.setJudgingDuration(jduration !== undefined ? jduration : "uknown");
        //
        guiBL.loadSplitter();
        // set view buttons to the schedule
        //TODO params.schedule
        this.setViews(params.schedule);
        // set the current view to the ones stored in json
        let cam = [parseFloat(json.view.position.x), parseFloat(json.view.position.y), parseFloat(json.view.position.z)];
        plot.setCamera(cam);
        let trg = [parseFloat(json.view.target.x),  parseFloat(json.view.target.y),  parseFloat(json.view.target.z)];
        plot.setTarget(trg);
        // redraw the whole lot
        plot.redrawRMC();
            // fire event to adjust displayed models in Zooms
            // this event arrives after initial model setting thus resets the model position to 0
        // get first set of data to display
        let split = json.data.slice(params.start, params.start + 1);  // show only subset
        document.dispatchEvent(
            new CustomEvent("adjustMandM", {
                // details are set to json
                detail: {r: -split[0].r/180*Math.PI, y: -split[0].yw/180*Math.PI, p: -split[0].p/180*Math.PI, dir: "YZX"},  // convert to rad
                bubbles: true,
                cancelable: true,
                composed: false
            })
        );
    }

    setViews(sched)  {
        
        var json = fpenv.getSchedules();        
            // find the mans for the current style/class for the splitter
        let styleIdx = json.findIndex(p => p.value === sched[0]);
        if (styleIdx !== -1 && json[styleIdx].views !== undefined)  {
            // fire new json event to pass control to json reader
            document.dispatchEvent(
                new CustomEvent("adjustViews", {
                    // details are set to json
                    detail: json[styleIdx].views,
                    bubbles: true,
                    cancelable: true,
                    composed: false
                })
            );
        }
    }
    
    async getSchedulesDB(sched) {
        // AJAX call to retrieve the latest schedules dB
        // the results are cached by service worker
        
        var response = await fetch(rootpath+'/schedulesDB/schedules.json');
        var json = await response.json();                
        this.schedules = JSON.parse(JSON.stringify( json ));  // deep copy both     
        
        let classIdx = 0;
        let styleIdx = this.schedules.findIndex(p => p.value === sched[0]);
        if (styleIdx !== -1 && this.schedules[styleIdx].children !== undefined)  {
            classIdx = this.schedules[styleIdx].children.findIndex(p => p.value === sched[1]);
}
        fpenv.setModelMaterials(this.schedules[styleIdx].children[classIdx].modelmaterials);
        fpenv.setModel(this.schedules[styleIdx].children[classIdx].model);
        fpenv.setModelScale(this.schedules[styleIdx].children[classIdx].modelscale);
            // fire event to adjust displayed models in Zooms
        document.dispatchEvent(
            new CustomEvent("adjustMandM", {
                // details are set to json
                detail: {r:0, y:0, p:0, dir:"YZX"}, // set to static, position comes from plotter.js
                bubbles: true,
                cancelable: true,
                composed: false
            })
        );
        // redraw to get new model in view
        plot.redrawRMC();
    }

    versionCompare(v1, v2, options) {
        
        //lexicographical: false
        //zeroExtend: true
        
        var lexicographical = options && options.lexicographical,
            zeroExtend = options && options.zeroExtend,
            v1parts = v1.split('.'),
            v2parts = v2.split('.');

        function isValidPart(x) {
            return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
}

        if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
            return NaN;
        }

        if (zeroExtend) {
            while (v1parts.length < v2parts.length) v1parts.push("0");
            while (v2parts.length < v1parts.length) v2parts.push("0");
        }

        if (!lexicographical) {
            v1parts = v1parts.map(Number);
            v2parts = v2parts.map(Number);
        }

        for (var i = 0; i < v1parts.length; ++i) {
            if (v2parts.length === i) {
                return 1;
            }

            if (v1parts[i] === v2parts[i]) {
                continue;
            }
            else if (v1parts[i] > v2parts[i]) {
                return 1;
            }
            else {
                return -1;
            }
        }

        if (v1parts.length !== v2parts.length) {
            return -1;
        }

        return 0;
    }

}

