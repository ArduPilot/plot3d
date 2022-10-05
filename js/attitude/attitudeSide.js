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

/* global fpenv, THREE, Three, scale, size, dist */
import { WebGLRenderer, Group, Vector3, Scene, Color, AmbientLight, DirectionalLight, Fog, TextureLoader,
         RepeatWrapping, sRGBEncoding, MeshLambertMaterial, Mesh, PlaneBufferGeometry, PlaneGeometry, DoubleSide,
         CircleGeometry, FrontSide, MeshBasicMaterial, PerspectiveCamera, MathUtils, Line } from '../../libs/three/three.module142.js';
import { OrbitControls } from '../../libs/three/controls/OrbitControls.js';
import { OBJLoader } from '../../libs/three/loaders/OBJLoader.js';
import { MTLLoader } from '../../libs/three/loaders/MTLLoader.js';
import { AttitudeBase } from './attitudeBase.js';
import { Linee } from '../../styles/components/line.js';

export class AttitudeSide extends AttitudeBase {

    constructor() {

        super();
        // set listener for events from other modules
        document.addEventListener('adjustMandM', (event) => {
            // reloads the model and materials as defined in fpenv variables
            this.reloadMandM(event.detail.r, event.detail.y, event.detail.p, event.detail.dir);
        });

    }

    init(roll, yaw, pitch, dir) {

        this.cameraV = new Vector3(-this.dist, 0, 0);
        this.targetV = this.cameraV.clone().negate();

        // base init
        this.initbase(roll, yaw, pitch, dir);
        
        // line along the box
        let line1 = new Linee("navy", new Vector3(0,0,-3 * this.dist), new Vector3(0,0,3 * this.dist), 0.05);
        this.scene.add(line1);
        // line along the box
        let line2 = new Linee("yellow", new Vector3(0,-3 * this.dist, 0), new Vector3(0,3 * this.dist,0), 0.05);
        this.scene.add(line2);

        let refd = this.dist*2-1;
        let l15 = [];
        for (let i = 1; i < 12; i++)    {
            l15[i] = new Linee("gray", 
                            new Vector3( refd, -3 * this.dist * Math.sin(15*i/180*Math.PI), -3 * this.dist * Math.cos(15*i/180*Math.PI)), 
                            new Vector3(refd, 3 * this.dist * Math.sin(15*i/180*Math.PI), 3 * this.dist * Math.cos(15*i/180*Math.PI)),
                            0.05);
            this.scene.add(l15[i]);
        }        
        
        let radius = 9;
        let geometry = new CircleGeometry( radius, radius < 30 ? 30 : radius);
        let material = new MeshBasicMaterial( { 
            color: 0x06518b, 
            opacity: 0.1 , 
            side: DoubleSide, 
            transparent: false, 
            wireframe: false} );
        let disc = new Mesh( geometry, material );
        disc.rotation.y = MathUtils.degToRad(90);
        disc.position.y = 0;
        disc.position.x = refd-1;
        this.scene.add(disc);

        // attach Renederer to the page
        this.dom = this.renderer.domElement;
        document.getElementById("attitudeSide").appendChild(this.dom);

    }

    loadModel(roll, yaw, pitch, dir) {
        
        this.oloader.load(
            // resource URL
            fpenv.getModel(),
            // called when resource is loaded
            function ( object ) {
                attitudeSide.setModel( object, roll, yaw, pitch, dir); 
            },
            // called when loading is in progresses
            function ( xhr ) {
            },
            // called when loading has errors
            function ( error ) {
            }
        );

    }
}

// main plotter object
window.attitudeSide = new AttitudeSide();
