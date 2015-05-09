var App={
	startTaskGenerator:function(){
		setInterval(function(){
			App.generateTask();
		}, 3000);
	},
	generateTask:function(){
		var t={};
		// this.component.
	},
	init:function(){
		this.component=React.createElement(AppComponent, this);
		React.render(this.component, document.body);
	}
};