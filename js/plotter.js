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
    Created on : Sep. 2020
    Updated on : Apr. 2021
    Author     : Artur Uzieblo
*/

/* global fpenv, renderer, model, pathArray, scene, camera, THREE, attChart, rm, att, controls, guiTR, Chartist, attitudeTop, attitudeFront, attitudeSide, guiBL, attitudeFM, attitudePilot */

//import * as THREE from 'three';
import { WebGLRenderer, Group, Vector3, Scene, Color, AmbientLight, DirectionalLight, Fog, TextureLoader,
         RepeatWrapping, sRGBEncoding, MeshLambertMaterial, Mesh, PlaneBufferGeometry, PlaneGeometry, 
         ConeGeometry, MeshMatcapMaterial, FrontSide, MeshBasicMaterial, MeshPhongMaterial, PerspectiveCamera } from '../libs/three/three.module142.js';
import { OrbitControls } from '../libs/three/controls/OrbitControls.js';
import { OBJLoader } from '../libs/three/loaders/OBJLoader.js';
import { MTLLoader } from '../libs/three/loaders/MTLLoader.js';
import { RibbonMesh } from './geometries/RibbonMesh.js';
import { Spritee } from '../styles/components/sprite.js';
import { AttitudeTop } from './attitude/attitudeTop.js';
import { AttitudeFront } from './attitude/attitudeFront.js';
import { AttitudeSide } from './attitude/attitudeSide.js';


const bgcl = 0xDAFDE3;
const skycl = 0x336600;
const defCam = [67.5, 56, 58];
const defTrg = [10, 0, -215];
const SPEEDRATIO = 0;
var flightSpeed = 0;


class Plotter {
    
    // scene positioning is aligned with the Three.js coordinate system, 
    // i.e. pilot's position is at 0,0,0 and center line is along the -Z axis
    // right side of the box is towards X (left -X), and altitude is along Z
    
    // ardupilot uses NED system and it translates to Z = -N, X = E and Y = -D
    
    // whne ribbon is created from NED data it is then rotated along X axis and it aligns D with Y and N with Z, aliging it with XYZ system    
    
    constructor() {
        
        this.controls = null;    // camera controls
        this.renderer = new WebGLRenderer({antialias: fpenv.getPerformance(), alpha: true, preserveDrawingBuffer :true});    // three.js renderer
        this.renderer.setPixelRatio( window.devicePixelRatio ); // can be reduced by miltiplying with 0.x
        this.camera = null;      
        this.scene = null;
        this.pa = null;          // plot array, displayed subset of the flight
        this.group = new Group();       // 3D objects grouping for flight path, model
        this.origin = new Group();       // 3D objects grouping for flight path, model
        this.man = 1;            // current maneuver
        this.att =  [ [],[],[],[],[],[] ];         // array used in the angle charts
        this.vel =  [ [],[],[],[],[],[] ];         // array used in the angle charts
        this.velMax = 0;
        this.flightSpeed = 0;
        this.attChartParam = {
            width: window.innerWidth,
            height:'200px',
            chartPadding: 12,
            showArea: false,
            showLine: true,
            showPoint: false,
            fullWidth: true,
            //lineSmooth: Chartist.Interpolation.step(),
            axisX: {
                showLabel: false,
                showGrid: false
            },
            axisY : {
                type : Chartist.FixedScaleAxis,
                low : -90,
                high : 90,
                ticks : [ -90, -60, -45, -30, 0, 30, 45, 60, 90 ]
            }
        };  // charts configuration
        this.velChartParam = {
            width: window.innerWidth,
            height:'200px',
            chartPadding: 12,
            showArea: false,
            showLine: true,
            showPoint: false,
            fullWidth: true,
            //lineSmooth: Chartist.Interpolation.step(),
            axisX: {
                showLabel: false,
                showGrid: false
            },
            axisY : {
                type : Chartist.FixedScaleAxis,
                low : 0,
                high : 160,
                ticks : [ 0, 20, 40, 60, 80, 100, 120, 140, 160 ] // 20
            }
        };  // charts configuration
        this.velChartParam200 = {
            width: window.innerWidth,
            height:'200px',
            chartPadding: 12,
            showArea: false,
            showLine: true,
            showPoint: false,
            fullWidth: true,
            //lineSmooth: Chartist.Interpolation.step(),
            axisX: {
                showLabel: false,
                showGrid: false
            },
            axisY : {
                type : Chartist.FixedScaleAxis,
                low : 0,
                high : 200,
                ticks : [ 0, 25, 50, 75, 100, 125, 150, 175, 200 ] // 25
            }
        };  // charts configuration
        this.velChartParam240 = {
            width: window.innerWidth,
            height:'200px',
            chartPadding: 12,
            showArea: false,
            showLine: true,
            showPoint: false,
            fullWidth: true,
            //lineSmooth: Chartist.Interpolation.step(),
            axisX: {
                showLabel: false,
                showGrid: false
            },
            axisY : {
                type : Chartist.FixedScaleAxis,
                low : 0,
                high : 240,
                ticks : [ 0, 30, 60, 90, 120, 150, 180, 210, 240 ] // 30
            }
        };  // charts configuration
        this.velChartParam320 = {
            width: window.innerWidth,
            height:'200px',
            chartPadding: 12,
            showArea: false,
            showLine: true,
            showPoint: false,
            fullWidth: true,
            //lineSmooth: Chartist.Interpolation.step(),
            axisX: {
                showLabel: false,
                showGrid: false
            },
            axisY : {
                type : Chartist.FixedScaleAxis,
                low : 0,
                high : 320,
                ticks : [ 0, 40, 80, 120, 160, 200, 240, 280, 320 ] // 40
            }
        };  // charts configuration
        this.velChartParam400 = {
            width: window.innerWidth,
            height:'200px',
            chartPadding: 12,
            showArea: false,
            showLine: true,
            showPoint: false,
            fullWidth: true,
            //lineSmooth: Chartist.Interpolation.step(),
            axisX: {
                showLabel: false,
                showGrid: false
            },
            axisY : {
                type : Chartist.FixedScaleAxis,
                low : 0,
                high : 400,
                ticks : [ 0, 50, 100, 150, 200, 250, 300, 350, 400 ] // 50
            }
        };  // charts configuration
        this.attChart = null;    // chart instance
        this.velChart = null;    // chart instance
        //this.loader = new THREE.GLTFLoader();      // model loader
        this.oloader = new OBJLoader();       // obj model loader
        this.mloader = new MTLLoader();       // material loader
        this.model = null;       // model object
        this.model2 = null;       // model2 object
        this.modelloaded = fpenv.getModel();   // loaded model location
        this.model2loaded = fpenv.getModel();   // loaded model location
        this.ribbon = null;      // ribbon mesh
        this.styleR = window.Style; //new Style(); // call only once
        this.box = this.styleR.getStyle( fpenv.getSchedule()[0] );
        this.rm = null;          // ribbon class
        this.pathArray = [       // complete flight data, set to stratting positon here
            // airplane is initially set towards east
            // data below is in NED system and considering that ribbon will be rotated 180 around X it will align
            // N with X, Y with -D and E with Z (this.model.position.set( this.pa[0].N, -this.pa[0].D, this.pa[0].E) )
            { time:0, N:55, E:40, D:-30, VN:0.0, VE:0.0, VD:0.0, r:-30, p:20, yw:70, ar:0, ap:0, ayw:0, wN:0, wE:0},
            { time:1, N:55, E:40, D:-30, VN:0.0, VE:0.0, VD:0.0, r:-30, p:20, yw:70, ar:0, ap:0, ayw:0, wN:0, wE:0}
            // F2B
            //{ time:0, N:0, E:0, D:-10, VN:0.0, VE:0.0, VD:0.0, r:-15, p:0, yw:90, ar:0, ap:0, ayw:0, wN:0, wE:0},
            //{ time:1, N:0, E:0, D:-10, VN:0.0, VE:0.0, VD:0.0, r:-15, p:0, yw:90, ar:0, ap:0, ayw:0, wN:0, wE:0}
        ];
        this.pathArray2 = [       // complete flight data, set to stratting positon here
            // airplane is initially set towards east
            // data below is in NED system and considering that ribbon will be rotated 180 around X it will align
            // N with X, Y with -D and E with Z (this.model.position.set( this.pa[0].N, -this.pa[0].D, this.pa[0].E) )
            { time:0, N:55, E:40, D:-30, VN:0.0, VE:0.0, VD:0.0, r:-30, p:20, yw:70, ar:0, ap:0, ayw:0, wN:0, wE:0},
            { time:1, N:55, E:40, D:-30, VN:0.0, VE:0.0, VD:0.0, r:-30, p:20, yw:70, ar:0, ap:0, ayw:0, wN:0, wE:0}
            // F2B
            //{ time:0, N:0, E:0, D:-10, VN:0.0, VE:0.0, VD:0.0, r:-15, p:0, yw:90, ar:0, ap:0, ayw:0, wN:0, wE:0},
            //{ time:1, N:0, E:0, D:-10, VN:0.0, VE:0.0, VD:0.0, r:-15, p:0, yw:90, ar:0, ap:0, ayw:0, wN:0, wE:0}
        ];
        
        //fpenv.reset();  // this invalidates all parameters passed to the program, needs to be reviewed, introduced with JSON
        fpenv.setStop(this.pathArray.length);
        this.setPA();
        // listen to event to adjust default camera position
        document.addEventListener('adjustDefView', (event) => {
            this.setCamera( event.detail.default.camera);
            this.setTarget( event.detail.default.target);
        });
        
    }

    find_closest_cpos(utc_time, pa) {
        var low = 0;
        var high = pa.length-1;
        while (low < high) {
            var mid = Math.floor((low+high)/2);
            if (utc_time > pa[mid].utc_time) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return low;
    }
        
    advanceModel() {
        if (this.model === null)  return; // could not load model
        if (fpenv.getFlying()) fpenv.incModelPos();
        let cpos = fpenv.getModelPos();
        this.model.rotation.set( -this.pa[cpos].roll , -this.pa[cpos].yaw - Math.PI, -this.pa[cpos].pitch , "YZX");
        this.model.position.set( this.pa[cpos].N, -this.pa[cpos].D, this.pa[cpos].E);
        
        if (fpenv.getZooms() )  {   // if views are open, rotate model in the views            
            attitudeTop.flyModel(-this.pa[cpos].roll , -this.pa[cpos].yaw, -this.pa[cpos].pitch, "YZX");
            attitudeFront.flyModel(-this.pa[cpos].roll , -this.pa[cpos].yaw, -this.pa[cpos].pitch, "YZX");
            attitudeSide.flyModel(-this.pa[cpos].roll , -this.pa[cpos].yaw, -this.pa[cpos].pitch, "YZX");
        }
        
        if (fpenv.getZooms2() )  {   // if views are open, rotate model in the views            
            //attitudeFM.flyModel(-this.pa[cpos].roll , -this.pa[cpos].yaw, -this.pa[cpos].pitch, "YZX");
            //attitudePilot.flyModel(-this.pa[cpos].roll , -this.pa[cpos].yaw, -this.pa[cpos].pitch, "YZX");
        }
        
        this.moveCharts(cpos);

        if (this.model2 !== null) {
            var pa2 = this.pa2
            var cpos2 = this.find_closest_cpos(this.pa[cpos].utc_time, this.pa2)
            this.model2.rotation.set( -pa2[cpos2].roll , -pa2[cpos2].yaw - Math.PI, -pa2[cpos2].pitch , "YZX");
            this.model2.position.set( pa2[cpos2].N, -pa2[cpos2].D, pa2[cpos2].E);
        }
        
    }

    redrawRMC_path(path)    {

        this.ribbon = this.rm.generate();
        this.group.add( this.ribbon );
        
        // reload model if required
        if ( this.modelloaded.localeCompare( fpenv.getModel() ) )   {
            this.group.remove(this.model);

            var that = this;
            this.mloader.load( fpenv.getModelMaterials(), 
                               function( materials ) {
                                   materials.preload();
                                   that.oloader.setMaterials( materials );
                                   that.loadModel(that.oloader);
                               },
                               function (xhr) {},  // called when loading is in progresses
                               function (error) {  // called when loading has errors
                                   // on error, just load the model with no materials
                                   that.loadModel(that.oloader);
                               }
                             );         
            
        } else if (this.model !== null)   {
            // set model scale for existing one
            this.setModel(this.model, fpenv.getModelScale() );                //fpenv.getModelScale()
        }

        // reload model if required
        if ( this.model2loaded.localeCompare( fpenv.getModel() ) )   {
            this.group.remove(this.model2);

            var that = this;
            this.mloader.load( fpenv.getModelMaterials(), 
                               function( materials ) {
                                   materials.preload();
                                   that.oloader.setMaterials( materials );
                                   that.loadModel2(that.oloader);
                               },
                               function (xhr) {},  // called when loading is in progresses
                               function (error) {  // called when loading has errors
                                   // on error, just load the model with no materials
                                   that.loadModel2(that.oloader);
                               }
                             );         
            
        } else if (this.model2 !== null)   {
            // set model scale for existing one
            this.setModel2(this.model2, fpenv.getModelScale() );                //fpenv.getModelScale()
        }
        
        // update charts
        this.updateCharts();
        
        // position group            
        this.moveGroup(this.group);
        
        // reset model position to 0
        fpenv.setModelPos(0);
        this.advanceModel();
        
        // create box
        this.box = this.styleR.getStyle(fpenv.getSchedule()[0]);            
        this.scene.add( this.box );
        // add RMC to scene
        this.scene.add( this.group );
        
        // add Origin indicator
        var geometry = new ConeGeometry(1.25, 2.5, 15 );
        var material = new MeshMatcapMaterial({color: 0xff0000});
        var pole = new Mesh(geometry, material);
        pole.position.y = 1.25;
        this.origin.add(pole);
        // add label
        var spOrigin = new Spritee( "Origin");
        spOrigin.position.y = 1;
        this.origin.add( spOrigin );
        this.moveGroup(this.origin);
        // add to scene
        this.scene.add( this.origin );
        
        // draw everything
        this.controls.update();
        this.renderer.render(this.scene, this.camera);            
    }

    redrawRMC()    {   // Ribbon, Model, Chart
        if (this.scene) {
            // clear old stuff
            this.scene.remove( this.group );
            this.scene.remove( this.origin );
            this.scene.remove( this.box );
            this.att = [ [],[],[],[],[],[] ];
            this.vel = [ [],[],[],[],[],[] ];
            this.renderer.renderLists.dispose();
            this.renderer.render(this.scene, this.camera);
            
            this.group = new Group(); // groups ribbon and model together            
            this.origin = new Group(); //                                    

            this.pa = this.pathArray;
            this.redrawRMC_path();
            this.pa = this.pathArray2;
            this.redrawRMC_path();

            this.pa = this.pathArray;
            this.pa2 = this.pathArray2;
        }
    }
    
    updateCharts() {
        if (fpenv.getAtt()) {
            this.attChartParam.width = window.innerWidth;
            this.attChart.update({ series: plot.getAttCharts()}, this.attChartParam, {override: true});
        }
        if (fpenv.getVel()) {
            this.velChartParam.width = window.innerWidth;
            this.velChartParam200.width = window.innerWidth;
            this.velChartParam240.width = window.innerWidth;
            this.velChartParam320.width = window.innerWidth;
            this.velChartParam400.width = window.innerWidth;
            this.velChart.update({ series: this.getVelCharts()}, this.getVelParams(), {override: true});          
        }
    }
    
    moveCharts(cpos) {
        
        if (fpenv.getVel()) { // if Vel chart is open, move the cross line
            let st = fpenv.getStop() - fpenv.getStart() + 1;        // get number of point is a chart
            // set square graph at the position of the model
            for (let p = 0; p <= cpos; p++)
                plot.setVelChartPoint(3, p, -10000);
            for (let p = cpos+1; p <= st; p++)
                plot.setVelChartPoint(3, p, 10000);
            this.velChart.update();
            
            // display current velocity at the top of the chart 
            let speed = this.getVelChartPoint(cpos);
            guiBL.setVel(speed);
        }
        
        if (fpenv.getAtt()) { // if Vel chart is open, move the cross line
            let st = fpenv.getStop() - fpenv.getStart() + 1;        // get number of point is a chart
            // set square graph at the position of the model
            for (let p = 0; p <= cpos; p++)
                plot.setAttChartPoint(3, p, -10000);
            for (let p = cpos+1; p <= st; p++)
                plot.setAttChartPoint(3, p, 10000);
            this.attChart.update();
            
            // display current attitude angles at the top of the chart 
            guiBL.setAttDeg(this.getRollChartPoint(cpos), this.getPitchChartPoint(cpos), this.getYawChartPoint(cpos));
        }
    }
        
    updateBox() {
        this.redrawRMC();
    }
    
    render()    {
        //this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    resize()    {
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.controls.update();
        this.updateCharts();
        this.renderer.render(this.scene, this.camera);
    }
        
    moveGroup(group) {
        group.rotateOnAxis(new Vector3(0,1,0), fpenv.getRotationRad() + Math.PI/2 );    // align from centre line towards North (align with the North facing box)       
        group.translateX( fpenv.getMoveEast() ); // move origin to pilot position
        group.translateZ( fpenv.getMoveNorth() ); // move origin to pilot position
        group.translateY( fpenv.getMoveDown() ); // move origin to pilot position
        
    }        

    getPathArray()  {
        return this.pathArray;
    }
    
    getPathArrayPoint(p)  {
        return this.pathArray[p];
    }
    
    setPathArray(arr)  {
        this.pathArray = [...arr];
    }
    setPathArray2(arr)  {
        this.pathArray2 = [...arr];
    }
    
    getPA() {
        return this.pa;
    }
    
    getPAPoint(p) {
        return this.pa[p];
    }
    
    getPALength() {
        return this.pa.length;
    }
    
    setPA() {
        this.pa = this.pathArray.slice(fpenv.getStart(), fpenv.getStop());
    }
    
    setPAPointRoll(p,val) {
        this.pa[p].roll = val;
    }
    
    setPAPointPitch(p,val) {
        this.pa[p].pitch = val;
    }
    
    setPAPointYaw(p,val) {
        this.pa[p].yaw = val;
    }
    
    setPAPointQ(p, q1, q2, q3, q4)  {
        this.pa[p].q1 = q1;
        this.pa[p].q2 = q2;
        this.pa[p].q3 = q3;
        this.pa[p].q4 = q4;
    }
    
    setAttChartPoint(graph, p, val)    {
        this.att[graph][p] = val;
    }
    
    getRollChartPoint(p)    {
        return this.att[0][p] === undefined ? this.att[0][p+1] : this.att[0][p];
    }
    getPitchChartPoint(p)    {
        return this.att[1][p] === undefined ? this.att[1][p+1] : this.att[1][p];
    }
    getYawChartPoint(p)    {
        return this.att[2][p] === undefined ? this.att[2][p+1] : this.att[2][p];
    }
    
    getVelChartPoint(p)    {
        return this.vel[1][p];
    }
    
    setVelChartPoint(graph, p, val)    {
        this.vel[graph][p] = val;
    }
        
    getAttCharts() {
        return this.att;
    }
    
    getVelCharts() {
        return this.vel;
    }
    
    setMaxVel(val) {
        this.velMax = val;
    }
    
    getVelParams() {
        if (this.velMax < 160)  {
            return this.velChartParam;
        }   else if (this.velMax >= 160 && this.velMax < 200) {
            return this.velChartParam200;            
        }   else if (this.velMax >= 200 && this.velMax < 240) {
            return this.velChartParam240;            
        }   else if (this.velMax >= 240 && this.velMax < 320) {
            return this.velChartParam320;            
        }   else {
            return this.velChartParam400;            
        }

    }
    
    setModel(m, scale)  {
        this.model = m;
        this.modelloaded = fpenv.getModel();
        this.group.add(this.model);
        this.model.scale.set(fpenv.getModelWingspan()/scale, fpenv.getModelWingspan()/scale, fpenv.getModelWingspan()/scale);                
        this.model.rotation.set( -this.pa[0].roll , -this.pa[0].yaw - Math.PI, -this.pa[0].pitch , "YZX");
        this.model.position.set( this.pa[0].N, -this.pa[0].D, this.pa[0].E);
        this.render();
    }

    setModel2(m, scale)  {
        this.model2 = m;
        this.model2loaded = fpenv.getModel();
        this.group.add(this.model2);
        this.model2.scale.set(fpenv.getModelWingspan()/scale, fpenv.getModelWingspan()/scale, fpenv.getModelWingspan()/scale);
        this.model2.rotation.set( -this.pa[0].roll , -this.pa[0].yaw - Math.PI, -this.pa[0].pitch , "YZX");
        this.model2.position.set( this.pa[0].N, -this.pa[0].D, this.pa[0].E);
        this.render();
    }
    
    loadModel(loader, initial = false) {
        
        loader.load(
            // resource URL
            fpenv.getModel(),
            // called when resource is loaded
            function ( object ) {
                if (initial)
                    plot.setModel( object, fpenv.getModelScale()/4);    // first time set to larger model x 4 fpenv.getModelScale()
                else 
                    plot.setModel( object, fpenv.getModelScale());    // regular
            },
            // called when loading is in progresses
            function ( xhr ) {
            },
            // called when loading has errors
            function ( error ) {
            }
        );

    }

    loadModel2(loader, initial = false) {
        
        loader.load(
            // resource URL
            fpenv.getModel(),
            // called when resource is loaded
            function ( object ) {
                if (initial)
                    plot.setModel2( object, fpenv.getModelScale()/4);    // first time set to larger model x 4 fpenv.getModelScale()
                else 
                    plot.setModel2( object, fpenv.getModelScale());    // regular
            },
            // called when loading is in progresses
            function ( xhr ) {
            },
            // called when loading has errors
            function ( error ) {
            }
        );

    }
    
    setCamera(arr) {
        this.camera.position.set(arr[0],arr[1],arr[2]);
    }
    
    getCameraX() {
        return this.camera !== null ? this.camera.position.x.toFixed(1) : "" ;
    }
    getCameraY() {
        return this.camera !== null ? this.camera.position.y.toFixed(1) : "" ;
    }
    getCameraZ() {
        return this.camera !== null ? this.camera.position.z.toFixed(1) : "" ;
    }
    
    setTarget(arr) {
        this.controls.target.set(arr[0],arr[1],arr[2]);
        this.camera.updateProjectionMatrix();
        this.controls.update();
    }

    toggleActual(arr) {
    }
    
    getTargetX() {
        return this.controls !== null ? this.controls.target.x.toFixed(1) : "" ;
    }
    getTargetY() {
        return this.controls !== null ? this.controls.target.y.toFixed(1) : "" ;
    }
    getTargetZ() {
        return this.controls !== null ? this.controls.target.z.toFixed(1) : "" ;
    }
    
    toDegrees(radians) {
        return radians * 180 / Math.PI;
    }
    
    // ONLY for static rendering !!!!
    setEL() {   
        this.controls.addEventListener('change', () => {
            this.renderer.render(this.scene, this.camera);
        });
    }
    
    init() {
        // <editor-fold defaultstate="collapsed" desc="init">
        // 
        // Scene
        this.scene = new Scene();

        // background
        this.scene.background = new Color( 0xdddddd );

        // Light
        this.scene.add(new AmbientLight(0xffffff, .8));
        
        let light = new DirectionalLight(0xffffff, .2);
        light.position.set( 0, 200, 50);
        //light.position.multiplyScalar( 1.3 );
        this.scene.add(light);

        // box
        this.scene.add(this.box);

        //  GROUND
        const gg = new PlaneBufferGeometry( 2000, 800);
        var gm = new MeshPhongMaterial( { color: bgcl});
        var ground = new Mesh( gg, gm );
        ground.rotation.x = - Math.PI / 2;
        ground.position.y = -0.1;
        if (ground.material.map !== null)    {
            ground.material.map.repeat.set( 30, 20 );
            ground.material.map.wrapS = RepeatWrapping;
            ground.material.map.wrapT = RepeatWrapping;
            ground.material.map.encoding = sRGBEncoding;
        }
        // note that because the ground does not cast a shadow, .castShadow is left false
        ground.receiveShadow = false;
        this.scene.add( ground );

        guiTR.wingspan = fpenv.getWingspan();
        guiTR.modelwingspan = fpenv.getModelWingspan();

        // work with only subset of data
        this.pa = this.pathArray.slice(fpenv.getStart(), fpenv.getStop());

        // Flight ribbon
        this.rm = new RibbonMesh();
        this.ribbon = this.rm.generate();
        this.group.add( this.ribbon );
        this.scene.add(this.group);
            // set initial Origin a bit ot the right
        fpenv.setMoveEast(-21.5);
        this.moveGroup(this.group);

        // airplane OBJ
        // load a resource
        
        var that = this;
        this.mloader.load( fpenv.getModelMaterials(), 
            function( materials ) {
                materials.preload();
                that.oloader.setMaterials( materials );
                that.loadModel(that.oloader, true);
                },
            function (xhr) {},  // called when loading is in progresses
            function (error) {  // called when loading has errors
                // on error, just load the model with no materials
                that.loadModel(that.oloader, true);
                }
        );

        this.mloader.load( fpenv.getModelMaterials(), 
            function( materials ) {
                materials.preload();
                that.oloader.setMaterials( materials );
                that.loadModel2(that.oloader, true);
                },
            function (xhr) {},  // called when loading is in progresses
            function (error) {  // called when loading has errors
                // on error, just load the model with no materials
                that.loadModel2(that.oloader, true);
                }
        );
        
        // Renderer
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor( 0x000000, 0.0 );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        // Camera
        let aspect = window.innerWidth/window.innerHeight;
        //let frustumSize = 600;
        
        this.camera = new PerspectiveCamera(50, aspect, 1, 1500);
        // attach Renederer to the page
        var dom = this.renderer.domElement;
        document.getElementById("renderer").appendChild(dom);
        // Controls
        this.controls = new OrbitControls(this.camera, dom);

        this.controls.minDistance = 10;
        this.controls.maxDistance = 1500;
        // initial settings
        this.camera.updateProjectionMatrix();
        // set camera and target to dedault position
        this.camera.position.set(defCam[0], defCam[1], defCam[2]);
        this.controls.target.set( defTrg[0], defTrg[1], defTrg[2] );
        this.controls.update();

        this.attChart = new Chartist.Line('#attgraph', { series: plot.getAttCharts()}, this.attChartParam );
        //this.attChart.addEventHandler("crossHair", function() {let i = 0});
        //this.attChart.emit("crossHair");
        this.velChart = new Chartist.Line('#velgraph', { series: plot.getVelCharts()}, this.getVelParams() );
        // </editor-fold>
    }    
    
}

// main animation loop
// it will render only when the model is flying, otherwise it is 
// static rendering updated only on input form the user
function  mainLoop() {
        
    if (fpenv.getFlying()) {
        if (flightSpeed >= fpenv.getDropFrames()-1 )   {
            plot.advanceModel();
            plot.render();
            flightSpeed = 0;
        }   else    {
            flightSpeed++;
        }
        //plot.advanceModel();
        //plot.render();
    }
    requestAnimationFrame(mainLoop);
}

// main plotter object
window.plot = new Plotter();


// once all elements of the ploter html document were loaded, fire off the main animation loop
window.addEventListener('load', () => {

    // set cursor to loading
    $("body").css("cursor", "progress");

    // activate the service worker first
    if ('serviceWorker' in navigator) {
        // register service worker upon loading the app
        navigator.serviceWorker.register('service-worker.js')
            .then( function(reg) {
                // do manual update
                reg.update();                
            }
        );
    }

    // initiate plotting, loads all 3D elements
    plot.init();
    
    // initiate plotting, loads all 3D elements
    let pa = plot.getPA();
    window.attitudeTop.init(-pa[0].roll , -pa[0].yaw, -pa[0].pitch , "YZX");
    window.attitudeFront.init(-pa[0].roll , -pa[0].yaw, -pa[0].pitch , "YZX");
    window.attitudeSide.init(-pa[0].roll , -pa[0].yaw, -pa[0].pitch , "YZX");
    //attitudeFM.init(-pa[0].roll , -pa[0].yaw, -pa[0].pitch , "YZX");
    //attitudePilot.init(-pa[0].roll , -pa[0].yaw, -pa[0].pitch , "YZX");
    

    // handling renderer resizing
    window.addEventListener('resize', () => {
        plot.resize();
        attitudeTop.resize();
        attitudeFront.resize();
        attitudeSide.resize();
        //attitudeFM.resize();
        //attitudePilot.resize();
    });
    
    // set event handler for user input
    plot.setEL();

    // finished, turn cursor back
    $("body").css("cursor", "default");

    // start main rendering loop 
    mainLoop();

} );  // assign onLoad listener
