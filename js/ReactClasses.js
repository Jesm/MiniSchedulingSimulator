var AppComponent=React.createClass({

	// getInitialState: function() {
	// 	return {};
	// },

	render:function(){

		return React.createElement('main', null, [
			React.createElement('h1', null, 'Mini Scheduling Simulator'),
			React.createElement('div', {className:'column left'}, [
				React.createElement(TaskGeneratorComponent),
				React.createElement(TaskQueueComponent)
			]),
			React.createElement('div', {className:'column right'}, [
				React.createElement(CpuComponent),
				React.createElement(IOQueueComponent)
			])
		]);

	}
});

var TaskGeneratorComponent=React.createClass({

	render:function(){
		return React.createElement('div', {id:'task_generator', className:'block1'})
	}
});

var TaskQueueComponent=React.createClass({

	render:function(){
		return React.createElement('div', {id:'task_queue', className:'block1'})
	}
});

var CpuComponent=React.createClass({

	render:function(){
		return React.createElement('div', {id:'cpu', className:'block2'})
	}
});

var IOQueueComponent=React.createClass({

	render:function(){
		return React.createElement('div', {id:'io_queue', className:'block1'})
	}
});