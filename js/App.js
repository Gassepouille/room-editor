import ToolBar from './UI/ToolBar.js';
import Player from './Player.js';
import Pointer from './Pointer.js';
import ToolOrbit from './tools/ToolOrbit.js';
import World from './objects/World.js';

export default class App {
	constructor() {
		this._sizeWorld = 60;
		this._initUI();
		this._init3D();
		this._initHelpers();
		this._iniPointerLogic();
	}
	_init3D() {
		let editorDom = document.querySelector("#editor");
		this._player = new Player(editorDom);
		this._player.start();

		this._toolOrbit = new ToolOrbit(this._player.camera, this._player.rendererDomElement);
		this._player.onPreRenderFcts.push(this._toolOrbit.controls.update);

		this._world = new World(this._sizeWorld);
		this._player.scene.add(this._world.object3d);
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
				console.log('Put wall');
			}
		});
	}
	_initHelpers() {
		let _gridHelper = new THREE.GridHelper(this._sizeWorld, this._sizeWorld, 0x000000, 0x555555);
		_gridHelper.userData.selectable = false;
		_gridHelper.position.y = 0.002;
		this._player.scene.add(_gridHelper);
	}
	_iniPointerLogic() {
		this._pointer = new Pointer(this._player.rendererDomElement);
		this._pointer.scene = this._player.scene;
		this._pointer.camera = this._player.camera;
		this._pointer.onPick = (object, doubleclick) => {
			console.log('PICK', object, doubleclick);
		}
	}
}