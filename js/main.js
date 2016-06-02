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
var CanvasObject = (function (_super) {
    __extends(CanvasObject, _super);
    function CanvasObject(x, y, imageName) {
        _super.call(this, x, y);
        var canvas = document.getElementsByTagName("canvas")[0];
        this.context = canvas.getContext('2d');
        this.image = new Image();
        this.image.src = imageName;
    }
    CanvasObject.prototype.draw = function () {
        this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    return CanvasObject;
}(GameObject));
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
    function DraggableDomObject(x, y, HTMLtagName, offsetX, offsetY) {
        var _this = this;
        _super.call(this, x, y, HTMLtagName);
        this.offSetX = 0;
        this.offSetY = 0;
        this.htmlElement.addEventListener("mousedown", function (e) { return _this.drag(e); });
        this.htmlElement.addEventListener("mouseup", function (e) { return _this.drop(e); });
        this.mouseMoveBind = function (e) { return _this.updatePosition(e); };
        this.offSetX = offsetX;
        this.offSetY = offsetY;
        this.draw();
        window.addEventListener("mousemove", this.mouseMoveBind);
    }
    DraggableDomObject.prototype.drag = function (event) {
        event.preventDefault();
        if (event.altKey) {
            var go = new DraggableDomObject(this.x, this.y, this.htmlElement.tagName, event.offsetX, event.offsetY);
        }
        else {
            this.offSetX = event.offsetX;
            this.offSetY = event.offsetY;
            window.addEventListener("mousemove", this.mouseMoveBind);
        }
    };
    DraggableDomObject.prototype.updatePosition = function (event) {
        this.x = event.clientX - this.offSetX;
        this.y = event.clientY - this.offSetY;
        this.draw();
    };
    DraggableDomObject.prototype.drop = function (event) {
        if (Settings.snapping) {
            var rounded = Math.floor(this.x / 54) * 54;
            this.x = Math.round(this.x / 54) * 54;
            this.y = Math.round(this.y / 54) * 54;
            this.draw();
        }
        window.removeEventListener("mousemove", this.mouseMoveBind);
    };
    return DraggableDomObject;
}(DOMObject));
var MenuItem = (function (_super) {
    __extends(MenuItem, _super);
    function MenuItem(x, y, HTMLtagName, game) {
        var _this = this;
        _super.call(this, x, y, HTMLtagName);
        this.x = x;
        this.y = y;
        this.HTMLtagName = HTMLtagName;
        this.scale = Math.min(1, 54 / this.height, 54 / this.width);
        this.draw();
        this.htmlElement.addEventListener("mousedown", function (e) { return _this.createElement(e); });
    }
    MenuItem.prototype.createElement = function (event) {
        var x = event.clientX - event.offsetX;
        var y = event.clientY - event.offsetY;
        var go = new DraggableDomObject(x, y, this.HTMLtagName, event.offsetX, event.offsetY);
    };
    return MenuItem;
}(DOMObject));
var Menu = (function (_super) {
    __extends(Menu, _super);
    function Menu(game) {
        _super.call(this, 0, 0, "menu");
        this.menuOptions = ["brick", "question", "cloud", "floor", "goomba", "pipe"];
        for (var i = 0; i < this.menuOptions.length; i++) {
            var m = new MenuItem(i * 60 + 10, 10, this.menuOptions[i], game);
        }
        var b = new SnapButton(420, 16);
    }
    return Menu;
}(DOMObject));
var Game = (function () {
    function Game() {
        new Menu(this);
    }
    return Game;
}());
window.addEventListener("load", function () {
    new Game();
    if ('ontouchstart' in window) {
        var el = document.getElementsByTagName("warning")[0];
        el.style.visibility = "visible";
    }
});
var Settings = (function () {
    function Settings() {
    }
    Settings.snapping = true;
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