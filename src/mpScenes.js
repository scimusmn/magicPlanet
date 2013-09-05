function scene(fldr,number,prnt){
	var folder = fldr+number;
	
	var parent = prnt;
	
	var btnSrc = folder+"/"+pad(number,2)+".png";
	var btnActvSrc = folder+"/"+pad(number,2)+"-ACTIVE.png";
	
	var self = this;
	this.dom = null;
	
	this.selected = false;
	
	this.button = document.createElement('img');
	this.button.src = btnSrc;
	this.button.className = "scene-button";
	
	$('menuBar').appendChild(this.button);
	
	this.pages = [];
	this.pageNumber = 0;
	this.title = null;
	
	var stChapter = "", stPage = "";
	
	var btnMng = function(val,name){
		if(self.pageNumber+1==val) $(name).src = "img/"+name+"Btn.png";
		else $(name).src = "img/"+name+"Btn-ACTIVE.png";
	}
	
	var setPage = function(){
		$("page").innerHTML = '';
 		if(self.pages.length)
	 		$("page").appendChild(self.pages[self.pageNumber].cloneNode(true));
	 	
	 	if(self.pages.length>=2){ 
	 		$("pageControls").style.display = "table";
	 		$("pageNum").innerHTML = (self.pageNumber+1)+" of "+self.pages.length;
	 		
	 		btnMng(self.pages.length,"next");
			btnMng(1,"back");
	 	}
	 	else $("pageControls").style.display = "none";
	 	
	 	
	}
	
	var loadDescription = function(){
 		$("title").innerHTML = '';
 		$("title").appendChild(self.title.cloneNode(true));
 		
 		self.pageNumber = 0;
 		
 		setPage();
	}
	
	var loadInfo = function(){
		var el = self.dom.getElementById("info");
		
		$("infoSpace").innerHTML ='';
		if(el) $("infoSpace").appendChild(el.cloneNode(true));
		
		el = self.dom.getElementById("animTitle");
		if(el) $("animTitle").innerHTML = el.innerHTML;
		else $("animTitle").innerHTML = "Control the animation";
		
		el = self.dom.getElementById("sliderLabels");
		if(el) $("animLabels").innerHTML = el.innerHTML;
		else $("animLabels").innerHTML = '';
		
		el = self.dom.getElementById("anim");
		if(el) $("animControl").style.display = "inline";
		else $("animControl").style.display = "none";
	}
	
	this.nextPage = function(){
		if(self.pageNumber+1<self.pages.length){
			self.pageNumber++;
 			setPage();
		}
	}
	
	this.prevPage = function(){
		if(self.pageNumber+1>1){
			self.pageNumber--;
 			setPage();
		}
		
	}
	
	this.select = function(){
		self.selected=true;
		self.button.src = btnActvSrc;
		self.loadScene();
	}
	
	this.resetButton = function(){
		self.button.src = btnSrc;
		self.selected = false;
	}
	
	this.loadScene = function(){
		if(this.dom){
			loadDescription();
			loadInfo();
			stories.loadScene(stChapter,stPage);
			setTimeout(animation.reload,500);
			rotation.start();
			animation.start();
		}
	}
	
	this.domLoadCB = function(DOM){
		self.dom = DOM;
		
		self.pages.length = 0;
		
		var els = self.dom.getElementsByClassName("description-para");
		for(var i=0; i<els.length; i++){
			self.pages[i] = els[i];
		}
		
		els.length = 0;
		els = self.dom.getElementsByClassName("description-title");
		if(els.length) self.title = els[0];

		if(self.selected){
			self.loadScene();
		}
		
		stChapter = self.dom.getElementsByTagName("body")[0].getAttribute("chapter");
		stPage = self.dom.getElementsByTagName("body")[0].getAttribute("page");
	}
	
	self.button.onmousedown = function(){
		parent.reset();
		self.select();
	}
	
	htmlFile(folder+"/index.html",self.domLoadCB.bind(self));
	
}

var mpScenes = new function(){
	var scenes = [];
	
	var self = this;
	
	for(var i=0; i<8; i++){
	
		scenes[i] = new scene("scenes/scene",(i+1),this);
	}
	
	scenes[0].select();
	
	this.reset = function(){
		for(var i=0; i<8; i++){
			scenes[i].resetButton();
		}
		rotation.reset();
		animation.reset();
	}
	
	$("back").onmousedown = function(){
		for(var i=0; i<scenes.length; i++){
			if(scenes[i].selected) scenes[i].prevPage();
		}
	}
	
	$("next").onmousedown = function(){
		for(var i=0; i<scenes.length; i++){
			if(scenes[i].selected) scenes[i].nextPage();
		}
	}
	
	this.currentScene = function(){
		var ret =  null;
		for(var i=0; i<scenes.length; i++){
			if(scenes[i].selected) ret = scenes[i];
		}
		return ret;
	}
	
	this.nextScene = function(){
		var sel = 0;
		for(var i=0; i<scenes.length; i++){
			if(scenes[i].selected) sel=i;
		}
		if(++sel>=scenes.length) sel=0;
		self.reset();
		scenes[sel].select();
		
		console.log("The next scene is " + sel);
	}
	
	var sceneTimer = setInterval(self.nextScene,60000);
	
	this.resetTimer = function(){
		clearInterval(sceneTimer);
		sceneTimer = setInterval(self.nextScene,60000);
	}
}