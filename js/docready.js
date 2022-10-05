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

/* global split, fpenv, guiBL, guiTR, camera, controls, plot, parseInt, guiSM */

var binReader = null;
var jsonReader = null;

$( document ).ready(function() {    
    
    // this section defines some important event handlers for JSON loading
    const fileSelector = document.getElementById('file-selector');
    jsonReader = new JSONReader();
    fileSelector.addEventListener('change', function(event) { jsonReader.changeH(event); });    
    
    // this section defines some important event handlers for BIN loading and convertion, the rest is in vue section
    // work with loading and converting the BIN file
    const binFileSelector = document.getElementById('bin-file-selector');
    // create object for Bin convertion
    binReader = new BinReader();    
    // allocate event handler for BIN file loaded
    binFileSelector.addEventListener('change', function(event) {
        binReader.changeH(event);
    });
    // update mans at splitter
    guiBL.mans = binReader.mans;   
    
});

