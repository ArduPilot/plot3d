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

import { Group, CylinderBufferGeometry, MeshStandardMaterial, SphereBufferGeometry, Mesh } from '../../libs/three/three.module142.js';

export class Pilot {
    
    constructor(height = 10) {
        
        this.group = new Group();
        this.component = 'pilot';
        
        let ph = height;
        let bodyGeometry = new CylinderBufferGeometry(ph/5, ph/5, ph, 20, 10);
        let material = new MeshStandardMaterial({color: 0xffff00 });
        let body = new Mesh(bodyGeometry, material);    
        body.position.y = ph/2;
        body.scale.z = 0.5;       
        this.group.add(body);
        
        let headGeometry = new SphereBufferGeometry(ph/6, 20, 15);
        let head = new Mesh(headGeometry, material);
        head.position.y = ph*1.2;               
        this.group.add( head );
        return this.group;
    }
 
    getGroup() {
        
        return this.group;
        
    }
}

