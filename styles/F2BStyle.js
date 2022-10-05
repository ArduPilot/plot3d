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
    Created on : June. 2021
    Author     : Artur Uzieblo
*/

import { Group, Vector3 } from '../libs/three/three.module142.js';
import { Circle } from './components/circle.js';
import { Linee } from './components/line.js';

export class F2BStyle {
    
    constructor() {
        
        this.group = new Group();
        this.style = "F2B";
        
        // constants
        let radiusCenter = 1;
        let radiusMin = 15;
        let radiusMax = 21.5;
        
        // circles
            this.group.add( new Circle("white", radiusCenter, 1, 0, 2));
            this.group.add( new Circle("navy", radiusMin, 1, 0, 2));
            this.group.add( new Circle("navy", radiusMax, 1, 0, 2));
        // Lines
            this.group.add( new Linee("gray", new Vector3(0,0,-30), new Vector3(0,0, 30), 2 )); // centre
            this.group.add( new Linee("gray", new Vector3(-30,0,0), new Vector3(30,0, 0), 2 )); // centre
        // Labels
                
        return this.group;        
        
    }
    
}
