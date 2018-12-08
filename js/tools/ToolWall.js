import ToolSuper from './ToolSuper.js';

export default class ToolWall extends ToolSuper {
	constructor() {
		super();
		let _geometry = new THREE.BoxBufferGeometry(0.1, 1, 0.1);
		let _material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		this._object3d = new THREE.Mesh(_geometry, _material);
	}
	addTo(object3d){
		object3d.add(this._object3d);
	}
	start(vectorPosition){
		this._object3d.position.copy(vectorPosition);
		this._object3d.position.y = 1/2;
	}
	update(vectorPosition){

	}
	finish(vectorPosition){

	}
}