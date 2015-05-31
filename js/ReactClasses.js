var AppComponent=React.createClass({

	render:function(){

		return React.createElement('main', null, [
			React.createElement('h1', null, 'Mini Scheduling Simulator'),
			React.createElement('div', {id:'top_message'}, 'Para uma melhor experiência, atualize seu navegador para a última versão disponível.'),
			React.createElement('div', {className:'column left'}, [
				React.createElement(TaskGeneratorComponent, {
					App:this.props.App
				}),
				React.createElement(TaskQueueComponent, {
					ReadyTaskQueue:this.props.App.ReadyTaskQueue
				}),
				React.createElement(TaskInfoComponent, {
					App:this.props.App
				})
			]),
			React.createElement('div', {className:'column right'}, [
				React.createElement(CpuComponent, {
					App:this.props.App,
					Cpu:this.props.App.Cpu
				}),
				React.createElement(IOQueueComponent, {
					WaitingTaskQueue:this.props.App.WaitingTaskQueue
				})
			])
		]);

	}
});

var TaskGeneratorComponent=React.createClass({

	render:function(){
		var arr=[];
		if(this.props.App.TaskGenerator.currentTask)
			arr.push(this.props.App.TaskGenerator.currentTask);

		return React.createElement('div', {id:'task_generator', className:'block1'}, [
			React.createElement('h2', null, 'Gerador de Processos'),

			LabeledInputFactory({
				label:'Duração máxima do processo (em quantums)',
				name:'task_duration',
				type:'number',
				value:this.props.App.cfg.taskMaxQuantumTime,
				min:1
			}),
			LabeledInputFactory({
				label:'Quantidade máxima de processos/minuto',
				name:'num_tasks_minute',
				type:'number',
				value:this.props.App.cfg.maxTasksPerMinute,
				min:1
			}),
			LabeledInputFactory({
				label:'Probabilidade de gerar processo I/O-bound (em %)',
				name:'probability_io_bound',
				type:'number',
				value:(this.props.App.cfg.probabilityIOBound*100).toFixed(0),
				min:0,
				max:100
			}),

			TaskListFactory({
				tasks:arr
			})
		]);
	}
});

var TaskQueueComponent=React.createClass({

	render:function(){
		return React.createElement('div', {id:'task_queue', className:'block1'}, [
			React.createElement('h2', null, 'Fila de Processos'),

			TaskListFactory({
				tasks:this.props.ReadyTaskQueue.queue
			})
		]);
	}
});

var CpuComponent=React.createClass({

	render:function(){
		var tasks=[];
		if(this.props.Cpu.currentTask)
			tasks.push(this.props.Cpu.currentTask);
		
		return React.createElement('div', {id:'cpu', className:'block1 block2'}, [	
			React.createElement('h2', null, 'Cpu'),

			LabeledInputFactory({
				label:'Duração do quantum (em segundos)',
				name:'quantum_duration',
				type:'number',
				value:this.props.App.cfg.quantumTimeInterval,
				min:0,
				step:.1
			}),
			TaskListFactory({
				tasks:tasks
			})
		]);
	}
});

var IOQueueComponent=React.createClass({

	render:function(){
		return React.createElement('div', {id:'io_queue', className:'block1'}, [
			React.createElement('h2', null, 'Fila de Espera E/S'),

			TaskListFactory({
				tasks:this.props.WaitingTaskQueue.queue
			})
		]);
	}
});

var TaskList=React.createClass({

	render:function(){
		var list=[];
		for(var tasks=this.props.tasks, x=0;x<tasks.length;x++){
			var task=tasks[x];

			list.push(React.createElement('li', {
				style:{
					background:'rgb('+task.bg.join(',')+')'
				}
			}, '#'+task.id));
		}

		return React.createElement('ul', {className:'task_list'}, list);
	}
});

var LabeledInput=React.createClass({

	getInitialState:function(){
		return {
			value:this.props.value
		}
	},

	handleChange:function(ev){
		var v=ev.target.value;
		App.sendEvent(this.props.name, v);
		this.setState({
			value:v
		});
	},

	render:function(){
		var inputProps={
			value:this.state.value,
			onChange:this.handleChange
		};
		for(var strs=['type', 'min', 'max', 'name', 'step'], len=strs.length;len--;){
			var str=strs[len];
			if(this.props[str]!=null)
				inputProps[str]=this.props[str];
		}

		return React.createElement('label', null, [
			React.createElement('span', null, this.props.label),
			React.createElement('input', inputProps),
		]);
	}
});

var TaskInfoComponent=React.createClass({

	statesLabels:{
		created:'Novo',
		ready:'Pronto',
		executing:'Em execução',
		waiting:'Em espera',
		closed:'Finalizado'
	},

	render:function(){
		var content=[
			React.createElement('h2', null, 'Informações do Processo')
		];
		if(this.props.App.selectedTask){
			var task=this.props.App.selectedTask;
			content=content.concat([
				React.createElement('h3', null, 'Processo #'+task.id),
				React.createElement('p', null, [
					'Estado: ',
					React.createElement('strong', null, this.statesLabels[task.state])
				]),
			]);
		}
		else
			content.push(React.createElement('p', null, 'Nenhum processo selecionado!'));

		return React.createElement('div', {id:'task_info', className:'block1'}, content);
	}
});

var TaskListFactory=React.createFactory(TaskList);
var LabeledInputFactory=React.createFactory(LabeledInput);