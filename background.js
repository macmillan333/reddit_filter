// Fired when this extension is installed or updated. Or when Chrome is updated.
chrome.runtime.onInstalled.addListener(function() {
    // Write default options, if not present.
    chrome.storage.sync.get(null, function(items){
        if (items["keywords"] == undefined) {
            chrome.storage.sync.set({keywords: []});
        }
        if (items["case_sensitive"] == undefined) {
            chrome.storage.sync.set({case_sensitive: false});
        }
        if (items["hide_growing"] == undefined) {
            chrome.storage.sync.set({hide_growing: true});
        }
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.remove_count != undefined) {
        let badgeText = request.remove_count.toString();
        if (request.remove_count > 999) badgeText = "999+";
        chrome.browserAction.setBadgeText({text: badgeText});
        if (badgeText == "0") {
            chrome.browserAction.setBadgeBackgroundColor({color: "#00F"});
        } else {
            chrome.browserAction.setBadgeBackgroundColor({color: "#F00"});
        }
    }
});