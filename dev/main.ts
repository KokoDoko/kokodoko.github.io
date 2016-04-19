class Game {
    
    private score:number = 0;
    private ui:HTMLElement;
    private timeid:number;
    
    public container:HTMLElement;
    
    constructor() {
        // referenties naar de ui en de main container
        this.ui = document.getElementsByTagName("ui")[0] as HTMLElement;
        this.container = document.getElementsByTagName("game")[0] as HTMLElement;
        
        // wolken toevoegen aan de achtergrond
        new Cloud();
        new Cloud();
        new Cloud();
        
        
        
        // timer voor bommetjes
        this.timeid = setInterval(this.addBomb.bind(this), 1000);
    }
        
    private addBomb():void {
        let b = new Bomb(this);
    }
       
    public updateScore(i:number):void {
        this.score += i;
        this.ui.innerHTML = "Score: " + this.score;
    }

} 

window.addEventListener("load", function(){
    new Game();
});