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
  completedStories = [0];
  currentRound = 1;
  minRollStorySuccess = [3, 3];
  error = "none";
  rolledReport = [];

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
  
  round_results = [
  
  
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
		self.rolledReport = [...self.rolledReport];
	   
  }
  
  findConsumedCapacity(){
	  if (!this.availableCapacity[this.currentRound-1]){
		  this.availableCapacity[this.currentRound-1] = 10;
	  }
	  
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
	  this.round_results = [];
	  var committedStories = this.findConsumedCapacity();
	  this.processSelectedActions();
	  this.checkForCompletedStories(committedStories);
	  this.resetRound();
	  this.pushToDisplay(this);
	  this.hideRound();
	  
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
	   this.round_results.push(item);
      });
	  
  }
  
  checkForCompletedStories(committedStories){
	  this.error = "Processing this many stories" + committedStories;
	  this.completedStories[this.currentRound -1] = 0;
	  this.rolledReport[0] = "Rolling for " + committedStories + " stories";
	  this.rolledReport[1]	= "Success on " +  this.minRollStorySuccess[this.currentRound -1] + "+";
	  this.rolledReport[2] = "Rolled: ";
	  for(var i=0; i < committedStories; i++){
			 var dieRoll = (Math.floor(Math.random() * 6) + 1 );
			 this.rolledReport[2] =  this.rolledReport[2] + " "+ dieRoll;
			 if (dieRoll >= this.minRollStorySuccess[this.currentRound -1]){
				 this.completedStories[this.currentRound -1] = this.completedStories[this.currentRound -1]+1;

			 }
			 
		  }
	  this.rolledReport[3]	="Successes: " + this.completedStories[this.currentRound -1];
	  this.round_results.push({name:"Completed Stories", report: this.rolledReport});
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
  
  hideRound(){
	  var available_zone = document.getElementById("available_zone");
	  var selected_zone = document.getElementById("selected_zone");
	  var ongoing_zone = document.getElementById("ongoing_zone");
	  var round_zone = document.getElementById("round_zone");
	  var complete_button = document.getElementById("completebutton");
	  
	  available_zone.className += " w3-hide";
	  selected_zone.className += " w3-hide";
	  ongoing_zone.className += " w3-hide";
	  complete_button.className += " w3-hide";
	  round_zone.className += " w3-show";
	  
  }
  
   startRound(){
	  var available_zone = document.getElementById("available_zone");
	  var selected_zone = document.getElementById("selected_zone");
	  var ongoing_zone = document.getElementById("ongoing_zone");
	  var round_zone = document.getElementById("round_zone");
	  var complete_button = document.getElementById("completebutton");
	  
	  available_zone.className  = available_zone.className.replace(" w3-hide", "");
	  selected_zone.className  = selected_zone.className.replace(" w3-hide", "");
	  ongoing_zone.className  = ongoing_zone.className.replace(" w3-hide", "");
	  complete_button.className  = complete_button.className.replace(" w3-hide", "");
	  round_zone.className  = round_zone.className.replace(" w3-show", "");
	  
  }
  
  seeRules(id, buttonid) {
	  var x = document.getElementById(id);
	  var button = document.getElementById(buttonid);
	  if (x.className.indexOf("w3-show") == -1) {
		x.className += " w3-show";
		button.innerHTML = 'Hide Rules';
	  } else { 
		x.className = x.className.replace(" w3-show", "");
		button.innerHTML = 'Show Rules';
	  }
	  
	}
  
  sumArray(array){
	  var total = 0;
	  for (var i=0; i<array.length; i++){
		  total = total + array[i];
	  }
	  return total;
  }
  
}
