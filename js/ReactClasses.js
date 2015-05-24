var AppComponent=React.createClass({

	// getInitialState: function() {
	// 	return {};
	// },

	render:function(){

		return React.createElement('main', null, [
			React.createElement('h1', null, 'Mini Scheduling Simulator'),
			React.createElement('div', {className:'column left'}, [
				React.createElement(TaskGeneratorComponent),
				React.createElement(TaskQueueComponent, {
					ReadyJobQueue:this.props.App.ReadyJobQueue
				})
			]),
			React.createElement('div', {className:'column right'}, [
				React.createElement(CpuComponent, {
					Cpu:this.props.App.Cpu
				}),
				React.createElement(IOQueueComponent, {
					WaitingJobQueue:this.props.App.WaitingJobQueue
				})
			])
		]);

	}
});

var TaskGeneratorComponent=React.createClass({

	render:function(){
		return React.createElement('div', {id:'task_generator', className:'block1'});
	}
});

var TaskQueueComponent=React.createClass({

	render:function(){
		return React.createElement('div', {id:'task_queue', className:'block1'}, [
			TaskListFactory({
				tasks:this.props.ReadyJobQueue.queue
			})
		]);
	}
});

var CpuComponent=React.createClass({

	render:function(){
		var tasks=[];
		if(this.props.Cpu.currentJob)
			tasks.push(this.props.Cpu.currentJob);
		
		return React.createElement('div', {id:'cpu', className:'block2'}, [
			TaskListFactory({
				tasks:tasks
			})
		]);
	}
});

var IOQueueComponent=React.createClass({

	render:function(){
		return React.createElement('div', {id:'io_queue', className:'block1'}, [
			TaskListFactory({
				tasks:this.props.WaitingJobQueue.queue
			})
		]);
	}
});

var TaskList=React.createClass({

	render:function(){
		var list=[];
		for(var tasks=this.props.tasks, x=0;x<tasks.length;x++)
			list.push(React.createElement('li', {
				style:{
					background:'rgb('+tasks[x].bg.join(',')+')'
				}
			}));

		return React.createElement('ul', {className:'task_list'}, list);
	}
});

var TaskListFactory=React.createFactory(TaskList);