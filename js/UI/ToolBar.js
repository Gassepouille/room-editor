export default class ToolBar {
        constructor() {
		// use Object.assign if inherited class
                this.data = {
			tools :[],
			display:true,
		}
		
                let _this = this;
                Vue.component('toolbar', {
                        template: _this._template,
                        data() { return _this.data; },
                        methods: {
                                clickScansAction(item) {
                                        if (_this.data.listScansAction) _this.data.listScansAction(item);
                                        _this.data.displayScansMenu = false;
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
                                <div class="toolbar-tool" v-for="tool in tools">

                                </div>
			</div>
		`
        }
}