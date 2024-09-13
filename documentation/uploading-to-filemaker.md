# Uploading to FileMaker Pro
[widget.json](../widget.json) is by default configured to run a script named "UploadHTML" on the
currently selected FileMaker file. The [demo file](../Demo.fmp12) includes an example on how this script can be set up.

Essentially, to make the HTML-file easy to access from FileMaker, it should be written to a text field in a record.
Ideally, each module should have its own name, to prevent confusion, while also granting functionality to store
multiple types of modules in the same FileMaker table.

### Script parameters sent during upload:
- `name: string` - The name of the web component
- `filePath` - The location of the HTML-file (parsed using node.js `path`)