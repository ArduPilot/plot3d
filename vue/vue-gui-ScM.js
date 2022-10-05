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
    Created on : Aug 2022    
    Author     : Artur Uzieblo
*/

/*
 * Do NOT place any of the three.js components into Vue and it will make them reactive with all getters and setters and very slow
 * only do that if placed as static objects
 */

/* global jsonReader, fetch, fpenv, guiBL */

var guiScM = new Vue({
    
    locale: 'en',
    
    el: '#scoreModal',
    
    created: function() {
        this.currentScore = this.scoresJ[this.man];
        this.scoreTotal();
    },

    data: {
        scoresJ: [ 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 ],
        scoresK: [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1 ],
        scoresAvailable: false,
        currentScore: 10,
        totalScore: 0,
        man: 1
    },
    
    methods:    {
                                
        async scoreStore() {
            // triggered by user pressing Modal Submit button
            // close modal
            this.close();            
            /*
            // prepare ajax parameters
            const requestOptions = {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            };
            fpenv.setTemplate(this.template);
            // load json, trigger async template load
            let tfile = "./templates/" + this.template[0] + "/" + this.template[2];
            fetch(tfile, requestOptions)
                .then(response => response.json())
                .then(data => {                    
                    document.dispatchEvent(
                        new CustomEvent("newJSONdata", {
                            // details are set to json
                            detail: data,
                            bubbles: true,
                            cancelable: true,
                            composed: false
                        })
                    );
                })
                .catch(() => {
                });
            */
        },
        
        
        init: function(mans) {            
            this.scoresJ.length = mans;
            this.scoresK.length = mans;
        },
        
        close: function() {            
            document.getElementById("scoreModal").style.display = "none";
        },
        
        open: function(man) {
            document.getElementById("scoreModal").style.display = "block";
            this.setMan(man);
        },
        
        setMan: function(man)  {            
            
            this.man = man;
            if (man === 0 || man >= this.scoresJ.length - 1)   {
                this.close();
            }   else    {
                document.getElementById("scoreModal").style.display = "block";
                this.currentScore = this.scoresJ[this.man];
            }
            
        },
        
        score: function() {
            
            this.scoresJ[this.man] = this.currentScore;
            this.scoresAvailable = true;
            // update JSON data
            this.scoreTotal();
            guiBL.passScores(this.scoresJ);
            
        },
        
        scoreTotal: function()  {
            
            let total = 0;
            
            for (i = 0; i < this.scoresJ.length; i++)   {
                total += this.scoresJ[i] * this.scoresK[i];
            }
            
            this.totalScore = total;
            this.scoresJ[this.scoresJ.length - 1] = total;
        }

        
    }
});