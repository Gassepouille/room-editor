export default class ToolOrbit{
        constructor(camera, domElement) {
                this.orbit = new THREE.OrbitControls(camera, domElement);
                this.orbit.target = new THREE.Vector3(0, 0, 0);
                this.orbit.enableDamping = true;
                this.orbit.panDampingFactor = 0.1;
                this.orbit.rotateDampingFactor = 0.1;
                this.orbit.zoomDampingFactor = 0.1;
                this.orbit.rotateSpeed = 0.1;
                this.orbit.panSpeed = 0.1;
                this.orbit.zoomSpeed = 0.2;
                this.orbit.minDistance = 0.05;
        }
}