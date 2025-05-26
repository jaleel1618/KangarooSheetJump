
//var cache = CacheService.getDocumentCache();
var properties = PropertiesService.getScriptProperties();
var kangarodata;
mergeCacheChunksToKangaro();


function KangaroJump(e) {
  var template = HtmlService.createTemplateFromFile('kangarojump');
  template.sheetsnamedata = kangarodata;

  var html = template.evaluate()
    .setWidth(220)
    .setHeight(160);

  SpreadsheetApp.getUi().showModalDialog(html, 'Kangaroo Jump');
}


function onOpen(e) {
  
}


function Jumpsheet(sheet) {
    var spreadsheet = SpreadsheetApp.getActive();
    console.log(spreadsheet);
    spreadsheet.setActiveSheet(spreadsheet.getSheetByName(sheet), true);
    console.log('jumped');
    return true; 
    
}


function resyncsheetnames() {
  console.log('resync started');
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  var sheetNames = sheets.map(sheet => sheet.getName());
  splitStringToCacheChunks(JSON.stringify(sheetNames));
  mergeCacheChunksToKangaro();
  return JSON.parse(kangarodata);
}

function getsheetsnames() {
  console.log('started getting sheet names from properies chunks');
    if (!kangarodata) {
    console.log('kanagaroo data empty will repopulate using resychsheet');
    resyncsheetnames();
  }
  console.log("pulling data from gs to js");
   return JSON.parse(kangarodata);
}

function splitStringToCacheChunks(value, maxChunkLength = 245) {
  if (!value || value.length === 0) {
    return;
  }

  const chunks = [];
  let start = 0;
  while (start < value.length) {
    const end = Math.min(start + maxChunkLength, value.length);
    const chunk = value.substring(start, end);
    chunks.push(chunk);
    start = end;
  }

  for (let i = 0; i < chunks.length && i < 6; i++) {
    const cacheKey = `kangarocachechunk${i + 1}`;
    properties.setProperty(cacheKey, chunks[i]); 
    //cache.put(cacheKey, chunks[i]);
  }
}

function mergeCacheChunksToKangaro() {
  console.log('merg Cache Chunks To Kangaro');
  const chunks = [];
  for (let i = 1; i <= 6; i++) {
    const cacheKey = `kangarocachechunk${i}`;
    //const chunk = cache.get(cacheKey);
    const chunk = properties.getProperty(cacheKey);
    if (chunk) {
      chunks.push(chunk);
    }
  }

  if (chunks.length === 0) {
    console.log("No cachechunk variables found.");
    return;
  }

  kangarodata = chunks.join("");
  
}
