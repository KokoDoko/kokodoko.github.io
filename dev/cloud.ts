/// <reference path="../typings/greensock.d.ts"/>

class Cloud extends View {
    constructor() {
        /* maak een html element 'explosion', voeg toe aan de game, en sla dit op in this.element */
        super("cloud");
        
        let startx = -277 - (Math.random() * 700);
        let starty = Math.random() * 200 + 20;
        let scale = Math.random() + 0.45;
        
        TweenLite.set(this.element, {x:startx, y:starty, scale:scale});
        TweenMax.to(this.element, 12, {x:1000, repeat:-1, ease:Linear.easeNone});
    }
}