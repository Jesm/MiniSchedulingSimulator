var App={

	intervalRef:null,

	cfg:{
		quantumTimeInterval:.8,
		changedIntervalDuration:false,

		taskMaxQuantumTime:5,
		maxTasksPerMinute:35,

		probabilityIOBound:.33 // Multiply by 100 to get the percentage
	},

	TaskGenerator:{

		numberOfCreatedTasks:0,
		lastTaskCreatedTime:+new Date(),

		currentTask:null,

		execute:function(){
			var taskCreationAvg=60000/App.cfg.maxTasksPerMinute, now=+new Date();
			if(now-this.lastTaskCreatedTime>taskCreationAvg){
				this.createTask();
				this.lastTaskCreatedTime=now;
			}
		},

		createTask:function(){
			var task={
				state:'created',
				progress:0,
				gotIOInteration:false,
				bg:[],
				id:(++this.numberOfCreatedTasks)
			};

			for(var len=3;len--;)
				task.bg.push(Math.floor(96*Math.random()));

			if(Math.random()<=App.cfg.probabilityIOBound){
				task.type='io-bound';
				task.duration=2;
			}
			else{
				task.type='cpu-bound';
				task.duration=Math.floor(Math.random()*App.cfg.taskMaxQuantumTime)+1;
			}

			if(this.currentTask)
				App.ReadyTaskQueue.add(this.currentTask);
			this.currentTask=task;
		}

	},

	ReadyTaskQueue:{

		queue:[],

		add:function(t){
			t.state='ready';
			this.queue.push(t);
		},

		getTask:function(){
			return this.queue.length?this.queue.shift():null;
		}

	},

	Cpu:{

		currentTask:null,

		execute:function(){
			if(this.currentTask)
				this.processCurrentTask();
			if(!this.currentTask&&(this.currentTask=App.ReadyTaskQueue.getTask()))
				this.currentTask.state='executing';
		},

		processCurrentTask:function(){
			if(this.currentTask.type=='io-bound'&&!this.currentTask.gotIOInteration){
				App.WaitingTaskQueue.add(this.currentTask);
				this.currentTask=null;
				return;
			}

			this.currentTask.progress++;

			if(this.currentTask.progress==this.currentTask.duration)
				this.currentTask.state='closed';
			else
				App.ReadyTaskQueue.add(this.currentTask);

			this.currentTask=null;
		}


	},

	WaitingTaskQueue:{

		minWaitingQuantumTime:3,
		maxWaitingQuantumTime:6,

		queue:[],

		currWaitingQuantumTime:0,
		currWaitingQuantumTimeExecuted:0,

		add:function(t){
			t.state='waiting';
			this.queue.push(t);
		},

		execute:function(){
			if(!this.queue.length)
				return;

			if(!this.currWaitingQuantumTimeExecuted){
				var r=(this.maxWaitingQuantumTime-this.minWaitingQuantumTime)*Math.random();
				this.currWaitingQuantumTime=Math.floor(r)+this.minWaitingQuantumTime;
			}

			this.currWaitingQuantumTimeExecuted++;

			if(this.currWaitingQuantumTimeExecuted==this.currWaitingQuantumTime){
				this.currWaitingQuantumTimeExecuted=0;

				var task=this.queue.shift();
				task.gotIOInteration=true;
				App.ReadyTaskQueue.add(task);
			}
		}

	},

	startExecutionInterval:function(){
		this.intervalRef=setInterval(function(){
			App.execute();
		}, this.cfg.quantumTimeInterval*1000);
	},

	execute:function(){
		this.WaitingTaskQueue.execute();
		this.Cpu.execute();
		this.TaskGenerator.execute();

		React.render(this.component, document.body);

		if(this.cfg.changedIntervalDuration){
			this.cfg.changedIntervalDuration=false;
			clearInterval(this.intervalRef);
			this.startExecutionInterval();
		}
	},

	sendEvent:function(name, value){

		switch(name){
			case 'quantum_duration':
				if(!isNaN(value)){
					this.cfg.quantumTimeInterval=+value;
					this.cfg.changedIntervalDuration=true;
				}
			break;
			case 'task_duration':
				if(!isNaN(value))
					this.cfg.taskMaxQuantumTime=+value;
			break;
			case 'num_tasks_minute':
				if(!isNaN(value))
					this.cfg.maxTasksPerMinute=+value;
			break;
			case 'probability_io_bound':
				if(!isNaN(value))
					this.cfg.probabilityIOBound=(+value)/100;
			break;
		}

	},

	init:function(){
		this.component=React.createElement(AppComponent, {
			App:this
		});

		this.execute();
		this.startExecutionInterval();
	}

};