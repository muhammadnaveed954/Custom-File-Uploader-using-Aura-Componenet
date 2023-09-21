({  

   // Method to upload the file to the Record Via Apex Method
	
    processFileUpload : function( component, fileContent, selectedFile ) {
        console.log('Encoded value', encodeURIComponent( fileContent ));
        let caseId = component.get("v.Id")
        let action = component.get( "c.uploadFile" );
        action.setParams({
            filename: selectedFile.name,
            base64Content: encodeURIComponent( fileContent ),
            caseId: caseId
        });
        action.setCallback( this, function( response ) {
            let state = response.getState();
            if ( state === "SUCCESS" ) {
		 console.log("File Successfully Uploaded");
            } else {
		 console.log("File upload Failed");
            }
	});
        $A.enqueueAction( action );   
    },
   
})
