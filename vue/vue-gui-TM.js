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
    Created on : June 2021    
    Author     : Artur Uzieblo
*/

/*
 * Do NOT place any of the three.js components into Vue and it will make them reactive with all getters and setters and very slow
 * only do that if placed as static objects
 */

/* global jsonReader, fetch, fpenv */

var guiTM = new Vue({
    
    locale: 'en',
    
    el: '#templateModal',
    
    created: function() {
        this.template = fpenv.getTemplate();
    },

    data: {
        templateJSON: '',
        template: ['F3A', '23', 'P23_template_150.json'],   // default value
        templates: [   
            {
            "value": "F3A",
            "label": "F3A",
            "children": [
                {
                    "value": "23", 
                    "label": "23",
                    "children": [                        
                        {
                            "value": "P23_template_150.json", 
                            "label": "F3A P23 150m"
                        },
                        {
                            "value": "P23_template_170.json", 
                            "label": "F3A P23 170m"
                        },
                        {
                            "value": "F23_template_150.json", 
                            "label": "F3A F23 150m"
                        },
                        {
                            "value": "F23_template_170.json", 
                            "label": "F3A F23 170m"
                        }
                    ]                    
                },
                {
                    "value": "21", 
                    "label": "21",
                    "children": [
                        {
                            "value": "P21_template_150.json", 
                            "label": "F3A P21 150m"
                        },
                        {
                            "value": "P21_template_170.json", 
                            "label": "F3A P21 170m"
                        },
                        {
                            "value": "F21_template_150.json", 
                            "label": "F3A F21 150m"
                        },
                        {
                            "value": "F21_template_170.json", 
                            "label": "F3A F21 170m"
                        }
                    ]
                }
            ]
            
            }
        ]
    },
    
    methods:    {
                
        handleTemplateSelection: function(command) {            
            this.template = command;
        },
                
        async selectedTemplate() {
            // triggered by user pressing Modal Submit button
            // close modal
            this.close();            
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
            
        },
        
        close: function() {            
            document.getElementById("templateModal").style.display = "none";
            this.templateJSON;
        }
        
    }
});