import {Component, ChangeDetectorRef} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	
  constructor(private cd: ChangeDetectorRef) {}
	 
	 
  title = 'High Performance Team Game';
  website = 'https://agilepainrelief.com';
  
  maxRounds = 20;
  availableCapacity = [10, 10];
  consumedCapacity = [10, 10];
  completedStories = [0, 0];
  currentRound = 1;
  minRollStorySuccess = [3, 3];
  error = "none";
  rolledReport = "No rolls yet";

  available_actions = [
    {
      name: 'Same Floor',
      description: 'Get all Team members on the same floor',
	  explanation: 'Even if you can’t create a team room, just getting people on the same floor reduces the cost of communication. Capacity increased by 1 for the next 5 rounds.',
	  cost: 3,
	  duration: 5,
	  effect: function(self){
		  for(var i=self.currentRound; i<(self.currentRound+5); i++){
			 self.addToCapacity(self, i, 1);
			
			 
		  }  
		    
	  }
    },
    {
      name: 'Protected from Distraction',
      description: 'ScrumMaster protects team from outside distractions',
	  explanation: 'Removing outside interuptions increases the liklihood that the team completes their committed stories. Stories complete this round on a roll of 2 or higher.',
	  cost: 1,
	  duration: 0,
	  repeatable: true,
	  effect: function(self){
		  self.minRollStorySuccess[self.currentRound-1] = 2;
		  self.error = "scrum master " + self.minRollStorySuccess[self.currentRound-1];
		  if (self.currentRound> 1 && self.minRollStorySuccess[self.currentRound - 2]  == 2){
			  this.duration = self.maxRounds;
			  for(var i=self.currentRound; i<self.maxRounds; i++){
					self.minRollStorySuccess[i] = 2;
			 
				}
		  }
	  }
    },
    {
      name: 'Build Server',
      description: 'Set up a build server and continuous integration',
	  explanation: 'A build server on its own provides no benefit. However, it is necessary to unlock other improvements surrounding CI/CD.',
	  cost: 3,
	  duration: this.maxRounds,
	  effect: function(self){
		  //No effect
	  }
    },
    {
      name: 'Working Agreements',
      description: 'Create team working agreements',
	  explanation: 'Having a team working agreedment can prevent conflict from slowing down development.  Capacity increased by 1 for the rest of the game.',
	  cost: 1,
	  duration: this.maxRounds,
	  effect: function(self){
		  for(var i=self.currentRound; i<self.maxRounds; i++){
			 self.addToCapacity(self, i, 1);
			 
		  }
	  }
    },
	{
      name: 'Eliminate Feature Branching',
      description: 'All work is done on Main or Trunk',
	  explanation: 'When teams useFeature Branches they’re notreally using continuous integration. Feature branching optimizes for the individual while harming the team. Capacity increased by 1 for the next 2 rounds.',
	  cost: 1,
	  duration: 2,
	  effect: function(self){
		  for(var i=self.currentRound; i<(self.currentRound+2); i++){
			 self.addToCapacity(self, i, 1);
			 
		  }
	  }
    }
  ];

  selected_actions = [
    
  ];
  
  ongoing_actions = [
    
  ];

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data,
        event.previousIndex,
        event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex, event.currentIndex);
    }
  }
  
  pushToDisplay(self){
	   self.availableCapacity =[...self.availableCapacity];
	   self.consumedCapacity=[...self.consumedCapacity];
	   self.minRollStorySuccess=[...self.minRollStorySuccess];
	   self.completedStories= [...self.completedStories];
		self.currentRound = self.currentRound + 0;
		self.rolledReport = self.rolledReport + "";
	   
  }
  
  findConsumedCapacity(){
	  this.consumedCapacity[this.currentRound-1] = this.availableCapacity[this.currentRound-1];
	  this.selected_actions.forEach(item => {
        this.consumedCapacity[this.currentRound-1] = this.consumedCapacity[this.currentRound-1] - item.cost;
      });
	  return this.consumedCapacity[this.currentRound-1];
  }
  
  addToCapacity(self, index, amount){
	 
		
	  if (!self.availableCapacity[index]){
		  self.availableCapacity[index] = 10;
	  }
	  self.availableCapacity[index] = self.availableCapacity[index] + amount;
  }
  
  endRound(){
	  
	  var committedStories = this.findConsumedCapacity();
	  this.processSelectedActions();
	  this.checkForCompletedStories(committedStories);
	  this.resetRound();
	  this.pushToDisplay(this);
	  
	  
  }
  
  processSelectedActions(){
	  this.selected_actions.forEach(item => {
		 
       if (item.effect != null){

			item.effect(this);
			this.ongoing_actions.push(item);
	   }
	   else{
			//don't do it
	   }
	   
      });
	  
  }
  
  checkForCompletedStories(committedStories){
	  this.error = "Processing this many stories" + committedStories;
	  this.completedStories[this.currentRound -1] = 0;
	  this.rolledReport = "Rolled for stories: #";
	  for(var i=0; i < committedStories; i++){
			 var dieRoll = (Math.floor(Math.random() * 6) + 1 );
			 this.rolledReport =  this.rolledReport + " "+ dieRoll;
			 if (dieRoll >= this.minRollStorySuccess[this.currentRound -1]){
				 this.completedStories[this.currentRound -1] = this.completedStories[this.currentRound -1]+1;

			 }
			 
		  }
	  this.rolledReport = this.rolledReport + ". Successes: " + this.completedStories[this.currentRound -1];
	  
  }
  
  
  
  resetRound(){
	  
	  this.selected_actions = [];
	  if (!this.minRollStorySuccess[this.currentRound]){
		  this.minRollStorySuccess[this.currentRound] = 3;
		  
	  }

	  
	  var new_ongoing_actions= [];
	  this.ongoing_actions.forEach(item => {
		  this.error = this.error + "duration is " + item.duration ;
         if (item.duration > 0){
			 new_ongoing_actions.push(item);
			 
		 }
		 else{
			 if (item.repeatable){
				this.available_actions.push(item);
			 }
		 }
      });
	  this.ongoing_actions = new_ongoing_actions;
	  this.ongoing_actions.forEach(item => {
         item.duration = item.duration -1;
      });
	  

	  this.currentRound = this.currentRound + 1;
	  if (this.currentRound > this.maxRounds){
			this.error = "GAME OVER";
	  }
	  
	  
	  
	  
  }
  
  
}
