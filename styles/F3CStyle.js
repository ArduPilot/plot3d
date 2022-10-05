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
    Created on : Apr. 2021
    Author     : Artur Uzieblo
*/

import { Group, Vector3 } from '../libs/three/three.module142.js';
import { Circle } from './components/circle.js';
import { Linee } from './components/line.js';
import { Grid } from './components/grid.js';
import { Pole } from './components/pole.js';
import { Spritee } from './components/sprite.js';


export class F3CStyle {
    
    constructor() {
        
        this.group = new Group();
        this.style = "F3C";
        
        // constants
        let boxclose = -9;
        let boxfar = -15;
        let flags = 5;
        let safety = 6;
        let height = 100;
        let corridor = 61-boxclose;
        let corridorWidth = 25;
        let boxveryfar = 120-boxclose;
        let angle = 60;
        let angleRad = angle/180*Math.PI;
        let colorblack = "black";
        let colorred = "red";
        let colorgray = "gray";
        let colorgreen = 0x52bd48;
        let colorlightgray = 0xbbbbbb;
        

            this.group.add( new Circle(colorblack, 1, 1, 0, 6) );
        // heli spot
            let circle1 = new Circle(colorblack, 0.5, 1, 0, 6);
            circle1.position.z = boxclose;
            this.group.add(circle1);
            let circle2 = new Circle(colorblack, 1.5, 1, 0, 6);
            circle2.position.z = boxclose;
            this.group.add(circle2);
        // flags
            this.group.add( new Pole(boxclose,-angle, 1, 0.2, "red") ); // far left
            this.group.add( new Pole(boxclose,-Math.atan(flags/-boxclose)/Math.PI*180, 1, 0.2, "red") ); // close left
            this.group.add( new Linee(colorgray, 
                new Vector3(-5,0,boxclose), 
                new Vector3(-5,7,boxclose), 0.1 )); // 
            this.group.add( new Pole(boxclose,Math.atan(flags/-boxclose)/Math.PI*180, 1, 0.2, "red") ); // close right
            this.group.add( new Linee(colorgray, 
                new Vector3(5, 0, boxclose), 
                new Vector3(5,7, boxclose), 0.1 )); // 
            this.group.add( new Pole(boxclose, angle, 1, 0.2, "red") ); // far right        
        // Lines
            this.group.add( new Linee(colorblack, new Vector3(0,0,boxclose), new Vector3(0,0,boxfar), 2 )); // centre
            this.group.add( new Linee(colorblack, new Vector3(0,0,boxclose), new Vector3(9,0,boxclose), 2 )); // right
            this.group.add( new Linee(colorblack, new Vector3(flags/2,0,boxclose-0.5), new Vector3(flags/2,0,boxclose+0.5), 2 )); // right halfway
            this.group.add( new Linee(colorblack, new Vector3(0,0,boxclose), new Vector3(-9,0,boxclose), 2 )); // left
            this.group.add( new Linee(colorblack, new Vector3(-flags/2,0,boxclose-0.5), new Vector3(-flags/2,0,boxclose+0.5), 2 )); // left halfway
            this.group.add( new Linee(colorblack, new Vector3(-30,0,safety), new Vector3(30,0,safety), 2 )); // safety, judges
            
            this.group.add( new Linee(colorred, new Vector3(0,0,0), new Vector3(boxveryfar*Math.tan(-angleRad),0,-boxveryfar), 2 )); // right 60
            this.group.add( new Linee(colorred, new Vector3(0,0,0), new Vector3(boxveryfar*Math.tan(angleRad),0,-boxveryfar), 2 )); // left 60
            
            //this.group.add( new Line(colorgray, new Vector3(0,0,-corridor), new Vector3(0,height,-corridor), 0.1 )); // center mid
            this.group.add( new Linee(colorgreen, new Vector3(0,0,-corridor-corridorWidth), new Vector3(0,height,-corridor-corridorWidth), 2 )); // center front
            this.group.add( new Linee(colorgreen, new Vector3(Math.tan(angleRad)*(-corridor-corridorWidth),0,-corridor-corridorWidth), new Vector3(Math.tan(angleRad)*(-corridor-corridorWidth),height,-corridor-corridorWidth), 2 )); // left back
            this.group.add( new Linee(colorgreen, new Vector3(-Math.tan(angleRad)*(-corridor-corridorWidth),0,-corridor-corridorWidth), new Vector3(-Math.tan(angleRad)*(-corridor-corridorWidth),height,-corridor-corridorWidth), 2 )); // right back            
            this.group.add( new Linee(colorgreen, new Vector3(Math.tan(angleRad)*(-corridor+corridorWidth),0,-corridor+corridorWidth), new Vector3(Math.tan(angleRad)*(-corridor+corridorWidth),height,-corridor+corridorWidth), 2 )); // left front
            this.group.add( new Linee(colorgreen, new Vector3(-Math.tan(angleRad)*(-corridor+corridorWidth),0,-corridor+corridorWidth), new Vector3(-Math.tan(angleRad)*(-corridor+corridorWidth),height,-corridor+corridorWidth), 2 )); // right front            
            this.group.add( new Linee(colorgreen, new Vector3(0,0,-corridor+corridorWidth), new Vector3(0,height,-corridor+corridorWidth), 2 )); // center back
            
            this.group.add( new Linee(colorgray, new Vector3(-120*2,0,-corridor-corridorWidth), new Vector3(120*2,0,-corridor-corridorWidth), 2 )); // corridor close
            this.group.add( new Linee(colorgray, new Vector3(-120*2,0,-corridor+corridorWidth), new Vector3(120*2,0,-corridor+corridorWidth), 2 )); // corridor far
                    
        // grids
                //general
            var greengridL = new Grid({ lengthm: 1, width: 120, square: 24, color: colorgreen });        
            greengridL.position.z = boxclose;
            var greengridR = greengridL.clone();
            greengridR.rotation.z = Math.PI;
            this.group.add( greengridL );
            this.group.add( greengridR );
                // back
            var graygridL = new Grid({ lengthm: 1, width: height, square: 3, color: colorlightgray });
            graygridL.rotation.x = Math.PI/2;
            graygridL.position.z = -corridor-corridorWidth;
            var graygridR = graygridL.clone();
            graygridR.position.z = -corridor-corridorWidth;
            graygridR.rotation.z = Math.PI;
            graygridR.rotation.x = Math.PI/2;
            this.group.add( graygridL );
            this.group.add( graygridR );
        // labels
            var spCenter = new Spritee( corridor + "m");
            spCenter.position.set(-.5,1,-corridor);
            this.group.add( spCenter );
            var spCenterClose = new Spritee( corridor-corridorWidth + "m");
            spCenterClose.position.set(-.5,1,-corridor+corridorWidth);
            this.group.add( spCenterClose );
            var spCenterFar = new Spritee( corridor+corridorWidth + "m");
            spCenterFar.position.set(-.5,1,-corridor-corridorWidth);
            this.group.add( spCenterFar );
            var spCenterH = new Spritee( height + "m");
            spCenterH.position.set(-.5,height + 1,-corridor-corridorWidth);
            this.group.add( spCenterH );
            
        return this.group;        
        
    }    
        
}


