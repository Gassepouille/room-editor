export default class ToolBar {
        constructor() {
		// use Object.assign if inherited class
                this.data = {
			tools :[],
                        display:true,
                        activeTool:"wall",
		}
		
                let _this = this;
                Vue.component('toolbar', {
                        template: _this._template,
                        data() { return _this.data; },
                        methods: {
                                clickTool(tool) {
                                        if (_this.data.activeTool === tool.name) return;
                                        tool.callback();
                                        _this.data.activeTool = tool.name;
                                }
                        }
                })
        }
        addTool(tool){
                this.data.tools.push(tool);
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