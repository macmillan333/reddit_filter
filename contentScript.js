// Chrome guarantees DOM is complete when this script starts running.

let count = 0;
function BroadcastCount() {
    chrome.runtime.sendMessage({badgeText: count.toString()});  // Handled by background.js
}
BroadcastCount();

// Small chance this can't read post contents due to it running at the same time
// Reddit is populating a post.
function HandleOnePost(div) {
    // Collect all text from this post.
    let text = [];

    // Title. For crossposts there are 2 titles.
    let allTitles = div.getElementsByClassName("_eYtD2XCVieq6emjKBH3m");
    for (let t = 0; t < allTitles.length; t++) {
        text.push(allTitles.item(t).textContent);
    }
    if (allTitles.length == 0) {
        console.log("ERROR: Reddit Filter doesn't see any title in this post.");
    }
    // Content, if any.
    let allParagraphs = div.getElementsByClassName("_1qeIAgB0cPwnLhDF9XSiJM");
    for (let p = 0; p < allParagraphs.length; p++) {
        text.push(allParagraphs.item(p).textContent);
    }
    // Poll options, if any.
    let allOptions = div.getElementsByClassName("_3PfYu2DtunAwYpv53tmvOb");
    for (let o = 0; o < allOptions.length; o++) {
        text.push(allOptions.item(o).textContent);
    }
    let fullText = text.join();
    if (!caseSensitive) fullText = fullText.toLowerCase();

    // Does the full text contain any keyword?
    let hasKeyword = false;
    for (let k = 0; k < keywords.length; k++) {
        let keyword = keywords[k];
        if (!caseSensitive) keyword = keyword.toLowerCase();
        if (fullText.includes(keyword)) {
            hasKeyword = true;
            console.log("Found keyword: " + keywords[k]);
            break;
        }
    }
    if (!hasKeyword) {
        return;
    }

    // Remove post and increment counter.
    console.log("Removed post: " + fullText);
    HideElement(div);
    count++;
    BroadcastCount();
}

let keywords = [];
let caseSensitive = false;

// Retrieve options before doing anything.
chrome.storage.sync.get(null, function(items) {
    keywords = items["keywords"];
    caseSensitive = items["case_sensitive"];

    // Hide Top Growing Communities if asked to.
    let hideGrowing = items["hide_growing"];
    if (hideGrowing) {
        HideElement(document.getElementsByClassName("_1G4yU68P50vRZ4USXfaceV _2QeqBqfT5UbHBoViZUt-wX")[0]);
    }

    let allPosts = document.getElementsByClassName("rpBJOHq2PR60pnwJlUyP0").item(0);
    // Handle initial posts available right now.
    for (let i = 0; i < allPosts.children.length; i++) {
        HandleOnePost(allPosts.children.item(i));
    }
    
    // Observe new posts when they are added.
    let observer = new MutationObserver(function(mutationList, observer) {
        mutationList.forEach((mutation) => {
            if (mutation.type != 'childList') return;
            mutation.addedNodes.forEach((addedNode) => HandleOnePost(addedNode));
        });
    });
    observer.observe(allPosts, {
        childList: true,
        attributes: false,
        subtree: false
    });
})
