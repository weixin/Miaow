var onRun = function(context){
	var sketch = context.api();
	var document = sketch.selectedDocument;
	var page = document.selectedPage;

	var pageDict = page.sketchObject.treeAsDictionary();
	var jsonData = NSJSONSerialization.dataWithJSONObject_options_error_(pageDict,0,nil);
	var jsonString = NSString.alloc().initWithData_encoding_(jsonData,NSUTF8StringEncoding);

	log(jsonString);
}
