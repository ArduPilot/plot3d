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
import { Linee } from './components/line.js';
import { Grid } from './components/grid.js';
import { Pole } from './components/pole.js';
import { Spritee } from './components/sprite.js';

export class F3SStyle {
    
    constructor() {
        
        this.group = new Group();
        this.style = "F3S";
        
        // constants
        let boxclose = -150;
        let boxfar = -200;
        let angle = 60;
        let sideangle = 75;
        let angleRad = angle/180*Math.PI;
        let sideangleRad = sideangle/180*Math.PI;
        
        // Poles
            this.group.add( new Pole(boxclose,-sideangle, 10) ); // left
            this.group.add( new Pole(boxclose,  0, 10) ); // center
            this.group.add( new Pole(boxclose, sideangle, 10) ); // right        
        // Lines
            // box bottom lines from pilot position
            this.group.add( new Linee("gray", new Vector3(0,0,0), new Vector3(0,0,boxfar) )); // centre
            this.group.add( new Linee("gray", new Vector3(0,0,0), new Vector3(boxfar*Math.tan(sideangleRad), 0, boxfar ) )); // left
            this.group.add( new Linee("gray", new Vector3(0,0,0), new Vector3(boxfar*Math.tan(-sideangleRad), 0, boxfar ) )); // right
            // box bottom lines
            this.group.add( new Linee("green", new Vector3(boxclose*Math.tan(sideangleRad),0,boxclose), new Vector3(-boxclose*Math.tan(sideangleRad),0,boxclose) ));
            this.group.add( new Linee("red", new Vector3(boxfar*Math.tan(sideangleRad),0,boxfar), new Vector3(-boxfar*Math.tan(sideangleRad),0,boxfar) ));       
            // box vertical lines
            this.group.add( new Linee("green", new Vector3(0,0,boxclose), new Vector3(0,boxclose * Math.tan(-angleRad),boxclose) ));
            this.group.add( new Linee("red", new Vector3(0,0,boxfar), new Vector3(0,boxfar * Math.tan(-angleRad),boxfar) ));

            this.group.add( new Linee("green", new Vector3(boxclose*Math.tan(sideangleRad),0,boxclose), new Vector3(boxclose*Math.tan(sideangleRad),boxclose * Math.tan(-angleRad),boxclose) ));
            this.group.add( new Linee("red", new Vector3(boxfar*Math.tan(sideangleRad),0,boxfar), new Vector3(boxfar*Math.tan(sideangleRad),boxfar * Math.tan(-angleRad),boxfar) ));

            this.group.add( new Linee("green", new Vector3(-boxclose*Math.tan(sideangleRad),0,boxclose), new Vector3(-boxclose*Math.tan(sideangleRad),boxclose * Math.tan(-angleRad),boxclose) ));
            this.group.add( new Linee("red", new Vector3(-boxfar*Math.tan(sideangleRad),0,boxfar), new Vector3(-boxfar*Math.tan(sideangleRad),boxfar * Math.tan(-angleRad),boxfar) ));
            // box top lines
            this.group.add( new Linee("green", new Vector3(boxclose*Math.tan(sideangleRad),boxclose * Math.tan(-angleRad),boxclose), new Vector3(-boxclose*Math.tan(sideangleRad),boxclose * Math.tan(-angleRad),boxclose) ));
            this.group.add( new Linee("red", new Vector3(boxfar*Math.tan(sideangleRad),boxfar * Math.tan(-angleRad),boxfar), new Vector3(-boxfar*Math.tan(sideangleRad),boxfar * Math.tan(-angleRad),boxfar) ));
            // corners
            this.group.add( new Linee("red", new Vector3(boxclose*Math.tan(sideangleRad),boxclose * Math.tan(-angleRad),boxclose), new Vector3(boxfar*Math.tan(sideangleRad),boxfar * Math.tan(-angleRad),boxfar) ));       
            this.group.add( new Linee("red", new Vector3(0,boxclose * Math.tan(-angleRad),boxclose), new Vector3(0,boxfar * Math.tan(-angleRad),boxfar) ));
            this.group.add( new Linee("red", new Vector3(boxclose*Math.tan(-sideangleRad),boxclose * Math.tan(-angleRad),boxclose), new Vector3(boxfar*Math.tan(-sideangleRad),boxfar * Math.tan(-angleRad),boxfar) ));
        
        // Grids
            // green grid
            var greengridL = new Grid({ lengthm: 14, width: 50, square: 10, color: 0x52bd48 });        
            greengridL.position.z = boxclose;
            var greengridR = greengridL.clone();
            greengridR.rotation.z = Math.PI;
            this.group.add( greengridL );
            this.group.add( greengridR );
            // yellow grids
            var yellowgridL = new Grid({ lengthm: 31, width: 25, square: 5, color: 0xd9cc16 });        
            yellowgridL.position.z = boxfar;        
            var yellowgridR = yellowgridL.clone();
            yellowgridR.rotation.z = Math.PI;        
            this.group.add( yellowgridL );
            this.group.add( yellowgridR );
            var yellowgridLclose = new Grid({ lengthm: 22, width: 25, square: 5, color: 0xd9cc16 });        
            yellowgridLclose.position.z = boxclose + 25;
            var yellowridRclose = yellowgridLclose.clone();
            yellowridRclose.rotation.z = Math.PI;        
            var yellowgridRclose = yellowgridLclose.clone();
            yellowgridRclose.rotation.z = Math.PI;                
            this.group.add( yellowgridLclose );
            this.group.add( yellowgridRclose );
            // red grids
            var redL = new Grid({ lengthm: 16, width: 50, square: 2, color: 0xf52f2f });        
            redL.position.z = boxfar - 25;
            var redR = redL.clone();
            redR.rotation.z = Math.PI;
            this.group.add( redL );
            this.group.add( redR );
            var toocloseL = new Grid({ lengthm: 2, width: 125, square: 5, color: 0xf52f2f });        
            toocloseL.position.z = 0;
            var toocloseR = toocloseL.clone();
            toocloseR.rotation.z = Math.PI;
            this.group.add( toocloseL );
            this.group.add( toocloseR );
        // Labels
            var sp150 = new Spritee( "150m");
            sp150.position.set(-5,2,-150);
            this.group.add( sp150 );
            var sp260 = new Spritee( "260m");
            sp260.position.set(-5,262,-150);
            this.group.add( sp260 );
            var sp303 = new Spritee( "303m");
            sp303.position.set(-5,305,-175);
            this.group.add( sp303 );
            var sp853 = new Spritee( "853ft");
            sp853.position.set(7,262,-150);
            this.group.add( sp853 );
            var sp994 = new Spritee( "994ft");
            sp994.position.set(7,305,-175);
            this.group.add( sp994 );
            var sp200 = new Spritee( "200m");
            sp200.position.set(-5,2,-200);
            this.group.add( sp200 );
                
        return this.group;        
        
    }    
        
}


