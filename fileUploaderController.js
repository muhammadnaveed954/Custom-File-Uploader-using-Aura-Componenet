({
 
    handleFileUpload : function( component, event, helper ) {
        let selectedFiles = component.find("fileId").get("v.files");
        component.set("v.uploadedFileNames",selectedFiles);
        component.set("v.uploadedFiles",selectedFiles);

    },

    // TO Remove File Uploaded file on click via UI before sending it to the backend by clicking on the cross icon.
    // I used two different methods to remove the file, from UI and from the list to send it to the Record via Apex, because of Objecct difficulty. 
    
 removeFileHandler: function (component, event, helper) {
        let fileToRemove = event.currentTarget.getAttribute("data-index");
        let uploadedFiles = component.get("v.uploadedFiles");

        // Remove file from the list to upload it to the backend

        let updatedFile = {};
        for (let key in uploadedFiles) {
            if (key !== fileToRemove.toString()) {
                updatedFile[key] = uploadedFiles[key];
            }
            
        }
        component.set("v.uploadedFiles", updatedFile);

        // Remove file from the list to show the name on the UI

        let uploadedFileNames = component.get("v.uploadedFileNames");

        if (typeof uploadedFileNames === 'object' && !Array.isArray(uploadedFileNames)) {
            let updatedFileNames = Object.entries(uploadedFileNames);
            for(let i = 0; i < updatedFileNames.length; i++){
                var arr = updatedFileNames[i];
                arr.splice(0,1);
                updatedFileNames[i] = arr;
            }
            updatedFileNames.splice(parseInt(fileToRemove),1);
            if(updatedFileNames.length == 1){
                component.set("v.uploadedFileNames", updatedFileNames[0]);
            } else {
                component.set("v.uploadedFileNames", updatedFileNames);
            }
          }
          else{
            console.log("updatedFileNames1", uploadedFileNames)
            uploadedFileNames.splice(parseInt(fileToRemove),1);
            if(uploadedFileNames.length == 1){
                component.set("v.uploadedFileNames", uploadedFileNames[0]);
            } else {
                component.set("v.uploadedFileNames", uploadedFileNames);
            }
          }
    },

 // Convert the file to the string using base64. You can upload the One or more files at Once

    updateStatusHandler: function (component, event, helper) {
        let selectedFiles = component.get("v.uploadedFiles")
        for (let i = 0; i < selectedFiles.length; i++) {
            let selectedFile = selectedFiles[i];
            let objFileReader = new FileReader();
            objFileReader.onload = $A.getCallback(function () {
                let fileContent = objFileReader.result;
                let base64 = 'base64,';
                let dataStart = fileContent.indexOf(base64) + base64.length;
                fileContent = fileContent.substring(dataStart);
                helper.processFileUpload(component, fileContent, selectedFile);
            });
            objFileReader.readAsDataURL(selectedFile);
        }
    },
    
})
