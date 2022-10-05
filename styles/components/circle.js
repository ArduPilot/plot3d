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

import { Group, Path, BufferGeometry, Line, LineBasicMaterial, MathUtils } from '../../libs/three/three.module142.js';

export class Circle {
    
    constructor(color = "blue", 
                radius = 50,
                multiples = 6,
                alt = 0,
                linew = 1
                ) {
        
        this.group = new Group();
        this.component = 'circle';
      
        let ll = [];
        let pts = [];
        let g = [];
        let m = new LineBasicMaterial( { color: color, linewidth: linew } );
        
        for (let i = 1; i <= multiples; i++)    {
            pts[i] = new Path().absarc(0, 0, radius * i, 0, Math.PI * 2).getPoints(90);
            g[i] = new BufferGeometry().setFromPoints(pts[i]);
            ll[i] = new Line(g[i], m);
            ll[i].rotation.x = MathUtils.degToRad(90);
            ll[i].position.y = alt;
            this.group.add( ll[i] );
        }
        
        return this.group;
    }
 
    getGroup() {
        
        return this.group;
        
    }
}