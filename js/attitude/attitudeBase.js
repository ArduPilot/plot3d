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
    Created on : Jul 2021
    Author     : Artur Uzieblo
*/

/* global fpenv, THREE, Three, ZOOMSMIN */

import { WebGLRenderer, Group, Vector3, Scene, Color, AmbientLight, DirectionalLight, Fog, TextureLoader,
         RepeatWrapping, sRGBEncoding, MeshLambertMaterial, Mesh, PlaneBufferGeometry, PlaneGeometry,
         FrontSide, MeshBasicMaterial, PerspectiveCamera, OrthographicCamera, MathUtils } from '../../libs/three/three.module142.js';
import { OrbitControls } from '../../libs/three/controls/OrbitControls.js';
import { OBJLoader } from '../../libs/three/loaders/OBJLoader.js';
import { MTLLoader } from '../../libs/three/loaders/MTLLoader.js';


export class AttitudeBase {    
    
    constructor() {
        
        this.fraction = 10;        
        this.size = window.innerWidth/this.fraction;
        this.dist = 10;
        this.scale = 0.01;
        this.controls = null;    // camera controls
        this.renderer = new WebGLRenderer({antialias: true});    // three.js renderer
        this.camera = null;      
        this.scene = null;
        this.renderer.setSize( this.size, this.size );
        this.oloader = new OBJLoader();      // obj model loader
        this.mloader = new MTLLoader();
        this.model = null;       // model object
        this.modelloaded = null;
        this.cameraV = null;
        this.targetV = null;
        this.aspect = window.innerWidth/window.innerHeight;
        this.dom = null;
    }
    
    initbase(roll, yaw, pitch, dir) {
        
        this.scene = new Scene();

        // background
        this.scene.background = new Color( 0x06518b );

        // Light
        this.scene.add(new AmbientLight(0xffffff, .6));
        let light = new DirectionalLight(0xffffff, .4);
        light.position.set( 0, 300, 100);
        this.scene.add(light);

        // Renderer
        this.renderer.setPixelRatio( window.devicePixelRatio );        
        this.renderer.setSize( this.size, this.size );
        // Camera
        this.camera = new OrthographicCamera( 
                    -this.dist,  // left
                    this.dist,   // right
                    this.dist,          // top
                    -this.dist,         // bottom
                    -this.dist,                  // near
                    this.dist*3 );               // far
                    
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        // look from the top
        //this.cameraV = new Vector3(0, this.dist, 0);
        this.camera.position.set( this.cameraV.x, this.cameraV.y, this.cameraV.z );
        //this.targetV = new Vector3(0, -this.dist, 0);
        this.controls.target.set( this.targetV.x, this.targetV.y, this.targetV.z);        
        this.controls.update();
        this.reloadMandM(roll, yaw, pitch, dir);  
        
    }        
                
    setModel(m, roll, yaw, pitch, dir)  {
        this.model = m;
        this.scale = 20/fpenv.getModelScale();  // 20 to make is smaller for att views
        this.model.scale.set(this.scale, this.scale, this.scale);
        this.model.rotation.set( roll , yaw - Math.PI/2 + fpenv.getRotationRad() , pitch , dir);
        this.model.position.set( 0, 0, 0);        
        this.scene.add(this.model);
        this.render();
        this.modelloaded = fpenv.getModel();
    }
    
    flyModel(roll, yaw, pitch, dir)  {
        if (this.model === null)
            return;
        
        this.model.rotation.set( roll , yaw - Math.PI/2 + fpenv.getRotationRad() , pitch , dir);
        
        this.render();
    }

    reloadMandM(roll, yaw, pitch, dir) {
                        
        if ( this.modelloaded !== null && this.modelloaded.localeCompare( fpenv.getModel() ) )   {
            // reload if different            
            this.scene.remove(this.model);
            this.renderer.renderLists.dispose();
            this.loadMandM(roll, yaw, pitch, dir);
        } else if ( this.modelloaded === null ) {
            // load if null
            this.loadMandM(roll, yaw, pitch, dir);
        }

    }
    
    loadMandM(roll, yaw, pitch, dir) {
                        
        let that = this;
        this.mloader.load( fpenv.getModelMaterials(), 
            function( materials ) {
                materials.preload();
                that.oloader.setMaterials( materials );
                that.loadModel(roll, yaw, pitch, dir);
            },            
            function (xhr) {},  // called when loading is in progresses
            function (error) {  // called when loading has errors
                // on error, just load the model with no materials
                that.loadModel(roll, yaw, pitch, dir);
            }
        );

    }
    
    resize()    {
        this.size = window.innerWidth/this.fraction;
        this.renderer.setSize( this.size, this.size );
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    render()    {
        //this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

}