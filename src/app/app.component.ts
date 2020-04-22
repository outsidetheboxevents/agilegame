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
	  explanation: "Teams using feature branches aren't not really using continuous integration. It optimizes for the individual while harming the team. Capacity increased by 1 for the next 2 rounds.",
	  cost: 1,
	  duration: 2,
	  effect: function(self){
		  for(var i=self.currentRound; i<(self.currentRound+2); i++){
			 self.addToCapacity(self, i, 1);
			 
		  }
	  }
    }
  ];


  upcoming_actions = [
   {
      name: 'Social Time',
      description: 'Promote some social time e.g. common coffee breaks, team lunches.',
	  explanation: 'Building trust requires relationships to go beyond the work you do. Taking time to socialize helps the team. Capacity increased by 1 for the rest of the game.',
	  cost: 1,
	  duration: this.maxRounds,
	  effect: function(self){
		  for(var i=self.currentRound; i<self.maxRounds; i++){
			 self.addToCapacity(self, i, 1);
			
		  }  
		    
	  }
    },
	{
      name: 'Firefighter Award',
      description: 'Offer an award to anyone who solves a really hard and pressing issue.',
	  explanation: 'Promoting a firefighting culture promotes individual behaviour and, surprisingly, the starting of fires. Capacity reduced by 1 for the rest of the game.',
	  cost: 1,
	  duration: this.maxRounds,
	  effect: function(self){
		  for(var i=self.currentRound; i<self.maxRounds; i++){
			 self.addToCapacity(self, i, -1);
			
		  }  
		    
	  }
    },
	{
      name: 'Unit Testing',
      description: 'Introduce Unit Testing. Warning: have a build server first, or this will do nothing!',
	  explanation: 'Unit tests save time down the road by preventing rework, but it takes time to see the result.  Wait another round, then capacity increased by 1 for the rest of the game.',
	  cost: 1,
	  duration: this.maxRounds,
	  effect: function(self){
		  if (self.ongoing_actions.filter(function(e) { return e.name === 'Build Server'; }).length > 0
				|| (self.selected_actions.filter(function(e) { return e.name === 'Build Server'; }).length > 0)) {
			  for(var i=self.currentRound+1; i<self.maxRounds; i++){
				 self.addToCapacity(self, i, 1);
				
			  }  
			  this.duration = self.maxRounds;
			  this.repeatable = false;
			  this.explanation = 'Unit tests save time down the road by preventing rework, but it takes time to see the result.  Wait another round, then capacity increased by 1 for the rest of the game.'
		    
		   }
		   else{
			   this.duration = 0;
			   this.repeatable = true;
			   this.explanation = 'Without a Build Server, Unit Tests cannot be used to their full potenial. Trying creting a Build Server and trying this card again.'
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
  
  
  getAvailableCapacity(roundNumber){
	  if (!this.availableCapacity[roundNumber]){
		  this.availableCapacity[roundNumber] = 10;
	  }
	  return this.availableCapacity[roundNumber];
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
	  this.fillAvailableActions();
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
  
 fillAvailableActions(){
		while (this.available_actions.length < 5 && this.upcoming_actions.length > 0){
			
			this.available_actions.push(this.upcoming_actions.pop());
		}
}	
  
  hideRound(){
	  var available_zone = document.getElementById("available_zone");
	  var selected_zone = document.getElementById("selected_zone");
	  var ongoing_zone = document.getElementById("ongoing_zone");
	  var round_zone = document.getElementById("round_zone");
	  var complete_button = document.getElementById("completebutton");
	  var round_number = document.getElementById("roundNumber");
	  
	  available_zone.className += " w3-hide";
	  selected_zone.className += " w3-hide";
	  ongoing_zone.className += " w3-hide";
	  complete_button.className += " w3-hide";
	  round_number.className += " w3-hide";
	  round_zone.className += " w3-show";
	  
  }
  
   startRound(){
	  var available_zone = document.getElementById("available_zone");
	  var selected_zone = document.getElementById("selected_zone");
	  var ongoing_zone = document.getElementById("ongoing_zone");
	  var round_zone = document.getElementById("round_zone");
	  var complete_button = document.getElementById("completebutton");
	  var round_number = document.getElementById("roundNumber");
	  
	  available_zone.className  = available_zone.className.replace(" w3-hide", "");
	  selected_zone.className  = selected_zone.className.replace(" w3-hide", "");
	  ongoing_zone.className  = ongoing_zone.className.replace(" w3-hide", "");
	  complete_button.className  = complete_button.className.replace(" w3-hide", "");
	  round_number.className  = round_number.className.replace(" w3-hide", "");
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
