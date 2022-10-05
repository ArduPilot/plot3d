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
    Created on : Sep. 2020
    Author     : Artur Uzieblo
*/

/* global fpenv, split, plot */

// keyboard listener to move the model around
document.addEventListener('keydown', function(e) {    
    
    switch (e.keyCode) {
        
        // ------- Moving model --------
        case 74:    // j
            fpenv.decModelPos();
            plot.advanceModel();
            break;
        case 72:    // h
            fpenv.setModelPos(0);
            plot.advanceModel();
            break;
        case 75:    // k
            fpenv.incModelPos();
            plot.advanceModel();
            break;
        case 76:    // l
            fpenv.lastModelPos();
            plot.advanceModel();
            break;
        case 82:    // r - animate model
            fpenv.flipFlying();
            break;
            
            
        // -------- adjusting manouver stop and start -------------
        case 83:    // s
            guiBL.increaseStart();
            break;
        case 65:    // a
            guiBL.decreaseStart();
            break;
        case 68:    // d
        case 109:   // -
            guiBL.decreaseStop();
            break;
        case 70:    // f
        case 107:   // -
            guiBL.increaseStop();
            break;
        default:
            return false;
            break;            
    }
    
});


