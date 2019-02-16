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
	setActiveTool(toolName){
		let _tool = this.data.tools.find((tool) => tool.name === toolName);
		
		if(!_tool)return;
		if (this.data.activeTool === _tool.name) return;
		
		if (_tool.noState === true) {
			if (_tool.activate) _tool.activate();
			return;
		}
		// deactivate all the other tools
		this.data.tools.forEach(singleTool => {
			if (singleTool.deactivate) singleTool.deactivate();
		});

		if (_tool.activate) _tool.activate();
		this.data.activeTool = _tool.name;
	}
	get methods (){
		let _this = this;
		return {
			clickTool(tool) {
				_this.setActiveTool(tool.name);
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