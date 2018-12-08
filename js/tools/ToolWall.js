import ToolSuper from './ToolSuper.js';

export default class ToolWall extends ToolSuper {
	constructor() {
		super();
		let _geometry = new THREE.BoxBufferGeometry(1, 0.5, 0.1);
		let _material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		this._object3d = new THREE.Mesh(_geometry, _material);
		this._origin = null;
	}
	addTo(object3d){
		object3d.add(this._object3d);
	}
	start(vectorPosition){		
		this._origin = vectorPosition.clone();
		this._object3d.scale.x = 0.1;
		this._object3d.position.x = vectorPosition.x;
		this._object3d.position.y = 0.5/2;
		this._object3d.position.z = vectorPosition.z;
	}
	update(vectorPosition){
		let _scale = this._origin.distanceTo(vectorPosition);
		this._object3d.scale.x = _scale;

		// Calculate rotation wall
		let _relativePosition2D = new THREE.Vector2(vectorPosition.x - this._origin.x, vectorPosition.z - this._origin.z);
		let _angle = _relativePosition2D.angle();
		this._object3d.rotation.y = - _angle;
		this._object3d.position.x = this._origin.x + Math.cos(_angle)*_scale/2;
		this._object3d.position.z = this._origin.z + Math.sin(_angle)*_scale/2;
	}
	finish(vectorPosition){

	}
}