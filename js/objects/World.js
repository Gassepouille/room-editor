export default class World {
        constructor(sizeWorld=60) {
		this._sizeWorld = sizeWorld;
                this._object3d = new THREE.Object3D();
                this._init();
                this._initGrid();
        }
        _init() {
                let _texture = new THREE.TextureLoader().load("images/textures/grass.png");
                _texture.wrapS = THREE.RepeatWrapping;
                _texture.wrapT = THREE.RepeatWrapping;
		_texture.repeat.set(this._sizeWorld, this._sizeWorld);

		let _geometryGround = new THREE.PlaneBufferGeometry(this._sizeWorld, this._sizeWorld);
                let _materialGround = new THREE.MeshLambertMaterial({ map: _texture, side: THREE.DoubleSide });
                let _plane = new THREE.Mesh(_geometryGround, _materialGround);
                _plane.rotation.x = - Math.PI / 2;
                _plane.userData.selectable = false;
		this._object3d.add(_plane);
		
		let _geometrySkyBox = new THREE.SphereBufferGeometry(this._sizeWorld/2, 32, 32);
                let _materialSkyBox = new THREE.MeshLambertMaterial({ color: 0x42cbf4, side: THREE.BackSide });
                let _sphere = new THREE.Mesh(_geometrySkyBox, _materialSkyBox);
                _sphere.userData.pickable = false;
                this._object3d.add(_sphere);

                let _hemiLight = new THREE.HemisphereLight(0xfffef2, 0xaf8669, 1);
                _hemiLight.position.set(0, 50, 0);
                this._object3d.add(_hemiLight);
        }
        _initGrid(){
                let _gridHelper = new THREE.GridHelper(this._sizeWorld, this._sizeWorld, 0x000000, 0x555555);
                _gridHelper.userData.pickable = false;
                _gridHelper.position.y = 0.002;
                this._object3d.add(_gridHelper);
        }
        get object3d(){
		return this._object3d;
        }
}