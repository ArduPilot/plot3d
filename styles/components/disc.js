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

import { Group, CircleGeometry, MeshBasicMaterial, DoubleSide, Mesh, MathUtils } from '../../libs/three/three.module142.js';

export class Disc {
    
    constructor(color = "blue", 
                radius = 50,
                alt = 0
                ) {
        
        this.group = new Group();
        this.component = 'disc';
        
        let geometry = new CircleGeometry( radius, radius < 30 ? 30 : radius);
        let material = new MeshBasicMaterial( { 
            color: color, 
            opacity: 0.1 , 
            side: DoubleSide, 
            transparent: true, 
            wireframe: false} );
        let disc = new Mesh( geometry, material );
        disc.rotation.x = MathUtils.degToRad(90);
        disc.position.y = alt;
        this.group.add( disc );
        
        return this.group;
    }
 
    getGroup() {
        
        return this.group;
        
    }
}