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

/*
 * Do NOT place any of the three.js components into Vue and it will make them reactive with all getters and setters and very slow
 * only do that if placed as static objects
 */

/* global fpenv, scene, renderer, THREE, rm, model, pathArray, camera, controls, plot, split, binReader, modal */

var guiIns = new Vue({
    
    locale: 'en',
    
    el: '#instructions',
    
    data: {
        rotation: 0
    },
        
    methods:    {
                
        close: function() {            
            document.getElementById("instructions").style.display = "none";
        }
    }
});