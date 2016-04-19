var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var View = (function () {
    function View(type) {
        this.element = document.createElement(type);
        var foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this.element);
    }
    View.prototype.remove = function () {
        this.element.remove();
    };
    return View;
}());
var Bomb = (function (_super) {
    __extends(Bomb, _super);
    function Bomb(g) {
        _super.call(this, "bomb");
        this.game = g;
        var startx = Math.random() * (this.game.container.offsetWidth - 142);
        var starty = -224;
        var droptime = Math.random() * 2 + 2;
        var scale = Math.random() + 0.5;
        TweenLite.set(this.element, { x: startx, y: starty, scale: scale });
        this.element.addEventListener("click", this.onClick.bind(this));
        this.tween = TweenLite.to(this.element, droptime, { y: this.game.container.offsetHeight - 224, ease: Linear.easeNone, onComplete: this.endReached.bind(this) });
    }
    Bomb.prototype.endReached = function () {
        this.game.updateScore(-10);
        this.explode();
    };
    Bomb.prototype.onClick = function () {
        this.tween.kill();
        this.game.updateScore(10);
        this.explode();
    };
    Bomb.prototype.explode = function () {
        var temp = this.element;
        var endx = temp._gsTransform.x;
        var endy = temp._gsTransform.y;
        var b = new Explosion(endx, endy);
        this.remove();
    };
    return Bomb;
}(View));
var Cloud = (function (_super) {
    __extends(Cloud, _super);
    function Cloud() {
        _super.call(this, "cloud");
        var startx = -277 - (Math.random() * 700);
        var starty = Math.random() * 200 + 20;
        var scale = Math.random() + 0.45;
        TweenLite.set(this.element, { x: startx, y: starty, scale: scale });
        TweenMax.to(this.element, 12, { x: 1000, repeat: -1, ease: Linear.easeNone });
    }
    return Cloud;
}(View));
var Explosion = (function (_super) {
    __extends(Explosion, _super);
    function Explosion(x, y) {
        var _this = this;
        _super.call(this, "explosion");
        var startx = x;
        var starty = y;
        TweenLite.set(this.element, { x: startx, y: starty });
        TweenLite.to(this.element, 1, { opacity: 0, scale: 2, ease: Cubic.easeOut, onComplete: function () { return _this.endReached(); } });
    }
    Explosion.prototype.endReached = function () {
        this.element.remove();
    };
    return Explosion;
}(View));
var Game = (function () {
    function Game() {
        this.score = 0;
        this.ui = document.getElementsByTagName("ui")[0];
        this.container = document.getElementsByTagName("game")[0];
        new Cloud();
        new Cloud();
        new Cloud();
        this.timeid = setInterval(this.addBomb.bind(this), 1000);
    }
    Game.prototype.addBomb = function () {
        var b = new Bomb(this);
    };
    Game.prototype.updateScore = function (i) {
        this.score += i;
        this.ui.innerHTML = "Score: " + this.score;
    };
    return Game;
}());
window.addEventListener("load", function () {
    new Game();
});
//# sourceMappingURL=main.js.map