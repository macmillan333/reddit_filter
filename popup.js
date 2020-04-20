chrome.storage.sync.get("remove_count", function(items) {
    document.getElementById("count").innerText = items["remove_count"].toString();
})