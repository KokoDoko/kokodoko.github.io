class View {
    
    protected element : HTMLElement;
           
    constructor(type:string) {
        this.element = document.createElement(type);
        let foreground = document.getElementsByTagName("foreground")[0];
                       
        foreground.appendChild(this.element);
    }
    
 
    
    public remove(){
        this.element.remove();
    }
    
    // todo get bounds for collision detection
    /*
    get bounds(): Object {
        return {x:this._x, y:this._y, width:this.element.offsetWidth, height:this.element.offsetHeight};
    }
    */
}