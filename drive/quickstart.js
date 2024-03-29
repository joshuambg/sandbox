// Copyright 2018 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START main_body]
const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const fs = require('fs')

/**
 * Lists the names and IDs of up to 10 files.
 */
async function runSample() {
  // Obtain user credentials to use for the request
  /* CANNOT REBUILD THIS FROM JSON UNLESS USE require("google-auth-library") 
     METHODS IN @google-cloud/local-auth */
  // mime type https://en.wikipedia.org/wiki/Matroska
  // ls -l
  // curl --upload-file ./Bombshell_2019.mp4 -XPOST --progress-bar -o 'upload.txt' -H 'Transfer-Encoding: chunked' -H 'Content-Type: video/mp4' -H 'Authorization: Bearer token' 'https://www.googleapis.com/upload/drive/v3/files?uploadType=media'
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, './oauth2.keys.json'),
    scopes: 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file',
  });

  fs.writeFileSync('oauth2.token.json', JSON.stringify(auth))

  google.options({auth});

  const service = google.drive('v3');
  const res = await service.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  });
  const files = res.data.files;
  if (files.length === 0) {
    console.log('No files found.');
  } else {
    console.log('Files:');
    for (const file of files) {
      console.log(`${file.name} (${file.id})`);
    }
  }
}
if (module === require.main) {
  runSample().catch(console.error);
}
// [END main_body]
module.exports = runSample;
