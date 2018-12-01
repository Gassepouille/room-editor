export default class Player {
        constructor(domElement) {
                this._container = domElement;
                // Renderer
                this._renderer = new THREE.WebGLRenderer({
                        antialias: true,
                        alpha: true,
                });
                this.rendererDomElement = this._renderer.domElement;
                this._container.appendChild(this._renderer.domElement);
                // Camera + scene
                this._camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
                this._camera.position.set(3, 3, 3);
                this._camera.lookAt(new THREE.Vector3(0, 0, 0));
                this.scene = new THREE.Scene();
                
                this.onPreRenderFcts = [];
                this.onPostRenderFcts = [];

                // render scene
                this._updateLoop = null;
                this._lastTimeMsec = 0;

                // resize
                this._onWindowResize();
                window.addEventListener('resize', () => {
                        this._onWindowResize();
                }, false)
        }
        get camera(){
                return this._camera;
        }
        start() {
                let _this = this;
                this._updateLoop = requestAnimationFrame(function animate(nowMsec){
                        _this._updateLoop = requestAnimationFrame(animate);
                        let myDelta = _this._getDelta(nowMsec);
                        _this._update(myDelta / 1000, nowMsec / 1000);
                })
        }
        stop() {
                cancelRequestAnimFrame(this._updateLoop);
                this._updateLoop = null;
        }
        _update(delta, now){
                this.onPreRenderFcts.forEach((onPreRenderFct)=>{
                        onPreRenderFct(delta, now);
                })
                
                this._renderer.render(this.scene, this._camera);

                this.onPostRenderFcts.forEach((onPostRenderFct)=>{
                        onPostRenderFct(delta, now);
                })
        }
        _getDelta(nowMsec) {
                // get time of the last call
                this._lastTimeMsec = this._lastTimeMsec || nowMsec - 1000 / 60;
                // get delta between now and last call
                let deltaMsec = Math.min(200, nowMsec - this._lastTimeMsec);
                // set last time as now
                this._lastTimeMsec = nowMsec;

                return deltaMsec;
        }
        _onWindowResize() {
                let width = window.innerWidth;
                let height = window.innerHeight;
                this._camera.aspect = width / height;
                this._camera.updateProjectionMatrix();
                this._renderer.setSize(width, height);
        }


}