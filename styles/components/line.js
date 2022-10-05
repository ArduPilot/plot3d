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

import { Group, Vector3, BufferGeometry, Line, LineBasicMaterial } from '../../libs/three/three.module142.js';

export class Linee {
    
    constructor(color = 0x000088, 
                start = new Vector3(0,0,0),
                end = new Vector3(100,100,100),
                linew = 2
                ) {
        
        this.group = new Group();
        this.component = 'line';
        
        let material = new LineBasicMaterial({ color: color, linewidth: linew});
        let vsections = 12;
        let sections = 10;
       
        let linePoints = []; linePoints.push(start, end);
        //let tube = new TubeBufferGeometry( new CatmullRomCurve3(linePoints), vsections, linew, sections, false);                
        
        const tube = new BufferGeometry().setFromPoints( linePoints );
        this.group.add( new Line( tube, material ) );            
        
        return this.group;
    }
 
    getGroup() {
        
        return this.group;
        
    }
}