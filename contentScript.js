// background.js will handle this message.
// chrome.runtime.sendMessage({badgeText: "!"});

// Chrome guarantees DOM is complete when this script starts running.

// Small chance this will throw nullReference, because it runs at the same time
// Reddit is populating a post.
function HandleOnePost(div) {
    console.log("Title:");
    console.log(div.getElementsByClassName("_eYtD2XCVieq6emjKBH3m").item(0).textContent);
    console.log("Content (if any):");
    let allParagraphs = div.getElementsByClassName("_1qeIAgB0cPwnLhDF9XSiJM");
    for (let p = 0; p < allParagraphs.length; p++) {
        console.log(allParagraphs.item(p).textContent);
    }
    console.log("Poll options (if any):");
    let allOptions = div.getElementsByClassName("_3PfYu2DtunAwYpv53tmvOb");
    for (let o = 0; o < allOptions.length; o++) {
        console.log(allOptions.item(o).textContent);
    }
}

let allPosts = document.getElementsByClassName("rpBJOHq2PR60pnwJlUyP0").item(0);

// First, handle initial posts available right now.
for (let i = 0; i < allPosts.children.length; i++) {
    console.log("Post #" + i);
    HandleOnePost(allPosts.children.item(i));
}

// Then, observe any new posts being added and handle them by then.
let observer = new MutationObserver(function(mutationList, observer) {
    mutationList.forEach((mutation) => {
        if (mutation.type != 'childList') return;
        console.log("New post:");
        mutation.addedNodes.forEach((addedNode) => HandleOnePost(addedNode));
    });
});
observer.observe(allPosts, {
    childList: true,
    attributes: false,
    subtree: false
});