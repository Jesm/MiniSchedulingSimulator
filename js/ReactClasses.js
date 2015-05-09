var AppComponent=React.createClass({

	// getInitialState: function() {
	// 	return {};
	// },

	render:function(){

		return React.createElement('main', null, [
			React.createElement('h1', null, 'Mini Scheduling Simulator'),
			React.createElement('div', {className:'column left'}, [
				// React.createElement(TaskGenerator),
				// React.createElement(TaskQueue)
			]),
			React.createElement('div', {className:'column right'})
		]);

	}

});

// var TaskGeneratorComponent=React.createClass({
	
// });

// var TaskQueueComponent=React.createClass({

// });

// var TaskQueueComponent=React.createClass({

// });

// var TaskComponent=React.createClass({

// });