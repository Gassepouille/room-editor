export default class ToolSuper {
	constructor() {
		this._active = false;
	}
	activate() {
		this._active = true;
	}
	deactivate() {
		this._active = false;
	}
}