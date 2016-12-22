function request(queryURL) {
	var request = NSMutableURLRequest.new();
	[request setHTTPMethod:@"GET"];
	[request setURL:[NSURL URLWithString:queryURL]];
	var error = NSError.new();
	var responseCode = null;
	var oResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:responseCode error:error];
	return oResponseData;
}