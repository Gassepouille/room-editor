import ToolSuper from './ToolSuper.js';

export default class ToolWall extends ToolSuper {
	constructor() {
		super();
		let _geometry = new THREE.BoxBufferGeometry(1, 0.5, 0.1);
		let _material = new THREE.MeshBasicMaterial({ color: 0x990000 });
		this._object3d = new THREE.Mesh(_geometry, _material);
		this._origin = null;
		this._destinationPosition = new THREE.Vector3();
		this._tween = null;
	}
	addTo(object3d) {
		object3d.add(this._object3d);
	}
	start(vectorPosition) {
		this._origin = vectorPosition.clone();
		this._object3d.scale.x = 0.1;
		this._object3d.position.x = vectorPosition.x;
		this._object3d.position.y = 0.5 / 2;
		this._object3d.position.z = vectorPosition.z;
	}
	update(vectorPosition) {
		if (this._destinationPosition.equals(vectorPosition)) return;
		this._destinationPosition.copy(vectorPosition);
		
		let _relativePosition2D = new THREE.Vector2(vectorPosition.x - this._origin.x, vectorPosition.z - this._origin.z);
		let _angle = - _relativePosition2D.angle();
		let _scale = this._origin.distanceTo(vectorPosition);
		if(_scale === 0) _scale = 0.0001;
		if (window.TWEEN) {
			if (this._tween !== null) this._tween.stop();
			let _this = this;

			if (Math.abs(this._object3d.rotation.y) === 0) this._object3d.rotation.y = - Math.PI*2
			let _alternateRoute = _angle - Math.PI*2;

			// Try to find the shorter angle to the destination
			if (Math.abs(this._object3d.rotation.y - _angle) > Math.abs(this._object3d.rotation.y - _alternateRoute)){
				_angle = _alternateRoute;
			}

			this._tween = new TWEEN.Tween({
				scale: _this._object3d.scale.x,
				angle: _this._object3d.rotation.y,
			})
			.to({
				scale: _scale,
				angle: _angle,
			}, 200)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function (values) {
				_this._object3d.scale.x = values.scale;

				_this._object3d.rotation.y = values.angle;
				_this._object3d.position.x = _this._origin.x + Math.cos(- values.angle) * values.scale / 2;
				_this._object3d.position.z = _this._origin.z + Math.sin(- values.angle) * values.scale / 2;
			})
			.start();
		} else {
			this._object3d.scale.x = _scale;
			// Calculate rotation wall
			this._object3d.rotation.y = _angle;
			this._object3d.position.x = this._origin.x + Math.cos(- _angle) * _scale / 2;
			this._object3d.position.z = this._origin.z + Math.sin(- _angle) * _scale / 2;
		}
	}
	finish(vectorPosition) {
		if (window.TWEEN && this._tween && this._tween.isPlaying()){
			this._tween.onComplete(()=>{
				this.update(vectorPosition);
				let _parent = this._object3d.parent;
				_parent.remove(this._object3d);
				_parent.add(this._object3d.clone());
			})
		}else{
			this.update(vectorPosition);
			let _parent = this._object3d.parent;
			_parent.remove(this._object3d);
			_parent.add(this._object3d.clone());
		}
	}
}