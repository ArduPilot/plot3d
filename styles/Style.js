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

import { F2BStyle } from './F2BStyle.js';
import { F3AStyle } from './F3AStyle.js';
import { F3SStyle } from './F3SStyle.js';
import { F3CStyle } from './F3CStyle.js';
import { IMACStyle } from './IMACStyle.js';
import { GenericStyle } from './GenericStyle.js';
import { GroundStyle } from './GroundStyle.js';

class Style {
    
    constructor() {
        this.f2bstyle = new F2BStyle();
        this.f3astyle = new F3AStyle();
        this.f3sstyle = new F3SStyle();
        this.f3cstyle = new F3CStyle();
        this.imacstyle = new IMACStyle();
        this.genericstyle = new GenericStyle();
        this.groundstyle = new GroundStyle();
    }
 
    getStyle(type) {
        
        if (type === "F3A") {
            return this.f3astyle;
        } else if (type === "IMAC") {
            return this.imacstyle;
        } else if (type === "F3S") {
            return this.f3sstyle;
        } else if (type === "F3C") {
            return this.f3cstyle;
        } else if (type === "F2B") {
            return this.f2bstyle;
        } else if (type === "Generic") {
            return this.genericstyle;
        } else if (type === "Ground Test") {
            return this.groundstyle;
        }

        return this.genericstyle;
        
    }

}

window.Style = new Style();
