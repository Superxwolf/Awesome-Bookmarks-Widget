var info = {
  poke: 3,
  width: 2,
  height: 2,
  path: "bookmarks.html",
  "v2": {
    "resize": true,
    "min_height": 1,
    "max_height": 3,
    "min_width": 1,
    "max_width": 3
  },
  "v3": {
    "multi_placement": true
  }
};

chrome.extension.onMessageExternal.addListener(function (request, sender, sendResponse) {
  if ( request === "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-poke" ) {
    chrome.extension.sendMessage(
    sender.id, {
      head: "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-pokeback",
      body: info,
    });
  }
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if ( request.type === "bookmarkTree" ) {
    chrome.bookmarks.getTree(sendResponse);
  }

  if ( request.type === "manageBookmarks" ) {
    chrome.tabs.update(sender.tab.id, {
      url: "chrome://bookmarks/#" + request.id,
    });
  }

  if ( request.type === "setBookmarkSelection") {
    localStorage['selectionId'] = request.id;
    localStorage['isSelectedFolder'] = request.isSelectedFolder;
  }

  return true;
});

function onContextClicked(info, tab)
{ 
  if(info.menuItemId === "BookmarkContextDelete") {
    deleteBookmark(localStorage['selectionId'], localStorage['isSelectedFolder']);
  }

  chrome.tabs.sendMessage(tab.id, {type: "RefreshBookmarks"});
}

function deleteBookmark(id, isSelectedFolder)
{
  if(isSelectedFolder) {
      chrome.bookmarks.removeTree(id);
    }
    else {
      chrome.bookmarks.remove(id);
    }
}

function createContextMenu()
{
  //Get the current extension id
  var extensionId = chrome.i18n.getMessage("@@extension_id");

  ///////////////////////////       Delete
  contextMenu = {
    id: "BookmarkContextDelete",
    title: "Delete",
    contexts: ["link"],
    
    //Makes the context menu appear only on right click within a frame using this extension
    documentUrlPatterns: ["chrome-extension://" + extensionId + "/*"] 
  };
  chrome.contextMenus.create(contextMenu);

}

function onTabHighlighted(info)
{
  function onTabGet(tab)
  {
    if(tab.status === "complete" && tab.url === "chrome://newtab/")
    {
      chrome.tabs.sendMessage(tab.id, {type: "RefreshBookmarks"});
    }
  }
  chrome.tabs.get(info.tabIds[0], onTabGet);
}

createContextMenu();
chrome.tabs.onHighlighted.addListener(onTabHighlighted);