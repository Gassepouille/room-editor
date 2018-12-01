import ToolBar from './UI/ToolBar.js';
import Player from './Player.js';
import ToolOrbit from './tools/ToolOrbit.js';
import World from './objects/World.js';

export default class App {
        constructor() {
                this._initUI();
                this._init3D();
        }
        _init3D(){
                let editorDom = document.querySelector("#editor");
                this._player = new Player(editorDom);
                this._player.start();

                this._toolOrbit = new ToolOrbit(this._player.camera, this._player.rendererDomElement);
                this._player.onPreRenderFcts.push(this._toolOrbit.orbit.update);

                this._world = new World();
                this._player.scene.add(this._world.object3d);
        }
        _initUI(){
                this._toolBar = new toolbar();
        }
}