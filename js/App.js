import ToolBar from './UI/ToolBar.js';
import Player from './Player.js';
import Pointer from './Pointer.js';
import World from './objects/World.js';
import ToolOrbit from './tools/ToolOrbit.js';
import ToolWall from './tools/ToolWall.js';

export default class App {
	constructor() {
		this._sizeWorld = 60;
		this._useGrid = true;
		
		this._init3D();
		this._initTools();
		this._iniPointerLogic();

		this._initUI();
	}
	_init3D() {
		let editorDom = document.querySelector("#editor");
		this._player = new Player(editorDom);
		this._player.start();

		this._world = new World(this._sizeWorld);
		this._player.scene.add(this._world.object3d);
	}
	_initTools(){
		// Orbit control tool
		this._toolOrbit = new ToolOrbit(this._player.camera, this._player.rendererDomElement);
		this._player.onPreRenderFcts.push(this._toolOrbit.controls.update);

		// Wall tool
		this._toolWall = new ToolWall();
	}
	_initUI() {
		this._toolBar = new ToolBar();
		this._view = new Vue({ el: '#ui' });

		this._toolBar.addTool({
			name: "camera",
			icon: "./images/tools-icon/camera-32px.png",
			activate: () => {
				this._toolOrbit.activate();
			},
			deactivate:()=>{
				this._toolOrbit.deactivate();
			}
		});

		this._toolBar.addTool({
			name: "wall",
			icon: "./images/tools-icon/wall-32px.png",
			activate: () => {
				this._toolWall.activate();
			},
			deactivate: () => {
				this._toolWall.deactivate();
			}
		});
	}
	_iniPointerLogic() {
		this._pointer = new Pointer(this._player.rendererDomElement);
		this._pointer.scene = this._player.scene;
		this._pointer.camera = this._player.camera;
		this._initPickLogic();
		this._initDragLogic();
	}
	_initPickLogic(){
		this._pointer.onPick = (object, doubleclick) => {
			console.log('PICK', object, doubleclick);
		}
	}
	_initDragLogic(){
		// If orbit control enable, disable dragging
		let _startedDragging = false;
		this._pointer.onDrag = (object) => {
			if (this._toolOrbit.active === true) return;
			if (this._useGrid === true) object.point.round();
			// Init dragging
			if(_startedDragging === false){
				_initDragging.call(this, object);
				_startedDragging = true;
				return;
			}
			_dragging.call(this, object);
		}

		this._pointer.onStopDrag = (object) => {
			if (this._toolOrbit.active === true) return;
			if (this._useGrid === true) object.point.round();
			_stopDragging.call(this, object);
			_startedDragging = false;
		}

		return;
		// Dragging function
		function _initDragging(object){
			if (this._toolWall.active === true){
				this._toolWall.addTo(this._player.scene);
				this._toolWall.start(object.point);
			}
		}
		function _dragging(object){
			if (this._toolWall.active === true) {
				this._toolWall.update(object.point);
			}
		}
		function _stopDragging(object){
			if (this._toolWall.active === true) {
				this._toolWall.finish();
			}
		}
	}
}