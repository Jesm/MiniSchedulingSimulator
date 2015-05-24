var App={

	intervalRef:null,
	changedIntervalDuration:false,

	cfg:{
		quantumTimeInterval:.2,

		jobMaxQuantumTime:6,
		maxJobsPerMinute:120,
	},

	JobGenerator:{

		numberOfCreatedJobs:0,
		lastJobCreatedTime:+new Date(),
		probabilityIOBound:.33, // Multiply by 100 to get the percentage

		execute:function(){
			var jobCreationAvg=60000/App.cfg.maxJobsPerMinute, now=+new Date();
			if(now-this.lastJobCreatedTime>jobCreationAvg){
				this.createJob();
				this.lastJobCreatedTime=now;
			}
		},

		createJob:function(){
			var job={
				progress:0,
				gotIOInteration:false,
				bg:[],
				id:(++this.numberOfCreatedJobs)
			};

			for(var len=3;len--;)
				job.bg.push(Math.floor(96*Math.random()));

			if(Math.random()<=this.probabilityIOBound){
				job.type='io-bound';
				job.duration=1;
			}
			else{
				job.type='cpu-bound';
				job.duration=Math.floor(Math.random()*App.cfg.jobMaxQuantumTime)+1;
			}

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
			if(this.currentJob.type=='io-bound'&&!this.currentJob.gotIOInteration){
				App.WaitingJobQueue.add(this.currentJob);
				this.currentJob=null;
				return;
			}

			this.currentJob.progress++;

			if(this.currentJob.progress==this.currentJob.duration){
				// Deve fazer algo com o job antes de remove-lo?
				this.currentJob=null;
			}
		}


	},

	WaitingJobQueue:{

		minWaitingQuantumTime:3,
		maxWaitingQuantumTime:6,

		queue:[],

		currWaitingQuantumTime:0,
		currWaitingQuantumTimeExecuted:0,

		add:function(t){
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

				var job=this.queue.shift();
				job.gotIOInteration=true;
				App.ReadyJobQueue.add(job);
			}
		}

	},

	startExecutionInterval:function(){
		this.intervalRef=setInterval(function(){
			App.execute();
		}, this.cfg.quantumTimeInterval*1000);
	},

	execute:function(){
		this.JobGenerator.execute();
		this.Cpu.execute();
		this.WaitingJobQueue.execute();

		React.render(this.component, document.body);

		if(this.changedIntervalDuration){
			this.changedIntervalDuration=false;
			clearInterval(this.intervalRef);
			this.startExecutionInterval();
		}
	},

	init:function(){
		this.component=React.createElement(AppComponent, {
			App:this
		});

		this.startExecutionInterval();
	}

};