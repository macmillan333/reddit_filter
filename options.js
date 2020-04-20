let keywords = document.getElementsByTagName("textarea")[0];
let caseSensitive = document.getElementById("case_sensitive");
let hideGrowing = document.getElementById("hide_growing");
let status = document.getElementById("status");

// Loading: read entire storage
chrome.storage.sync.get(null, function(items){
    if (items["keywords"] != undefined) {
        keywords.value = ArrayToMultilineString(items["keywords"]);
    }
    if (items["case_sensitive"] != undefined) {
        caseSensitive.checked = items["case_sensitive"];
    }
    if (items["hide_growing"] != undefined) {
        hideGrowing.checked = items["hide_growing"];
    }
});

// Saving
document.getElementsByTagName("button")[0].addEventListener("click", function(event){
    chrome.storage.sync.set({
        keywords: MultilineStringToArray(keywords.value),
        case_sensitive: caseSensitive.checked,
        hide_growing: hideGrowing.checked
    }, function() {
        status.innerText = "Saved. Refresh Reddit tabs for new options to take effect.";
    });
});
