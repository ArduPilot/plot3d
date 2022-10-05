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

import { Object3D, GridHelper } from '../../libs/three/three.module142.js';

export class Grid {
    
    // GridHelpers are square so creating rectnagular grids takes several of them
    
    constructor(opts) {
        
        var config = opts || {
            lengthm: 12,
            width: 25,
            square: 5,
            color: 0xDDDDDD
        };

        this.object = new Object3D();
        let gridArr = [];
        let that = this;
        

        for (var i = 0; i <= config.lengthm; i++) {
            gridArr[i] = new GridHelper( config.width, config.square, config.color, config.color );
            gridArr[i].position.x = -config.width * i - config.width/2;
            gridArr[i].position.z = -config.width/2;
            gridArr[i].position.y = 0.01;
            that.object.add(gridArr[i]);
        }            

        return this.object;
        
    }
 
    getObject() {
        
        return this.object;
        
    }
}

