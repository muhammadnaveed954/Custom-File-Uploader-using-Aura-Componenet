({  
    
    cancelHandlerHelper: function(component, event, helper) {
        component.set("v.isStatusMOdelOpen", false)
   },

    getStatusHandler: function(component, event, helper) {
        var action = component.get("c.getCasesList");
        action.setParams({ Id: component.get("v.recordId") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue()[0];
                component.set("v.Id", result.Id);
                component.set("v.status", result.Status);
                component.set("v.dueDate",result.cfsuite1__Due_Date__c )
                // component.set("v.statusReasonValue", result.Contractor_Reason__c);
                // component.set("v.revisedDueDate", result.Contractor_Revised_Due_Date__c);
            } else {
                console.error(response.getError());
            }
        });
        $A.enqueueAction(action);
    } ,

    getStatusPickListValue: function(component, showChangeStatusButton) {
        var action = component.get("c.getCaseStatusValuesContractorStatus");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                let statusValues = response.getReturnValue();
                let statusOptions = [];
                let showChangeStatusButton = component.get('v.showChangeStatusButton');
                for (var i = 0; i < statusValues.length; i++) {
                    if (statusValues[i] == 'Job Complete' && showChangeStatusButton ) {
                        statusOptions.push({ 'label': statusValues[i], 'value': statusValues[i] });
                    } else if(!showChangeStatusButton ) {
                        statusOptions.push({ 'label': statusValues[i], 'value': statusValues[i] });
                    }
                }
                component.set("v.statusOptions", statusOptions);
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors && errors[0] && errors[0].message) {
                    console.error("Error: " + errors[0].message);
                }
            }
        });
        $A.enqueueAction(action);
    },

    getReasonPickListValue: function(component, event, helper) {
        var action = component.get("c.getCaseStatusValuesContractorReason");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                let statusValues = response.getReturnValue();
                let statusOptions = [];
                let status = component.get("v.status");
                let filterdOptions =[]
                for (var i = 0; i < statusValues.length; i++) {
                    statusOptions.push({ 'label': statusValues[i], 'value': statusValues[i] });
                }
                if (status == "On Hold") {
                    filterdOptions = statusOptions.filter(item => item.value !== "Work Complete");
                } else if (status == "Job Complete") {
                    filterdOptions = statusOptions.filter(item => item.value === "Work Complete");
                } else {
                    filterdOptions = statusOptions;
                }
                component.set("v.statusReasonOptions", filterdOptions);
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors && errors[0] && errors[0].message) {
                    console.error("Error: " + errors[0].message);
                }
            }
        });
        $A.enqueueAction(action);
    },

    contractorCommentHandlerHelper: function(component, event, helper){
        let contractorCommentValue = event.getSource().get("v.value");
        component.set("v.contractorComment", contractorCommentValue)
    },

    reasonHandlerHelper: function(component, event, helper){
        component.set("v.showStatusReasonError", false)
    }, 

    saveStatusHandler: function(component, event, helper) {
            let newReason = component.get("v.statusReasonValue");  
            let statusValue = component.get("v.status"); 
            let dueDate = component.get("v.dueDate")
            let newRevisedDate = component.get("v.revisedDueDate"); 
            if (statusValue == 'On Hold'){
                if(!newReason && !newRevisedDate){
                    component.set("v.showrevisedDueDateError", true)
                    component.set("v.showStatusReasonError", true)
                } 
                else if (!newReason){
                    component.set("v.showStatusReasonError", true)
                }
                else if (!newRevisedDate){
                    component.set("v.showrevisedDueDateError", true)
                }
                else if (newRevisedDate && newRevisedDate < dueDate){
                    component.set("v.showDueDateError", true)
                }
                else {
                    helper.updateStatusHandlerHelper(component, event, helper);
                }
            }
            else if (statusValue == 'Job Complete'){
                if (!newReason){
                    component.set("v.showStatusReasonError", true)
                } else {
                    helper.updateStatusHandlerHelper(component, event, helper);

                }
            }
                else{
                    helper.updateStatusHandlerHelper(component, event, helper);
                }
            // }
            // let selectedFiles = component.get("v.uploadedFiles")
            // // alert("1")
            // else if (selectedFiles.length > 3) {
            //     alert("4")
            //     component.set("v.fileLimitError", true)
            //     // console.log("You can select upto three files only");
            // }
        //    else {
        //       helper.updateStatusHandlerHelper(component, event, helper);
        //    }
        
    },

    revisedDueDateHandlerHelper: function (component, event, helper) {
        component.set("v.showrevisedDueDateError", false)
        let revisedDueDate = component.get("v.revisedDueDate");
        component.set("v.revisedDueDate", revisedDueDate);
    },

    processFileUpload : function( component, fileContent, selectedFile ) {
        console.log(
            'Encoded value is',
            encodeURIComponent( fileContent )
        );
        let caseId = component.get("v.Id")
        let action = component.get( "c.uploadFile" );
        action.setParams( {
            filename: selectedFile.name,
            base64Content: encodeURIComponent( fileContent ),
            caseId: caseId
            // '500Bn000008zkm6IAA'
        } );
        action.setCallback( this, function( response ) {
            let state = response.getState();
            if ( state === "SUCCESS" ) {
                component.set(
                    "v.fileName", "File Successfully Uploaded"
                );
            } else {
                component.set( "v.fileName","File Upload Failed. Please try again."); 
            }
            
		} );
        $A.enqueueAction( action );
        
    },

    updateStatusHandlerHelper: function(component, event, helper) {
        component.set("v.Id", component.get("v.recordId"));
        component.set("v.showSpinner", true)
        let newCaseID = component.get("v.Id")
        let newStatusValue = component.get("v.status")
        let newReasonValue = component.get("v.statusReasonValue")
        let revisedDueDate = component.get("v.revisedDueDate")
        let commentValue = component.get("v.contractorComment")

        var action = component.get("c.updateCaseStatus");
        action.setParams({
            caseIds: newCaseID,
            newStatus: newStatusValue,
            newStatusReasonValue: newReasonValue,
            newRevisedDueDate:revisedDueDate,
            newContractorComment: commentValue
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {  
                helper.processFileUpload(component, event, helper)
                component.set("v.showSpinner", false)
                // helper.getStatusHandler(component, event, helper)
                // helper.getReasonPickListValue(component, event, helper)
                var toastConfig = {
                    variant: "success",
                    message: "Status changed successfully."
                };
                helper.handleShowToast(component, event, helper, toastConfig);
                helper.cancelHandlerHelper(component, event, helper);
                helper.handleShowNotice(component, event, helper);

            } else if (state === "ERROR") {
                var errors = response.getError();
                console.log(errors);
            }
        });
        $A.enqueueAction(action);
    },

    handleShowToast : function(component, event, helper, toastConfig) {
        component.find('notifLib').showToast(toastConfig);
    },
  
   
})
