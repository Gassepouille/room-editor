import ToolBar from './UI/ToolBar.js';
import Player from './Player.js';
import Pointer from './Pointer.js';
import ToolOrbit from './tools/ToolOrbit.js';
import World from './objects/World.js';

export default class App {
        constructor() {
                this._initUI();
                this._init3D();
                this._iniPointerLogic();
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
                this._toolBar = new ToolBar();
                this._view = new Vue({ el: '#ui' });
                this._toolBar.addTool({
                        name: "camera",
                        icon: "./images/tools-icon/camera-32px.png",
                        callback : ()=>{
                                console.log('enable camera');
                        }
                });
                this._toolBar.addTool({
                        name: "wall",
                        icon: "./images/tools-icon/wall-32px.png",
                        callback : ()=>{
                                console.log('Put wall');
                        }
                });
        }
        _iniPointerLogic(){
                this._pointer = new Pointer(this._player.rendererDomElement);
                this._pointer.scene = this._player.scene;
                this._pointer.camera = this._player.camera;
                this._pointer.onPick = (object, doubleclick)=>{
                        console.log('PICK', object, doubleclick);
                }
        }
}