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

import { Texture, LinearFilter, SpriteMaterial, Sprite, Color } from '../../libs/three/three.module142.js';

export class Spritee {
    
    // GridHelpers are square so creating rectnagular grids takes several of them
    
    constructor(message, color = 0x000000, opts) {
        
        this.sprite = null;
        
        let parameters = opts || {};
        let fontface = parameters.fontface || 'Helvetica';
        let fontsize = parameters.fontsize || 100;
        
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        context.font = fontsize + "px " + fontface;

        // text color
        let cl = new Color(color);
        context.fillStyle = this.hexToRgbA(color);//"rgba(255, 0, 0, 0.95)"; //'rgba('+cl.r+','+cl.g+','+cl.b+',1.0)';
        context.fillText(message, 0, fontsize);

        // canvas contents will be used for a texture
        let texture = new Texture(canvas);
        texture.minFilter = LinearFilter;
        texture.needsUpdate = true;

        let spriteMaterial = new SpriteMaterial({
            map: texture,
            useScreenCoordinates: false
        });
        this.sprite = new Sprite(spriteMaterial);
        this.sprite.scale.set(10, 5, 1.0);
        return this.sprite;    
        
    }
 
    getSprite() {
        
        return this.sprite;
        
    }
    
    hexToRgbA(c){
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    
}

