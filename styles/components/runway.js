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

import { Group, PlaneGeometry, MeshPhongMaterial, Mesh, DoubleSide } from '../../libs/three/three.module142.js';

export class Runway {
    
    constructor(length = 150, width = 10, position = -25) {
        
        this.group = new Group();
        this.component = 'runway';
        
        // Runway
        var pg = new PlaneGeometry( width, length, 1, 1 );
        var pm = new MeshPhongMaterial( {color: 0x555555, side: DoubleSide, opacity: 1} );
        var pl = new Mesh( pg, pm );
        pl.rotation.x = Math.PI/2;
        pl.rotation.z = Math.PI/2;
        pl.position.z = position;
        this.group.add( pl );
        
        return this.group;
    }
 
    getGroup() {
        
        return this.group;
        
    }
}

