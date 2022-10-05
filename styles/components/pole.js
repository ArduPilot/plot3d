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

import { Group, CylinderGeometry, MeshMatcapMaterial, Mesh } from '../../libs/three/three.module142.js';

export class Pole {
    
    constructor(dist = -150, angle = 0, height = 10, radius = 0.4, color = "white") {
        
        this.group = new Group();
        this.component = 'pole';
        
        
        var geometry = new CylinderGeometry(radius, radius, height, 10, 4 );
        var material = new MeshMatcapMaterial({color: color});
        var pole = new Mesh(geometry, material);

        pole.position.x = dist*Math.tan(angle/180*Math.PI);
        pole.position.z = dist;
        pole.position.y = height/2;
        
        this.group.add(pole);
        
        return this.group;
    }
 
    getGroup() {
        
        return this.group;
        
    }
}

