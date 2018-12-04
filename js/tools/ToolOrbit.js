import ToolSuper from './ToolSuper.js';

export default class ToolOrbit extends ToolSuper {
	constructor(camera, domElement) {
		super();
		this._active = true
		this._init(camera, domElement);
	}
	_init(camera, domElement) {
		this.controls = new THREE.OrbitControls(camera, domElement);
		this.controls.target = new THREE.Vector3(0, 0, 0);
		this.controls.enableDamping = true;
		this.controls.panDampingFactor = 0.1;
		this.controls.rotateDampingFactor = 0.1;
		this.controls.zoomDampingFactor = 0.1;
		this.controls.rotateSpeed = 0.1;
		this.controls.panSpeed = 0.1;
		this.controls.zoomSpeed = 0.2;
		this.controls.minDistance = 0.05;
	}
	activate() {
		this.controls.enabled = true;
		super.activate();
	}
	deactivate() {
		this.controls.enabled = false;
		super.deactivate();
	}
}