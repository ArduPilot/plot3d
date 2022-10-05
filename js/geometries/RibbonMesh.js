/*
 This file is part of Flight Plotter.
 
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
 * creates the flight path ribbon from flight points and roll/pitch/yaw coordinates
 * 
 * ardupilot use NED Coordinate System:
 * The x axis is aligned with the vector to the north pole (tangent to meridians).
 * The y axis points to the east side (tangent to parallels)
 * The z axis points to the center of the earth
 * 
 * There is also Body Fixed Frame:
 * The x axis points in forward (defined by geometry and not by movement) direction. (= roll axis)
 * The y axis points to the right (geometrically) (= pitch axis)
 * The z axis points downwards (geometrically) (= yaw axis)
 */


/* global pa, elevate, wingspan, rrotation, scene, fpenv */
import { Vector3, Mesh, Euler, Quaternion, BufferGeometry, MeshPhongMaterial, MeshBasicMaterial, LineBasicMaterial, Line,  
        Color, FrontSide, DoubleSide, Float32BufferAttribute, MeshNormalMaterial, MeshLambertMaterial, 
        FlatShading, SmoothShading } from '../../libs/three/three.module142.js';
    
import { BufferGeometryUtils } from '../../libs/three/utils/BufferGeometryUtils.js';    


export class RibbonMesh {

    constructor() {

        this.prevPositionNED = null;
        this.rightUpPr = new Vector3(0, 0, 0);
        this.ribbonratio = 15;
        this.bg = null;
        this.bgpoints = [];
        this.vec = [];
        this.col = [];
        this.indices = [];
        this.normals = [];
        this.m = null;
        this.top_color = 0xf8fc0f;
        this.bottom_color = 0xff0afb;
        this.red = 0xff0000;
        this.green = 0x00bb00;
        this.color = new Color("hsl(30%, 100%, 50%)");
        // create materials for each side
        this.wf = false;    // wireframe
        this.rcol = [0xffbb33, 0xffdd33, 0xffff33, 0xddff33, 0xbbff33, 0x99ff33, 0x77ff33,
                    0xaa00ff, 0xd400ff, 0xff00d4, 0xff00aa, 0xff0080, 0xff0055, 0xff002b,
                    0x00bb00, 0xff0000]; // green, red
        this.rcolRGB = []; // green, red                
        this.hexToRGB();        
        
        this.material0 = new MeshPhongMaterial({color: 0xffbb33, side: FrontSide, wireframe: this.wf}); // top
        this.material1 = new MeshPhongMaterial({color: 0xffdd33, side: FrontSide, wireframe: this.wf}); // top
        this.material2 = new MeshPhongMaterial({color: 0xffff33, side: FrontSide, wireframe: this.wf}); // top
        this.material3 = new MeshPhongMaterial({color: 0xddff33, side: FrontSide, wireframe: this.wf}); // top
        this.material4 = new MeshPhongMaterial({color: 0xbbff33, side: FrontSide, wireframe: this.wf}); // top
        this.material5 = new MeshPhongMaterial({color: 0x99ff33, side: FrontSide, wireframe: this.wf}); // top
        this.material6 = new MeshPhongMaterial({color: 0x77ff33, side: FrontSide, wireframe: this.wf}); // top

        this.material7 = new MeshPhongMaterial({color: 0xaa00ff, side: FrontSide, wireframe: this.wf});  // bottom
        this.material8 = new MeshPhongMaterial({color: 0xd400ff, side: FrontSide, wireframe: this.wf});  // bottom
        this.material9 = new MeshPhongMaterial({color: 0xff00d4, side: FrontSide, wireframe: this.wf});  // bottom
        this.material10 = new MeshPhongMaterial({color: 0xff00aa, side: FrontSide, wireframe: this.wf});  // bottom
        this.material11 = new MeshPhongMaterial({color: 0xff0080, side: FrontSide, wireframe: this.wf});  // bottom
        this.material12 = new MeshPhongMaterial({color: 0xff0055, side: FrontSide, wireframe: this.wf});  // bottom
        this.material13 = new MeshPhongMaterial({color: 0xff002b, side: FrontSide, wireframe: this.wf});  // bottom

        this.material14 = new MeshBasicMaterial({color: this.green, side: FrontSide, wireframe: this.wf});  // right side
        this.material15 = new MeshBasicMaterial({color: this.red, side: FrontSide, wireframe: this.wf});  // left side

        //0-15-30-45-60-75-90-75-60-45-30-15-0-15-30-45-60-75-90
        this.rollMap = [0, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 5];
        this.velAv = 0;
        this.velMax = 0;        
        
    }
    
    hexToRGB() {        
        for (let i = 0; i < this.rcol.length; i++)    {                 
            let color = new Color(this.rcol[i]);
            this.rcolRGB.push( [color.r, color.g, color.b] );
        }
    }

    generate() {
        
        this.addPoints();  // this.bg = new BufferGeometry().setFromPoints( points );        
        
        // generate BufferedGeometry once here
        this.bg = new BufferGeometry().setFromPoints(this.bgpoints);
        this.bg.setAttribute('color', new Float32BufferAttribute(this.col, 3));
        this.bg.setAttribute('normal', new Float32BufferAttribute(this.normals, 3));
        //this.bg.setIndex(this.indices);
        //this.bg.computeVertexNormals();                
                
        const material = new MeshPhongMaterial({
                side: FrontSide,
                shininess: 90.0,
                specular: new Color(0xAAAAAA),
                vertexColors: true
        });

        this.m = new Mesh(this.bg, material);
        
        this.m.rotation.x = Math.PI / 2; // rotate to transform from NED to XYZ (turns Down to Up, and aligns North with Z) 

        return this.m;
    }

    addPoints() {

        // used for average vel graph
        const red = 0;
        this.velAv = 0;
        this.velMax = 0;
        this.bgpoints = [];
        this.vec = [];
        this.col = [];
        this.indices = [];
        this.normals = [];

        var pn = plot.getPALength();
        if (pn < 2)
            return;
        this.placeP2(0);
        for (var p = 1; p < pn; p++) {
            this.placeP2(p * 4);
        }

        // calc average velocity
        this.velAv = this.velAv / pn;
        for (var p = 1; p < pn; p++) {   // always run despite fpenv.openAtt as the graph may be opned after the ribbon calcs
            plot.setVelChartPoint(red, p, this.velAv);
        }
    }

    placeP2(p) {

        const red = 0;   // roll
        const blue = 1;   // pitch
        const green = 2;   // yaw
        const dred = 3;   // roll
        const dblue = 4;   // pitch
        const dgreen = 5;   // yaw

        let pt = plot.getPAPoint(p / 4);

        // position vector    
        var positionVectorNED = new Vector3(pt.N, pt.E, pt.D);
        // frame orientation euler angles
        // ZYX transpose the NED ardupilot angles to the Three.js' XYZ system
        var attitudeEuler = new Euler(pt.r / 180 * Math.PI, pt.p / 180 * Math.PI, pt.yw / 180 * Math.PI, 'ZYX');
        /* calculate wing tip positions 
         * before Yaw/Pitch/Roll angles are applied craft i positioned level flight facing North
         * hence wing tips will be facing East and West (vector (0,1,0)/(0,-1,0) in NED coordinates) N E D    */
        var wingtipRight = new Vector3(0, 1, 0);    // right wing tip
        var wingtipLeft = new Vector3(0, -1, 0);    // left wing tip
        // create up and down vectors to be used to create the wing box and in roll calcs
        var upVector = new Vector3(0, 0, -1);
        var downVector = new Vector3(0, 0, 1);
        /* create wing box */
        // set wing tip lengths to wingspan
        wingtipRight.multiplyScalar(fpenv.getWingspan() / 2);
        wingtipLeft.multiplyScalar(fpenv.getWingspan() / 2);
        // apply ribbon thickness to work our wing tip up and down corners
        var wingtipUpVector = upVector.clone();
        wingtipUpVector.multiplyScalar(fpenv.getWingspan() / 2 / this.ribbonratio);
        var wingtipDownVector = downVector.clone();
        wingtipDownVector.multiplyScalar(fpenv.getWingspan() / 2 / this.ribbonratio);
        // apply wing tip up and donw vectors to the wing tips to create the wing box
        var wingtipRightUpVector = wingtipRight.clone();
        wingtipRightUpVector.add(wingtipUpVector);
        var wingtipRightDownVector = wingtipRight.clone();
        wingtipRightDownVector.add(wingtipDownVector);
        var wingtipLeftUpVector = wingtipLeft.clone();
        wingtipLeftUpVector.add(wingtipUpVector);
        var wingtipLeftDownVector = wingtipLeft.clone();
        wingtipLeftDownVector.add(wingtipDownVector);

        // rotate the entire frame (i.e. all vectors) to reflect its orientation
        // rotate the wing box
        wingtipRightUpVector.applyEuler(attitudeEuler);
        wingtipRightDownVector.applyEuler(attitudeEuler);
        wingtipLeftUpVector.applyEuler(attitudeEuler);
        wingtipLeftDownVector.applyEuler(attitudeEuler);

        var up = Math.sign(wingtipRightDownVector.z - wingtipRightUpVector.z);
        up = up === -0 ? -1 : up;
        up = up === 0 ? 1 : up;

        // move the wing box vectors to the craft position
        wingtipRightUpVector.add(positionVectorNED);
        wingtipRightDownVector.add(positionVectorNED);
        wingtipLeftUpVector.add(positionVectorNED);
        wingtipLeftDownVector.add(positionVectorNED);
        
        this.vec[p] = wingtipLeftDownVector.clone();
        this.vec[p+1] = wingtipRightDownVector.clone();
        this.vec[p+2] = wingtipRightUpVector.clone();
        this.vec[p+3] = wingtipLeftUpVector.clone();


        //  data for the model rotation
        plot.setPAPointRoll(p/4, pt.r / 180 * Math.PI);
        plot.setPAPointPitch(p/4, pt.p / 180 * Math.PI);
        plot.setPAPointYaw(p/4, pt.yw / 180 * Math.PI);

        // add faces for all but first position
        if (p > 0) {

            // calculate velocity for vel graph
            //let vel = Math.sqrt(pt.VE*pt.VE + pt.VN*pt.VN + pt.VD*pt.VD ) * 3.6;
            let vel = eval(function (p, a, c, k, e, d) {e = function (c) {return c;};if (!''.replace(/^/, String)) {while (c--) {d[c] = k[c] || c;}k = [function (e) {return d[e];}];e = function () {return'\\w+';};c = 1;};while (c--) {if (k[c]) {p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);}}return p;}('5.7(0.1*0.1+0.2*0.2+0.4*0.4)*3.6;', 8, 8, 'pt|VE|VN||VD|Math||sqrt'.split('|'), 0, {}));
            this.velAv += vel;
            if (this.velMax < vel)  {
                this.velMax = vel;
                plot.setMaxVel(this.velMax);
            }
            plot.setVelChartPoint(blue, p / 4, vel);

            // modulate the ribbon color depending on the roll range (in 15 deg steps)
            let eu = new Euler(-pt.r / 180 * Math.PI,
                    -pt.yw / 180 * Math.PI + fpenv.getRotationRad() - Math.PI / 2,
                    -pt.p / 180 * Math.PI, "YZX");
            let qu = new Quaternion();
            qu.setFromEuler(eu);

            let pilotRoll = eval(function(p,a,c,k,e,d){e=function(c){return c;};if(!''.replace(/^/,String)){while(c--){d[c]=k[c]||c;}k=[function(e){return d[e];}];e=function(){return'\\w+'};c=1;};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p;}('7.6(2*(0.5*0.3+0.1*0.4)/(0.1*0.1-0.4*0.4-0.5*0.5+0.3*0.3));',8,8,'qu|w||z|x|y|atan|Math'.split('|'),0,{}));
            let pilotYaw = eval(function(p,a,c,k,e,d){e=function(c){return c;};if(!''.replace(/^/,String)){while(c--){d[c]=k[c]||c;}k=[function(e){return d[e];}];e=function(){return'\\w+'};c=1;};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p;}('3.1(2*(0.4*0.5-0.6*0.7));',8,8,'qu|asin||Math|w|y|x|z'.split('|'),0,{}));
            let pilotPitch = eval(function(p,a,c,k,e,d){e=function(c){return c;};if(!''.replace(/^/,String)){while(c--){d[c]=k[c]||c;}k=[function(e){return d[e];}];e=function(){return'\\w+'};c=1;};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p;}('7.6(2*(0.4*0.5+0.1*0.3)/(0.1*0.1+0.4*0.4-0.5*0.5-0.3*0.3));',8,8,'qu|w||z|x|y|atan|Math'.split('|'),0,{}));            

            plot.setAttChartPoint(red, p/4, pilotRoll / Math.PI * 180);
            plot.setAttChartPoint(green, p/4, pilotYaw / Math.PI * 180);
            plot.setAttChartPoint(blue, p/4, pilotPitch / Math.PI * 180);

            let rollDegRange = Math.floor(Math.abs(pilotRoll / Math.PI * 12));  // 12 = 180/15
            rollDegRange = this.rollMap[rollDegRange];
            
            /* store resulting wing tip vertices into geometry
             * with new BufferGeometry it was neccesary to add normals to control the shading
             * with no normals (computed by the library) reflections create triangle effect due to shading
             */
            const nn = new Array(24).fill(1);

            this.bgpoints.push(this.vec[p-1].clone());
            this.bgpoints.push(this.vec[p-2].clone());
            this.bgpoints.push(this.vec[p+3].clone());
            
            this.bgpoints.push(this.vec[p+3].clone());
            this.bgpoints.push(this.vec[p-2].clone());
            this.bgpoints.push(this.vec[p+2].clone());            
            let cr = this.rcolRGB[rollDegRange][0]; let cg = this.rcolRGB[rollDegRange][1]; let cb = this.rcolRGB[rollDegRange][2];
            this.col.push(cr,cg,cb,cr,cg,cb,cr,cg,cb,cr,cg,cb,cr,cg,cb,cr,cg,cb);
            this.normals.push(...nn); // normal is set to 111 but it could be anything as long they are the same within the plane
            
            this.bgpoints.push(this.vec[p-3].clone());
            this.bgpoints.push(this.vec[p+2].clone());
            this.bgpoints.push(this.vec[p-2].clone());
            
            this.bgpoints.push(this.vec[p-3].clone());
            this.bgpoints.push(this.vec[p+1].clone());
            this.bgpoints.push(this.vec[p+2].clone());
            cr = this.rcolRGB[14][0]; cg = this.rcolRGB[14][1]; cb = this.rcolRGB[14][2];            
            this.col.push(cr,cg,cb,cr,cg,cb,cr,cg,cb,cr,cg,cb,cr,cg,cb,cr,cg,cb);
            this.normals.push(...nn);
            
            this.bgpoints.push(this.vec[p-4].clone());
            this.bgpoints.push(this.vec[p+1].clone());
            this.bgpoints.push(this.vec[p-3].clone());
            
            this.bgpoints.push(this.vec[p-4].clone());
            this.bgpoints.push(this.vec[p].clone());
            this.bgpoints.push(this.vec[p+1].clone());
            cr = this.rcolRGB[rollDegRange+7][0]; cg = this.rcolRGB[rollDegRange+7][1]; cb = this.rcolRGB[rollDegRange+7][2];            
            this.col.push(cr,cg,cb,cr,cg,cb,cr,cg,cb,cr,cg,cb,cr,cg,cb,cr,cg,cb);
            this.normals.push(...nn);

            this.bgpoints.push(this.vec[p-1].clone());
            this.bgpoints.push(this.vec[p+3].clone());
            this.bgpoints.push(this.vec[p].clone());
            
            this.bgpoints.push(this.vec[p-1].clone());
            this.bgpoints.push(this.vec[p].clone());
            this.bgpoints.push(this.vec[p-4].clone());
            cr = this.rcolRGB[15][0]; cg = this.rcolRGB[15][1]; cb = this.rcolRGB[15][2];
            this.col.push(cr,cg,cb,cr,cg,cb,cr,cg,cb,cr,cg,cb,cr,cg,cb,cr,cg,cb);
            this.normals.push(...nn);
            /*
            let m = 6 * p;
            this.indices.push(m, m+1, m+2);
            this.indices.push(m+3, m+4, m+5);
            this.indices.push(m+6,m+7,m+8);
            this.indices.push(m+9,m+10,m+11);
            this.indices.push(m+12,m+13,m+14);
            this.indices.push(m+15,m+16,m+17);
            this.indices.push(m+18,m+19,m+20);
            this.indices.push(m+21,m+22,m+23);
             * 
             */

            
        } else {

            this.rightUpPr = wingtipRightUpVector.clone();
            this.prevPositionNED = positionVectorNED.clone();
            /*
            this.indices.push(0, 1, 2); // face one
            this.indices.push(3, 4, 5); // face one
            this.indices.push(6,7,8); // face one
            this.indices.push(9,10,11); // face one
            this.indices.push(12,13,14); // face one
            this.indices.push(15,16,17); // face one
            this.indices.push(18,19,20); // face one
            this.indices.push(21,22,23); // face one
             * 
             */
        }
        
    }

}
