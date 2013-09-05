var stories = new function(){

	this.frameRate = 30.0;
	this.rotationRate = 4;
	this.frame = 0;
	
	//var StoryTeller = new ActiveXObject('StoryControl.StoryControl');

	this.onload = function () {
		StoryTeller.URL = 'tcp://192.168.137.176:8080/StoryTeller';
	}


	this.loadScene = function(chapter, page) {
		//StoryTeller.Chapter = chapter;
		//StoryTeller.Page = page;
		StoryTeller.ChapterAndPageNames(chapter,page);
	}


	this.pause = function() {
		StoryTeller.Pause();
	}


	this.play = function() {
		StoryTeller.FrameRate = 30.0
		StoryTeller.Play();
	}


	this.rotate = function() {
		StoryTeller.RotationRate = this.rotationRate;
		StoryTeller.Rotating = true;
	}

	this.stopRotation = function() {
		StoryTeller.Rotating = false
	}


	this.flip = function() {
		if ((a = StoryTeller.flippoles) == true)
			StoryTeller.FlipPoles = false
		else
			StoryTeller.FlipPoles = true
	}


	this.priorPage = function() {
		StoryTeller.PreviousPage()
	}

	this.nextPage = function() {
		StoryTeller.NextPage()
	}
	
	this.nextFrame = function(){
		this.frame = StoryTeller.Frame
		StoryTeller.frame = ++this.frame;
	}
	
	this.prevFrame = function(){
		this.frame = StoryTeller.Frame
		StoryTeller.frame = --this.frame;
	}
	
	this.currentFrame =function(){
		return this.frame = StoryTeller.Frame;
	}
	
	this.setFrame = function(frm){
		StoryTeller.Frame = frm;
	}
	
	this.setRotationAngle = function(ang){
		StoryTeller.RotationAngle = ang;
	}
	
	this.currentAngle = function(){
		return StoryTeller.RotationAngle;
	}
	
	this.lastFrame = function(){
		StoryTeller.LastFrame();
	}
	
	this.firstFrame = function(){
		StoryTeller.FirstFrame();
	}
	
	this.onload();
}

function playButton (el){
	var playImg = "img/PlayBTN.png";
	var pauseImg = "img/PauseBTN.png";
	
	var imgEl = el;
	var self = this;
	this.on = false;
	el.src = playImg;
	this.onFxn = null;
	this.offFxn = null;
	
	this.turnOn = function(){
		self.on = true;
		el.src = pauseImg;
		if(self.onFxn) self.onFxn();
	}
	
	this.turnOff = function(){
		self.on = false;
		el.src = playImg;
		if(self.offFxn) self.offFxn();
	}
	
	el.onmousedown = function(){
		var ret = false; 
		if(self.on) self.turnOff();
		else self.turnOn();
	}
}

var rotation = new function (){
	var self = this;
	
	this.button = new playButton($("rotBtn"));
	this.slider = new smmSlider($("rotSlider"));
	
	self.slider.addChangeCallback(function(sldr){
		stories.setRotationAngle(Math.round(180-360*sldr.getPercent()));
		self.button.turnOff();
	});
	
	self.button.onFxn = stories.rotate;
	self.button.offFxn = stories.stopRotation;
	
	
	this.update = function(){
		if(self.button.on) self.slider.setPercent(-(stories.currentAngle()-180)/360.);
	}
	
	this.reset = function(){
		self.button.turnOff();
		self.slider.setPercent(0);
	}
	
	this.start = function(){
		self.button.turnOn();
	}
	
	setInterval(self.update,100);
}

var animation = new function(){
	var self = this;
	
	this.maxFrames= 100;
	
	this.button = new playButton($("animBtn"));
	this.slider = new smmSlider($("animSlider"));
	
	self.slider.addChangeCallback(function(sldr){
		stories.setFrame(Math.round(self.maxFrames*sldr.getPercent()));
		self.button.turnOff();
	});
	
	self.button.onFxn = stories.play;
	self.button.offFxn = stories.pause;
	
	
	this.update = function(){
		if(self.button.on) self.slider.setPercent(stories.currentFrame()/self.maxFrames);
	}
	
	this.frameCB = function(){
		self.maxFrames = stories.currentFrame();
		stories.firstFrame();
		stories.play();
		
		console.log("Last frame is "+self.maxFrames);
	}
	
	this.recalcMaxFrames = function(){
		stories.pause();
		stories.lastFrame();
		setTimeout(self.frameCB,500);
	}
	
	this.reset = function(){
		self.button.turnOff();
		self.slider.setPercent(0);
	}
	
	//this.recalcMaxFrames();
	
	this.reload = function(){
		self.recalcMaxFrames();
	}
	
	this.start = function(){
		self.button.turnOn();
	}
	
	//stories.pause();
	
	setInterval(self.update,100);
}

var controller = new function(){
	
}