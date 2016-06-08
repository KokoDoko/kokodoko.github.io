var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameObject = (function () {
    function GameObject(x, y) {
        this._x = x;
        this._y = y;
        this._scale = 1;
    }
    Object.defineProperty(GameObject.prototype, "x", {
        get: function () { return this._x; },
        set: function (value) { this._x = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "y", {
        get: function () { return this._y; },
        set: function (value) { this._y = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "width", {
        get: function () { return this._width; },
        set: function (v) { this._width = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "height", {
        get: function () { return this._height; },
        set: function (v) { this._height = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "scale", {
        get: function () { return this._scale; },
        set: function (value) { this._scale = value; },
        enumerable: true,
        configurable: true
    });
    GameObject.prototype.update = function () {
    };
    GameObject.prototype.draw = function () {
    };
    return GameObject;
}());
var DOMObject = (function (_super) {
    __extends(DOMObject, _super);
    function DOMObject(x, y, HTMLtagName) {
        _super.call(this, x, y);
        this.htmlElement = document.createElement(HTMLtagName);
        document.body.appendChild(this.htmlElement);
        this.width = this.htmlElement.offsetWidth;
        this.height = this.htmlElement.offsetHeight;
        this.draw();
    }
    DOMObject.prototype.draw = function () {
        this.htmlElement.style.transform = "translate(" + this.x + "px, " + this.y + "px) scale(" + this.scale + ")";
    };
    return DOMObject;
}(GameObject));
var DraggableDomObject = (function (_super) {
    __extends(DraggableDomObject, _super);
    function DraggableDomObject(x, y, HTMLtagName, offx, offy) {
        var _this = this;
        _super.call(this, x, y, HTMLtagName);
        this.offSetX = 0;
        this.offSetY = 0;
        this.offSetX = offx;
        this.offSetY = offy;
        this.moveBind = function (e) { return _this.updatePosition(e); };
        window.addEventListener(Settings.down, function (e) { return _this.initDrag(e); });
        window.addEventListener(Settings.up, function (e) { return _this.stopDrag(e); });
        this.draw();
        window.addEventListener(Settings.move, this.moveBind);
    }
    DraggableDomObject.prototype.initDrag = function (e) {
        e.preventDefault();
        if (e.target === this.htmlElement) {
            var event_1 = new GameEvent(e);
            this.htmlElement.parentElement.appendChild(this.htmlElement);
            this.offSetX = event_1.clientX - this.x;
            this.offSetY = event_1.clientY - this.y;
            if (event_1.altKey) {
                var go = new DraggableDomObject(this.x, this.y, this.htmlElement.tagName, this.offSetX, this.offSetY);
            }
            else {
                window.addEventListener(Settings.move, this.moveBind);
            }
        }
    };
    DraggableDomObject.prototype.updatePosition = function (e) {
        e.preventDefault();
        var event = new GameEvent(e);
        this.x = event.clientX - this.offSetX;
        this.y = event.clientY - this.offSetY;
        this.draw();
    };
    DraggableDomObject.prototype.stopDrag = function (e) {
        window.removeEventListener(Settings.move, this.moveBind);
        e.preventDefault();
        Settings.log("STOP DRAG:  remove listener: " + Settings.move);
        var s = Settings.gridSize;
        if (Settings.snapping) {
            this.x = Math.round(this.x / s) * s;
            this.y = Math.round(this.y / s) * s;
            this.draw();
        }
    };
    return DraggableDomObject;
}(DOMObject));
var MenuButton = (function (_super) {
    __extends(MenuButton, _super);
    function MenuButton(x, y, HTMLtagName, game) {
        var _this = this;
        _super.call(this, x, y, HTMLtagName);
        this.x = x;
        this.y = y;
        this.HTMLtagName = HTMLtagName;
        this.scale = Math.min(1, 54 / this.height, 54 / this.width);
        this.draw();
        window.addEventListener(Settings.down, function (e) { return _this.createElement(e, _this); });
    }
    MenuButton.prototype.createElement = function (e, inst) {
        e.preventDefault();
        if (e.target === this.htmlElement) {
            var event_2 = new GameEvent(e);
            var offx = event_2.clientX - this.x;
            var offy = event_2.clientY - this.y;
            var x = event_2.clientX - offx;
            var y = event_2.clientY - offy;
            var go = new DraggableDomObject(x, y, this.HTMLtagName, offx, offy);
        }
    };
    return MenuButton;
}(DOMObject));
var Menu = (function (_super) {
    __extends(Menu, _super);
    function Menu(game) {
        _super.call(this, 0, 0, "menu");
        this.menuOptions = ["brick", "question", "cloud", "floor", "goomba", "pipe"];
        for (var i = 0; i < this.menuOptions.length; i++) {
            var m = new MenuButton(i * 60 + 10, 10, this.menuOptions[i], game);
        }
        var b = new SnapButton(420, 16);
    }
    return Menu;
}(DOMObject));
var Game = (function () {
    function Game() {
        if ('ontouchstart' in window) {
            Settings.enableTouch();
        }
        new Menu(this);
    }
    return Game;
}());
var GameEvent = (function () {
    function GameEvent(e) {
        this.clientX = 0;
        this.clientY = 0;
        this.altKey = false;
        if (e.type != "touchmove" && e.type != "mousemove")
            Settings.log("EVENT " + e.type);
        switch (e.type) {
            case "mousedown":
            case "mouseup":
            case "mousemove":
                var m = e;
                this.clientX = m.clientX;
                this.clientY = m.clientY;
                this.altKey = m.altKey;
                break;
            case "touchcancel":
            case "touchstart":
            case "touchmove":
                var allTouches = e;
                var t = allTouches.targetTouches[0];
                this.clientX = t.clientX;
                this.clientY = t.clientY;
                break;
            case "touchend":
                break;
            default:
                console.log("Unknown: " + e.type);
        }
    }
    return GameEvent;
}());
window.addEventListener("load", function () {
    new Game();
});
var Settings = (function () {
    function Settings() {
    }
    Settings.enableTouch = function () {
        Settings.down = "touchstart";
        Settings.up = "touchend";
        Settings.move = "touchmove";
        Settings.eventType = "touchEvent";
    };
    Settings.log = function (str) {
        var el = document.getElementsByTagName("about")[0];
        el.innerHTML = el.innerHTML + "<br>" + str;
        console.log(str);
    };
    Settings.gridSize = 54;
    Settings.snapping = true;
    Settings.down = "mousedown";
    Settings.up = "mouseup";
    Settings.move = "mousemove";
    Settings.eventType = "mouseEvent";
    return Settings;
}());
var SnapButton = (function (_super) {
    __extends(SnapButton, _super);
    function SnapButton(x, y) {
        var _this = this;
        _super.call(this, x, y, "snapbutton");
        this.htmlElement.addEventListener("click", function (e) { return _this.toggleSnap(e); });
    }
    SnapButton.prototype.toggleSnap = function (event) {
        Settings.snapping = !Settings.snapping;
        this.htmlElement.style.backgroundImage = (Settings.snapping) ? "url(images/snapbutton_on.png)" : "url(images/snapbutton_off.png)";
    };
    return SnapButton;
}(DOMObject));
//# sourceMappingURL=main.js.map