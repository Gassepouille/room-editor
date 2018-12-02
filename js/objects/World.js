export default class World {
        constructor() {
                this._object3d = new THREE.Object3D();
                this.init();
        }
        init() {
                let texture = new THREE.TextureLoader().load("images/textures/grass.png");
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(60, 60);

                let geometryGround = new THREE.PlaneBufferGeometry(60, 60);
                let materialGround = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide });
                let plane = new THREE.Mesh(geometryGround, materialGround);
                plane.rotation.x = - Math.PI / 2;
                plane.userData.selectable = false;
                this._object3d.add(plane);

                let geometrySkyBox = new THREE.SphereBufferGeometry(30, 32, 32);
                let materialSkyBox = new THREE.MeshLambertMaterial({ color: 0x42cbf4, side: THREE.BackSide });
                let sphere = new THREE.Mesh(geometrySkyBox, materialSkyBox);
                sphere.userData.selectable = false;
                this._object3d.add(sphere);

                let hemiLight = new THREE.HemisphereLight(0xfffef2, 0xaf8669, 1);
                hemiLight.position.set(0, 50, 0);
                this._object3d.add(hemiLight);
        }
        get object3d(){
                return this._object3d;
        }
}