/// <reference path="view.ts"/>
/// <reference path="../typings/greensock.d.ts"/>

class Bomb extends View {
    
    private game:Game;
    private tween:TweenLite;
        
    constructor(g:Game) {
        /* maak een html element 'bomb', voeg toe aan de game, en sla dit op in this.element */
        super("bomb");
        
        this.game = g;
                
        let startx = Math.random() * (this.game.container.offsetWidth - 142);
        let starty = -224;
        let droptime = Math.random() * 2 + 2;
        
        let scale = Math.random() + 0.5;
        
        TweenLite.set(this.element, {x:startx, y:starty, scale:scale});
        
        // gebruik 'bind' om een functie binnen de bomb scope te houden - this verwijst dan altijd naar de bomb
        this.element.addEventListener("click", this.onClick.bind(this));
               
        // bewegen
        this.tween = TweenLite.to(this.element, droptime, {y:this.game.container.offsetHeight-224, ease:Linear.easeNone, onComplete:this.endReached.bind(this)});
    }
    //
    // einde scherm bereikt
    //
    private endReached():void 
    {
        this.game.updateScore(-10);
        this.explode();
    }  
    
    //
    // click handler
    //
    private onClick():void {
        this.tween.kill();
        this.game.updateScore(10);
        this.explode();
    }  
    //
    // explode
    //
    private explode():void {
        // hack: the element has a _gsTransform property to read the x and y values (but only if the element has been tweened!)
        let temp:any = this.element;        
        let endx = temp._gsTransform.x;
        let endy = temp._gsTransform.y;
        
        
        let b = new Explosion(endx, endy);
        this.remove();
    }  
}