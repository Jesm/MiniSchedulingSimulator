var App={

	intervalRef:null,

	cfg:{
		quantumTimeInterval:.2,
		changedIntervalDuration:false,

		jobMaxQuantumTime:5,
	},

	JobGenerator:{

		createJobQuantumInterval:3,
		createJobCounter:0,

		execute:function(){
			if(!this.createJobCounter)
				this.createJob();
			this.createJobCounter=(this.createJobCounter+1)%this.createJobQuantumInterval;
		},

		createJob:function(){
			var job={
				progress:0,
				duration:Math.floor(Math.random()*App.cfg.jobMaxQuantumTime)+1
			};

			App.ReadyJobQueue.add(job);
		}

	},

	ReadyJobQueue:{

		queue:[],

		add:function(t){
			this.queue.push(t);
		},

		getJob:function(){
			return this.queue.length?this.queue.shift():null;
		}

	},

	Cpu:{

		currentJob:null,

		execute:function(){
			if(!this.currentJob)
				this.currentJob=App.ReadyJobQueue.getJob();
			if(this.currentJob)
				this.processCurrentJob();
		},

		processCurrentJob:function(){
			this.currentJob.progress++;

			if(this.currentJob.progress==this.currentJob.duration){
				// Deve fazer algo com o job antes de remove-lo?
				this.currentJob=null;
			}
		}


	},

	startExecutionInterval:function(){
		this.intervalRef=setInterval(function(){
			App.execute();
		}, this.cfg.quantumTimeInterval*1000);
	},

	execute:function(){
		console.log('Executando....');

		this.JobGenerator.execute();
		this.Cpu.execute();

		if(this.changedIntervalDuration){
			this.changedIntervalDuration=false;
			clearInterval(this.intervalRef);
			this.startExecutionInterval();
		}
	},

	init:function(){
		this.component=React.createElement(AppComponent, this);
		React.render(this.component, document.body);

		this.startExecutionInterval();
	}

};