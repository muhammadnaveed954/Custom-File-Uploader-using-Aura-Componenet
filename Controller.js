({
    init: function(component, event, helper) {
        helper.getStatusHandler(component, event, helper)
        helper.getStatusPickListValue(component, event, helper)
        helper.getReasonPickListValue(component, event, helper)
    },
    
    cancelHandler: function(component, event, helper) {
        helper.cancelHandlerHelper(component, event, helper)
    },

    revisedDueDateHandler: function(component, event, helper) {
        helper.revisedDueDateHandlerHelper(component, event, helper)
    },
  
    contractorCommentHandler: function(component, event, helper) {
        helper.contractorCommentHandlerHelper(component, event, helper)
    },

    statusHandler:function(component, event, helper) {
        let selectedOptionValue = event.getParam("value");
        helper.getReasonPickListValue(component, event, helper)
        component.set("v.status", selectedOptionValue)
    },

    reasonHandler:function(component, event, helper) {
        helper.reasonHandlerHelper(component, event, helper)
    },

    handleFileUpload : function( component, event, helper ) {
        let selectedFiles = component.find("fileId").get("v.files");
        component.set("v.uploadedFileNames",selectedFiles);
        component.set("v.uploadedFiles",selectedFiles);

    },

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

    },


    updateStatusHandler: function (component, event, helper) {
            let selectedFiles = component.get("v.uploadedFiles")
            helper.saveStatusHandler(component, event, helper)
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
        // }

    },
    
})
