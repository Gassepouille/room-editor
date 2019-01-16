export default class ToolBar {
	constructor() {
		// use Object.assign if inherited class
		this.data = {
			tools: [],
			display: true,
			activeTool: "camera",
		}
	}
	addTool(tool) {
		this.data.tools.push(tool);
	}
	get methods (){
		let _this = this;
		return {
			clickTool(tool) {
				if (_this.data.activeTool === tool.name) return;
				// deactivate all the other tools
				_this.data.tools.forEach(singleTool => {
					if (singleTool.deactivate) singleTool.deactivate();
				});

				if (tool.activate) tool.activate();
				_this.data.activeTool = tool.name;
			}
		}
	}
	get _template() {
		return `
			<div class="toolbar" v-if="display">
                                <div class="toolbar-tool" v-for="tool in tools" >
                                        <div v-bind:class="[activeTool === tool.name ? 'active' : '', 'tool-icon']" v-bind:tooltip="tool.name" @click="clickTool(tool)">
                                                <img v-if="tool.icon" v-bind:src="tool.icon">
                                        </div>
                                </div>
			</div>
		`
	}
}