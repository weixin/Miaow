@import "common.js"

var onRun = function(context) {
    var selection = context.selection;
    var length = selection.length;
    var order = {};

   	for(var i = 0;i<length;i++){
   		var x = selection[i].absoluteRect().x();
   		var y = selection[i].absoluteRect().y();
   		var width = selection[i].rect().size.width;
   		var height = selection[i].rect().size.height;
   		var name = selection[i].name();

   		var obj = order[width + '_' + height];
   		if(!obj){
   			order[width + '_' + height] = [];
   			obj = order[width + '_' + height];
   		}

   		var object = {};
   		object.x = x;
   		object.y = y;
   		object.width = width;
   		object.height = height;
   		object.name = obj.length == 0 ? selection[i].name() : obj[0].name;
   		object.selection = selection[i];
		obj.push(object);
   	}
   	for(var i in order){
   		order[i].sort(function(a,b){
   			return a.x-b.x;
   		})
   		order[i].sort(function(a,b){
   			return a.y-b.y;
   		})
   	}
   	
   	log(order);
};