 // Custom File Uploader Method
 // Please add this method in your class

    @AuraEnabled
    public static String uploadFile(String filename, String base64Content, String caseId) {
        // Create a new ContentVersion record for the file
        ContentVersion objContentVersion = new ContentVersion();
        base64Content = EncodingUtil.urlDecode(base64Content, 'UTF-8');
        objContentVersion.VersionData = EncodingUtil.base64Decode(base64Content);
        objContentVersion.Title = filename;
        objContentVersion.PathOnClient = filename;

        try {
            // Insert the ContentVersion record
            insert objContentVersion;

            // Create a new ContentDocumentLink record to associate the file with the case
            ContentDocumentLink objContentDocumentLink = new ContentDocumentLink();
            objContentDocumentLink.ContentDocumentId = [
                SELECT ContentDocumentId
                FROM ContentVersion
                WHERE Id = :objContentVersion.Id
            ].ContentDocumentId;
            objContentDocumentLink.LinkedEntityId = caseId; // Specify the Case Id here
            objContentDocumentLink.ShareType = 'V';

            // Insert the ContentDocumentLink record
            insert objContentDocumentLink;

            return 'File Uploaded Successfully';
        } catch (DMLException e) {
            System.debug('Error while uploading the file ' + e.getMessage());
            return e.getMessage();
        }
    }
