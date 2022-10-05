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
import { Spritee } from './components/sprite.js';

export class GroundStyle {
    
    constructor() {
        
        this.group = new Group();
        this.style = "Ground";
        
        // constants
        const f2m = 0.3048;
        const top = 400 * f2m;
        
        // circles
            this.group.add( new Circle() );
        // Lines
            this.group.add( new Linee("gray", new Vector3(0,0,-300), new Vector3(0,0, 300) )); // centre
            this.group.add( new Linee("gray", new Vector3(-300,0,0), new Vector3(300,0, 0) )); // centre
            this.group.add( new Linee("gray", new Vector3(0,0,0), new Vector3(0,1000*f2m, 0) )); // centre
            this.group.add( new Linee("lightgray", new Vector3(0,top,-300), new Vector3(0,top, 300) )); // centre
            this.group.add( new Linee("lightgray", new Vector3(-300,top,0), new Vector3(300,top, 0) )); // centre          
        // Labels
            var sp50 = new Spritee( "50m");
            sp50.position.set(-5,2,-50);
            this.group.add(sp50);
            var sp100 = new Spritee( "100m");
            sp100.position.set(-5,2,-100);
            this.group.add(sp100);
            var sp150 = new Spritee( "150m");
            sp150.position.set(-5,2,-150);
            this.group.add(sp150);
            var sp200 = new Spritee( "200m");
            sp200.position.set(-5,2,-200);
            this.group.add(sp200);
            var sp250 = new Spritee( "250m");
            sp250.position.set(-5,2,-250);
            this.group.add(sp250);
            var sp300 = new Spritee( "300m");
            sp300.position.set(-5,2,-300);
            this.group.add(sp300);
            var sp400 = new Spritee( "400'");
            sp400.position.set(-5,top + 2,0);
            this.group.add(sp400);
            var sp500 = new Spritee( "500'");
            sp500.position.set(-5,500*f2m,0);
            this.group.add(sp500);
            var sp600 = new Spritee( "600'");
            sp600.position.set(-5,600*f2m,0);
            this.group.add(sp600);
            var sp700 = new Spritee( "700'");
            sp700.position.set(-5,700*f2m,0);
            this.group.add(sp700);
            var sp800 = new Spritee( "800'");
            sp800.position.set(-5,800*f2m,0);
            this.group.add(sp800);
            var sp900 = new Spritee( "900'");
            sp900.position.set(-5,900*f2m,0);
            this.group.add(sp900);
            var sp1000 = new Spritee( "1000'");
            sp1000.position.set(-5,1000*f2m,0);
            this.group.add(sp1000);
                
        return this.group;        
        
    }
    
}


