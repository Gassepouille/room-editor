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
		let _this = this;
		Vue.component('toolbar', {
			template: _this._toolBar._template,
			data() { return _this._toolBar.data; },
			methods: _this._toolBar.methods
		});

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
				let _clickableElements = [];
				this._world.object3d.traverseVisible((object3d) => {
					if (object3d.userData.pickable === false) return;
					_clickableElements.push(object3d);
				});
				this._pointer.setPickableElements(_clickableElements);
				this._toolWall.activate();
			},
			deactivate: () => {
				this._pointer.setPickableElements();
				this._toolWall.deactivate();
			}
		});
		this._toolBar.addTool({
			name: "complete walls",
			icon: "./images/tools-icon/connect-32px.png",
			noState : true,
			activate: () => {
				let _singlePoints = [];
				let _fullPoints = [];
				let _round = 10000;
				this._player.scene.traverseVisible((object3d)=>{
					if (object3d.name !== "wall") return;
					let _position = object3d.position;
					let _angle = object3d.rotation.y;
					let _scale = object3d.scale.x;

					let _pointAx = Math.round((_position.x + _scale / 2 * Math.cos(_angle)) * _round) / _round;
					let _pointAz = Math.round((_position.z + _scale / 2 * - Math.sin(_angle)) * _round) / _round;
					let _pointBx = Math.round((_position.x - _scale / 2 * Math.cos(_angle)) * _round) / _round;
					let _pointBz = Math.round((_position.z - _scale / 2 * - Math.sin(_angle)) * _round) / _round;

					let _pointA = new THREE.Vector2(_pointAx, _pointAz);
					let _pointB = new THREE.Vector2(_pointBx, _pointBz);

					_processPoint(_pointA);
					_processPoint(_pointB);
				});

				console.log(_singlePoints);
				// pair closest point, find center and length



				return;
				// A bit hard to read, but better perf than 2 nested loops
				function _processPoint(point){
					let _found = false
					for (let i = 0; i < _fullPoints.length; i++) {
						if (point.equals(_fullPoints[i])) _found = true;
					}
					if (!_found) {
						_singlePoints.push(point);
						_fullPoints.push(point);
					} else {
						_singlePoints = _singlePoints.filter((pointToCheck) => {
							return pointToCheck.equals(point) !== true;
						})
					}
				}
			}
		});
		this._toolBar.setActiveTool("wall");
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
				this._toolWall.finish(object.point);
			}
		}
	}
}