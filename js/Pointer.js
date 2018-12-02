export default class Pointer {
        constructor(domElement) {
                this._onPick = null;
                this._doubleClick = false;
                this._timeoutID = null;
                this._onDownPosition = new THREE.Vector2();
                this._onUpPosition = new THREE.Vector2();

                this._scene = null;
                this._camera = null;
                this._domElement = domElement;
                this._clickableElements = [];

                // Copy of mouseup because the binding return a new different function each time called
                // therefore removeeventlistener won't work
                this._onPointerUpCopy = this._onPointerUp.bind(this);
                this._domElement.addEventListener('mousedown', this._onPointerDown.bind(this), false);
        }
        set scene(scene){
                this._scene = scene;
        }
        set camera(camera){
                this._camera = camera;
        }
        set onPick(callback) {
                this._onPick = callback;
        }
        _onPointerDown(event) {
                event.preventDefault();
                this._onDownPosition = this._getPointerPosition(event);
                this._domElement.addEventListener('mouseup', this._onPointerUpCopy, false);
        }
        _onPointerUp(event) {
                // Check double click
                let doubleClicked = false;
                if (this._doubleClick === true) doubleClicked = true;

                // Position
                this._onUpPosition = this._getPointerPosition(event);
                // Check if the mouse moved, if it did, return
                if (this._onDownPosition.distanceTo(this._onUpPosition) === 0) {
                        this._clickableElements = [];
                        this._scene.traverseVisible((object3d) => {
                                if (object3d.userData.selectable === false) return;
                                this._clickableElements.push(object3d)
                        });

                        let objectActive = this._pickScene(event);
                        if (this._onPick) this._onPick(objectActive, doubleClicked);
                }
                this._domElement.removeEventListener('mouseup', this._onPointerUpCopy, false);

                this._doubleClick = true;
                if (this._timeoutID) clearTimeout(this._timeoutID);
                this._timeoutID = setTimeout(() => {
                        this._doubleClick = false;
                }, 300)
        }
        _getPointerPosition(pointerEvent) {
                let pointer = new THREE.Vector2();
                let boundingRectangle = this._domElement.getBoundingClientRect();
                pointer.x = ((pointerEvent.clientX - boundingRectangle.left) / boundingRectangle.width) * 2 - 1;
                pointer.y = - ((pointerEvent.clientY - boundingRectangle.top) / boundingRectangle.height) * 2 + 1;
                return pointer;
        }
        _pickScene(pointerEvent) {
                let raycaster = new THREE.Raycaster();
                let pointer = this._getPointerPosition(pointerEvent);

                raycaster.setFromCamera(pointer, this._camera);
                let intersects = raycaster.intersectObjects(this._clickableElements);
                if (intersects.length > 0) return intersects[0];
                return false;
        }
}