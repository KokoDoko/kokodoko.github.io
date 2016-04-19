/// <reference path="view.ts"/>
/// <reference path="../typings/greensock.d.ts"/>

class Explosion extends View {
            
    constructor(x:number, y:number) {
        /* maak een html element 'explosion', voeg toe aan de game, en sla dit op in this.element */
        super("explosion");
        
        let startx = x;
        let starty = y;
        
        TweenLite.set(this.element, {x:startx, y:starty});
        
        // hallo
        
        
        TweenLite.to(this.element, 1, {opacity:0, scale:2, ease:Cubic.easeOut, onComplete: () => this.endReached()});
            // this.endReached.bind(this)});
    }
    
    endReached():void {
        this.element.remove();
    }
    
}