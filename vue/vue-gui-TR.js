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

/* global fpenv, scene, renderer, THREE, rm, model, pathArray, camera, controls, plot, split, binReader, modal, jsonver, guiTL, guiBL, guiScM */

var guiTR = new Vue({
    
    locale: 'en',
    
    el: '#guiTR',
    
    created: function() {
        this.wingspan = fpenv.getWingspan();
        this.modelwingspan = fpenv.getModelWingspan();
        // assign listener to trigger ne json processing
        document.addEventListener('adjustViews', (event) => {
            this.views = event.detail;
        });
    },

    data: {
        parameters: true,
        moveOrigin: fpenv.getMoveOrigin(),
        moveOriginN: 0,
        moveOriginE: 0,
        moveOriginD: 0,
        resequenceAll: 1,
        drawer: false,
        wingspan: 4,
        modelwingspan: 14,
        performance: !fpenv.getPerformance(),
        showactual: fpenv.getShowActual(),
        dropFrames: fpenv.getDropFrames(),
        views: {
            "default": {
                "camera" : [67.5, 56, 58],
                "target" : [10, 0, -215]
            },
            "judge": {
                "camera" : [0, -2.2, 224],
                "target" : [6, 214, -288]
                },
            "top": {
                "camera" : [0, 761, -150],
                "target" : [-2, 221, -280]
                },
            "left": {
                "camera" : [-550, 200, -150],
                "target" : [-2, 221, -280]
                },
            "right":    {
                "camera" : [550, 200, -150],
                "target" : [-2, 221, -280]
                },
            "mid":  {
                "camera" : [0, 200, 275],
                "target" : [-2, 221, -280]
                }
        },
        camera : "",
        target : ""
    },
    
    computed:   {
                        
    },
    
    methods:    {
        
        wingspanChange: function() {
            fpenv.setWingspan(this.wingspan);            
            plot.redrawRMC();
            //console.log(this.getCamera());
            //console.log(this.getTarget());
        },
        
        modelwingspanChange: function() {
            fpenv.setModelWingspan(this.modelwingspan);
            plot.redrawRMC();
        },
        
        originNChange: function() {
            fpenv.setMoveNorth(this.moveOriginN);
            plot.redrawRMC();
        },
        
        originEChange: function() {
            fpenv.setMoveEast(this.moveOriginE);
            plot.redrawRMC();
        },
        
        originDChange: function() {
            fpenv.setMoveDown(this.moveOriginD);
            plot.redrawRMC();
        },
        
        // changed rotation
        adjustRotation: function(e) {
            fpenv.setRotationDeg(e.value);
            plot.redrawRMC();
        },
        // changed move
        adjustMove: function(e) {
            fpenv.setMove(e.value);
            plot.redrawRMC();
        },
        
        moveRChange: function() {
            plot.redrawRMC();
        },
        
        moveFChange: function() {
            plot.redrawRMC();
        },
        
        setActive : function()  {
            this.parameters;
        },

        judgeView : function()  {
            plot.setCamera(this.views.judge.camera);
            plot.setTarget( this.views.judge.target );
        },
        
        topView : function()  {
            plot.setCamera(this.views.top.camera);
            plot.setTarget( this.views.top.target );
        },

        leftView : function()  {
            plot.setCamera(this.views.left.camera);
            plot.setTarget( this.views.left.target );        
        },

        rightView : function()  {
            plot.setCamera(this.views.right.camera);
            plot.setTarget( this.views.right.target );
        },

        midHeightView : function()  {
            plot.setCamera(this.views.mid.camera);
            plot.setTarget( this.views.mid.target );
        },

        toggleActual : function()  {
            plot.toggleActual();
        },
        
        getCamera : function()  {
            if (plot !== null)
                return this.camera = "C:" + plot.getCameraX() + "," + plot.getCameraY() + "," + plot.getCameraZ();
        },
        
        getTarget : function()  {
            if (plot !== null)
                return this.target = "T:" + plot.getTargetX() + "," + plot.getTargetY() + "," + plot.getTargetZ();
            else return "";
        },
        
        getDropFrames : function()  {
            return this.dropFrames;
        },
        
        setPerformance : function()  {
            
            if (this.performance)   {
                fpenv.setPerformance(false);
            }   else {
                fpenv.setPerformance(true);
            }            
            fpenv.load();
            location.reload();
        },

        setShowActual : function()  {
            
            if (this.showactual)   {
                fpenv.setShowActual(true);
            }   else {
                fpenv.setShowActual(false);
            }            
            fpenv.load();
            location.reload();
        },
        
        setDropFrames : function()  {           
            fpenv.setDropFrames(this.dropFrames);
        },
        
        saveFlight : function()  {
            
            const comments = "DO NOT EDIT\n";
                        
            let json = { 
                version :   jsonver,
                comments :  comments,
                name : guiTL.jsonFileName,
                view : {
                    position : {
                        x : plot.getCameraX(),
                        y : plot.getCameraY(),
                        z : plot.getCameraZ()
                    },
                    target : {
                        x : plot.getTargetX(),
                        y : plot.getTargetY(),
                        z : plot.getTargetZ()
                    }
                },
                parameters : {
                    rotation :      fpenv.getRotationRad(),
                    start :         fpenv.getStart(),
                    stop :          fpenv.getStop(),
                    moveEast :      fpenv.getMoveEast(),
                    moveNorth :     fpenv.getMoveNorth(),
                    wingspan :      fpenv.getWingspan(),
                    modelwingspan:  fpenv.getModelWingspan(),
                    elevate :       fpenv.getElevate(),
                    originLat:      fpenv.getOrigin().lat,
                    originLng:      fpenv.getOrigin().lng,
                    originAlt:      fpenv.getOrigin().alt,
                    pilotLat:       fpenv.getPilot().lat,
                    pilotLng:       fpenv.getPilot().lng,
                    pilotAlt:       fpenv.getPilot().alt,
                    centerLat:      fpenv.getCenter().lat,
                    centerLng:      fpenv.getCenter().lng,
                    centerAlt:      fpenv.getCenter().alt,
                    schedule:       fpenv.getSchedule()
                },
                scored : guiScM.scoresAvailable,
                scores : guiScM.scoresJ,
                mans : guiBL.mans,
                data : plot.getPathArray(),
                jhash: 0
                };
                                        
//            let content = JSON.stringify( json );
            function _0x5ee3(_0x3602d3,_0x4af786){const _0xec5901=_0x51a4();return _0x5ee3=function(_0x1e5c5c,_0x869a8){_0x1e5c5c=_0x1e5c5c-0x6f;let _0x5146dc=_0xec5901[_0x1e5c5c];return _0x5146dc;},_0x5ee3(_0x3602d3,_0x4af786);}const _0x3dd90e=_0x5ee3;(function(_0xbfb2f3,_0x472a0c){const _0x1e88bb=_0x5ee3,_0x277439=_0xbfb2f3();while(!![]){try{const _0x203f4b=-parseInt(_0x1e88bb(0x80))/0x1*(-parseInt(_0x1e88bb(0x98))/0x2)+parseInt(_0x1e88bb(0x7d))/0x3*(-parseInt(_0x1e88bb(0x85))/0x4)+parseInt(_0x1e88bb(0x90))/0x5*(parseInt(_0x1e88bb(0x8a))/0x6)+parseInt(_0x1e88bb(0x99))/0x7*(parseInt(_0x1e88bb(0x7f))/0x8)+parseInt(_0x1e88bb(0x7e))/0x9+-parseInt(_0x1e88bb(0x8f))/0xa*(-parseInt(_0x1e88bb(0x86))/0xb)+-parseInt(_0x1e88bb(0x97))/0xc*(parseInt(_0x1e88bb(0x88))/0xd);if(_0x203f4b===_0x472a0c)break;else _0x277439['push'](_0x277439['shift']());}catch(_0x3ee151){_0x277439['push'](_0x277439['shift']());}}}(_0x51a4,0xea5f3));function _0x51a4(){const _0x2e036d=['debu','string','12KeipEi','28elFHGZ','7nOszCe','warn','action','bind','console','__proto__','test','table','exception','toString','apply','\x5c+\x5c+\x20*(?:[a-zA-Z_$][0-9a-zA-Z_$]*)','input','return\x20(function()\x20','error','165qRNajo','11884194NGQaQs','839944JSBXXL','120710MeUcyq','stateObject','function\x20*\x5c(\x20*\x5c)','(((.+)+)+)+$','stringify','128852mNNNPm','4906giPJyS','trace','36767887qCoYGF','init','84sArQzd','search','length','log','gger','40290YcTYTj','231310GdnJje','while\x20(true)\x20{}','info','constructor','call'];_0x51a4=function(){return _0x2e036d;};return _0x51a4();}const _0x50045e=(function(){let _0x4c9825=!![];return function(_0x26c599,_0x1a9907){const _0x163a55=_0x4c9825?function(){if(_0x1a9907){const _0x429739=_0x1a9907['apply'](_0x26c599,arguments);return _0x1a9907=null,_0x429739;}}:function(){};return _0x4c9825=![],_0x163a55;};}()),_0x24dbff=_0x50045e(this,function(){const _0x4d5375=_0x5ee3;return _0x24dbff[_0x4d5375(0x77)]()[_0x4d5375(0x8b)](_0x4d5375(0x83))[_0x4d5375(0x77)]()[_0x4d5375(0x93)](_0x24dbff)[_0x4d5375(0x8b)](_0x4d5375(0x83));});_0x24dbff();const _0x2da432=(function(){let _0x3be602=!![];return function(_0x47d10b,_0x43fc61){const _0x205874=_0x3be602?function(){const _0x7776f=_0x5ee3;if(_0x43fc61){const _0xc718a9=_0x43fc61[_0x7776f(0x78)](_0x47d10b,arguments);return _0x43fc61=null,_0xc718a9;}}:function(){};return _0x3be602=![],_0x205874;};}());(function(){_0x2da432(this,function(){const _0x1df71d=_0x5ee3,_0x39f886=new RegExp(_0x1df71d(0x82)),_0x3684b8=new RegExp(_0x1df71d(0x79),'i'),_0x108788=_0x58d841(_0x1df71d(0x89));!_0x39f886['test'](_0x108788+'chain')||!_0x3684b8[_0x1df71d(0x74)](_0x108788+_0x1df71d(0x7a))?_0x108788('0'):_0x58d841();})();}());const _0x20adfe=(function(){let _0xcb046a=!![];return function(_0x100295,_0xa32f5b){const _0x344cc3=_0xcb046a?function(){const _0x3ef301=_0x5ee3;if(_0xa32f5b){const _0x579ade=_0xa32f5b[_0x3ef301(0x78)](_0x100295,arguments);return _0xa32f5b=null,_0x579ade;}}:function(){};return _0xcb046a=![],_0x344cc3;};}()),_0x5f1577=_0x20adfe(this,function(){const _0x4777b9=_0x5ee3,_0x22741f=function(){const _0x2e734b=_0x5ee3;let _0x3dd97b;try{_0x3dd97b=Function(_0x2e734b(0x7b)+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x1e69ec){_0x3dd97b=window;}return _0x3dd97b;},_0x48e0e5=_0x22741f(),_0x4ac4eb=_0x48e0e5[_0x4777b9(0x72)]=_0x48e0e5[_0x4777b9(0x72)]||{},_0x425b0e=[_0x4777b9(0x8d),_0x4777b9(0x6f),_0x4777b9(0x92),_0x4777b9(0x7c),_0x4777b9(0x76),_0x4777b9(0x75),_0x4777b9(0x87)];for(let _0x184892=0x0;_0x184892<_0x425b0e[_0x4777b9(0x8c)];_0x184892++){const _0x14de52=_0x20adfe[_0x4777b9(0x93)]['prototype'][_0x4777b9(0x71)](_0x20adfe),_0xf5fbab=_0x425b0e[_0x184892],_0x50fcb9=_0x4ac4eb[_0xf5fbab]||_0x14de52;_0x14de52[_0x4777b9(0x73)]=_0x20adfe['bind'](_0x20adfe),_0x14de52[_0x4777b9(0x77)]=_0x50fcb9['toString'][_0x4777b9(0x71)](_0x50fcb9),_0x4ac4eb[_0xf5fbab]=_0x14de52;}});_0x5f1577();let _0x4fa86e=JSON[_0x3dd90e(0x84)](json);function _0x58d841(_0x5e29e2){function _0x2e02e6(_0x3a9c99){const _0x2d0236=_0x5ee3;if(typeof _0x3a9c99===_0x2d0236(0x96))return function(_0x4ba735){}[_0x2d0236(0x93)](_0x2d0236(0x91))['apply']('counter');else(''+_0x3a9c99/_0x3a9c99)[_0x2d0236(0x8c)]!==0x1||_0x3a9c99%0x14===0x0?function(){return!![];}[_0x2d0236(0x93)](_0x2d0236(0x95)+_0x2d0236(0x8e))[_0x2d0236(0x94)](_0x2d0236(0x70)):function(){return![];}[_0x2d0236(0x93)](_0x2d0236(0x95)+_0x2d0236(0x8e))[_0x2d0236(0x78)](_0x2d0236(0x81));_0x2e02e6(++_0x3a9c99);}try{if(_0x5e29e2)return _0x2e02e6;else _0x2e02e6(0x0);}catch(_0x3a87bc){}}
            json.jhash = _0x5a6ef3(_0x4fa86e, 0x1367ab, 0x16778ab);            
            let dat = JSON.stringify( json );

            var blob = new Blob([dat], {
                type: "application/json;charset=utf-8"
            });

            saveAs(blob, guiTL.jsonFileName);
                        
        },
        
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
        },
        
        download:   function() {
            document.getElementById("downloader").download = "image.png";
            document.getElementById("downloader").href = document.getElementById("renderer").firstChild.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        }        
                
    }
    
});