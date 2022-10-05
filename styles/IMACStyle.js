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
    Created on : Feb. 2021
    Author     : Artur Uzieblo
*/

import { Group, Vector3 } from '../libs/three/three.module142.js';
import { Circle } from './components/circle.js';
import { Linee } from './components/line.js';
import { Grid } from './components/grid.js';
import { Spritee } from './components/sprite.js';

export class IMACStyle {
    
    constructor() {
        
        this.group = new Group();
        this.style = "IMAC";
        
        // constants
        let boxclose = -30;
        let boxfar = 360;
        let height = 350;
        let colorblack = "black";
        let colorlightgray = 0xbbbbbb;
        
        // Lines
            // box bottom lines
            this.group.add( new Linee("red", new Vector3(boxfar,0,boxclose), new Vector3(-boxfar,0,boxclose) ));    
            this.group.add( new Linee(colorblack, new Vector3(0,0,boxclose), new Vector3(0,0,-boxfar+boxclose), 0.1 )); // centre
        
        // Grids
            // green grid
            var greengridL = new Grid({ lengthm: 1, width: boxfar, square: boxfar/10, color: 0x52bd48 });        
            greengridL.position.z = boxclose;
            var greengridR = greengridL.clone();
            greengridR.rotation.z = Math.PI;
            this.group.add( greengridL );
            this.group.add( greengridR );
            // red grids
            var redL = new Grid({ lengthm: 23, width: -boxclose, square: -boxclose/10, color: 0xf52f2f });        
            redL.position.z = 0;
            var redR = redL.clone();
            redR.rotation.z = Math.PI;
            this.group.add( redL );
            this.group.add( redR );
                // back
            var graygridL = new Grid({ lengthm: 1, width: height, square: height/50, color: colorlightgray });
            graygridL.rotation.x = Math.PI/2;
            graygridL.position.z = -boxfar+boxclose;
            var graygridR = graygridL.clone();
            graygridR.position.z = -boxfar+boxclose;
            graygridR.rotation.z = Math.PI;
            graygridR.rotation.x = Math.PI/2;
            this.group.add( graygridL );
            this.group.add( graygridR );

        // Labels
            var sp100 = new Spritee( "100'");
            sp100.position.set(-5,2,boxclose);
            this.group.add( sp100 );
            
            var sp390 = new Spritee( "390m");
            sp390.position.set(-5,2,-boxfar+boxclose);
            this.group.add( sp390 );
            
            var sp360 = new Spritee( "360m");
            sp360.position.set(-5,boxfar,-boxfar+boxclose);
            this.group.add( sp360 );
            var sp1180 = new Spritee( "1180'");
            sp1180.position.set(5,boxfar,-boxfar+boxclose);
            this.group.add( sp1180 );
                
        return this.group;        
        
    }
        
}


