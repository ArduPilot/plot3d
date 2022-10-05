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
import { Pole } from './components/pole.js';
import { Pilot } from './components/pilot.js';
import { Runway } from './components/runway.js';
import { Spritee } from './components/sprite.js';

export class F3AStyle {
    
    constructor() {
        
        this.group = new Group();
        this.style = "F3A";
        
        // constants
        let boxclose = -150;
        let boxfar = -175;
        let angle = 60;
        let angleRad = angle/180*Math.PI;                        
        
        // pilot
            this.group.add( new Pilot(5) );
        // Runway
            this.group.add( new Runway() );
        // Poles
            this.group.add( new Pole(boxclose,-angle, 10) ); // left
            this.group.add( new Pole(boxclose,  0, 10) ); // center
            this.group.add( new Pole(boxclose, angle, 10) ); // right        
        // Lines
            // box bottom lines from pilot position
            this.group.add( new Linee("white", new Vector3(0,0,0), new Vector3(0,0,-25), 5 )); // centre
            this.group.add( new Linee("white", new Vector3(0,0,0), new Vector3(-25*Math.tan(angleRad), 0, -25 ), 5 )); // left
            this.group.add( new Linee("white", new Vector3(0,0,0), new Vector3(-25*Math.tan(-angleRad), 0, -25 ), 5 )); // right
            // box bottom lines
            this.group.add( new Linee("green", new Vector3(boxclose*Math.tan(angleRad),0,boxclose), new Vector3(-boxclose*Math.tan(angleRad),0,boxclose) ));
            this.group.add( new Linee("red", new Vector3(boxfar*Math.tan(angleRad),0,boxfar), new Vector3(-boxfar*Math.tan(angleRad),0,boxfar) ));       
            // box vertical lines
            this.group.add( new Linee("green", new Vector3(0,0,boxclose), new Vector3(0,boxclose * Math.tan(-angleRad),boxclose), 1 ));
            this.group.add( new Linee("red", new Vector3(0,0,boxfar), new Vector3(0,boxfar * Math.tan(-angleRad),boxfar), 1 ));

            this.group.add( new Linee("green", new Vector3(boxclose*Math.tan(angleRad),0,boxclose), new Vector3(boxclose*Math.tan(angleRad),boxclose * Math.tan(-angleRad),boxclose), 1 ));
            this.group.add( new Linee("red", new Vector3(boxfar*Math.tan(angleRad),0,boxfar), new Vector3(boxfar*Math.tan(angleRad),boxfar * Math.tan(-angleRad),boxfar), 1 ));

            this.group.add( new Linee("green", new Vector3(-boxclose*Math.tan(angleRad),0,boxclose), new Vector3(-boxclose*Math.tan(angleRad),boxclose * Math.tan(-angleRad),boxclose), 1 ));
            this.group.add( new Linee("red", new Vector3(-boxfar*Math.tan(angleRad),0,boxfar), new Vector3(-boxfar*Math.tan(angleRad),boxfar * Math.tan(-angleRad),boxfar), 1 ));
            // box top lines
            this.group.add( new Linee("green", new Vector3(boxclose*Math.tan(angleRad),boxclose * Math.tan(-angleRad),boxclose), new Vector3(-boxclose*Math.tan(angleRad),boxclose * Math.tan(-angleRad),boxclose), 1 ));
            this.group.add( new Linee("red", new Vector3(boxfar*Math.tan(angleRad),boxfar * Math.tan(-angleRad),boxfar), new Vector3(-boxfar*Math.tan(angleRad),boxfar * Math.tan(-angleRad),boxfar), 1 ));
            // corners
            this.group.add( new Linee("red", new Vector3(boxclose*Math.tan(angleRad),boxclose * Math.tan(-angleRad),boxclose), new Vector3(boxfar*Math.tan(angleRad),boxfar * Math.tan(-angleRad),boxfar), 1 ));       
            this.group.add( new Linee("red", new Vector3(0,boxclose * Math.tan(-angleRad),boxclose), new Vector3(0,boxfar * Math.tan(-angleRad),boxfar), 1 ));
            this.group.add( new Linee("red", new Vector3(boxclose*Math.tan(-angleRad),boxclose * Math.tan(-angleRad),boxclose), new Vector3(boxfar*Math.tan(-angleRad),boxfar * Math.tan(-angleRad),boxfar), 1 ));
            // 45s
            this.group.add( new Linee(0xbbbbbb, new Vector3(-150,0,boxfar), new Vector3(150,300,boxfar), 0.5 ));
            this.group.add( new Linee(0xbbbbbb, new Vector3(150,0,boxfar), new Vector3(-150,300,boxfar), 0.5 ));
            this.group.add( new Linee(0xbbbbbb, new Vector3(-150,0,boxfar), new Vector3(-300,150,boxfar), 0.5 ));
            this.group.add( new Linee(0xbbbbbb, new Vector3(-300,150,boxfar), new Vector3(-150,300,boxfar), 0.5 ));
            this.group.add( new Linee(0xbbbbbb, new Vector3(150,0,boxfar), new Vector3(300,150,boxfar), 0.5 ));
            this.group.add( new Linee(0xbbbbbb, new Vector3(300,150,boxfar), new Vector3(150,300,boxfar), 0.5 ));
            
        // Grids
                // green grid
            var greengridL = new Grid({ lengthm: 11, width: 25, square: 5, color: 0x52bd48 });        
            greengridL.position.z = boxclose;
            var greengridR = greengridL.clone();
            greengridR.rotation.z = Math.PI;
            this.group.add( greengridL );
            this.group.add( greengridR );
                // gray grid
            var gray175L = new Grid({ lengthm: 0, width: 300, square: 6, color: 0xbbbbbb });
            gray175L.position.z = boxfar;
            gray175L.rotation.x = Math.PI/2;
            var gray175R = gray175L.clone();
            gray175R.position.z = boxfar;
            gray175R.rotation.x = Math.PI/2;
            gray175R.rotation.z = Math.PI;
            this.group.add( gray175L );
            this.group.add( gray175R );
                // yellow grids                
            var yellowgridL = new Grid({ lengthm: 13, width: 25, square: 5, color: 0xd9cc16 });        
            yellowgridL.position.z = boxfar;        
            var yellowgridR = yellowgridL.clone();
            yellowgridR.rotation.z = Math.PI;        
            this.group.add( yellowgridL );
            this.group.add( yellowgridR );
            var yellowgridLclose = new Grid({ lengthm: 10, width: 25, square: 5, color: 0xd9cc16 });        
            yellowgridLclose.position.z = boxclose + 25;
            var yellowridRclose = yellowgridLclose.clone();
            yellowridRclose.rotation.z = Math.PI;        
            var yellowgridRclose = yellowgridLclose.clone();
            yellowgridRclose.rotation.z = Math.PI;                
            this.group.add( yellowgridLclose );
            this.group.add( yellowgridRclose );
                // red grids
            var redL = new Grid({ lengthm: 1, width: 200, square: 8, color: 0xfc6a6e });        
            redL.position.z = boxfar - 25;
            var redR = redL.clone();
            redR.rotation.z = Math.PI;
            this.group.add( redL );
            this.group.add( redR );
            var toocloseL = new Grid({ lengthm: 1, width: 125, square: 5, color: 0xfc6a6e });        
            toocloseL.position.z = 0;
            var toocloseR = toocloseL.clone();
            toocloseR.rotation.z = Math.PI;
            this.group.add( toocloseL );
            this.group.add( toocloseR );

        // Labels
            var sp150 = new Spritee( "150m");
            sp150.position.set(-5,2,-150);
            this.group.add( sp150 );
            var sp175 = new Spritee( "175m");
            sp175.position.set(-5,5,-175);
            this.group.add( sp175 );

            let lgray = 0x666666;
            var sp260 = new Spritee( "260m", lgray);
            sp260.position.set(-5,262,-150);
            this.group.add( sp260 );
            var sp155 = new Spritee( "150m", lgray);
            sp155.position.set(-5,155,-175);
            this.group.add( sp155 );
            var sp303 = new Spritee( "303m", lgray);
            sp303.position.set(-5,305,-175);
            this.group.add( sp303 );
            var sp853 = new Spritee( "853ft", lgray);
            sp853.position.set(7,262,-150);
            this.group.add( sp853 );
            var sp994 = new Spritee( "994ft", lgray);
            sp994.position.set(7,305,-175);
            this.group.add( sp994 );
            var sp200 = new Spritee( "200m", lgray);
            sp200.position.set(-5,2,-200);
            this.group.add( sp200 );
            var sp250 = new Spritee( "250m", lgray);
            sp250.position.set(-5,2,-250);
            this.group.add( sp250 );
            var sp300 = new Spritee( "300m", lgray);
            sp300.position.set(-5,2,-300);
            this.group.add( sp300 );
            var sp350 = new Spritee( "350m", lgray);
            sp350.position.set(-5,2,-350);
            this.group.add( sp350 );
            var sp400 = new Spritee( "400m", lgray);
            sp400.position.set(-5,2,-400);
            this.group.add( sp400 );
            
        return this.group;        
        
    }    
        
}


