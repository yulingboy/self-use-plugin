chrome.runtime.onInstalled.addListener(() => {
  // 定义菜单项及其功能
  const menuList = [
    {
      id: "1",
      title: "七月上",
      children: [
        { id: "1-1", title: "加入稍后阅读", parentId: "1", onClick: handleAddToReadLater },
        { id: "1-2", title: "下载为PDF", parentId: "1", onClick: handleDownloadAsPDF },
        { id: "1-3", title: "下载为Markdown", parentId: "1", onClick: handleDownloadAsMarkdown },
        { id: "1-4", title: "复制为Markdown", parentId: "1", onClick: handleCopyAsMarkdown }
      ]
    }
  ]

  // 创建菜单项并绑定点击事件
  function createMenu(menu) {
    chrome.contextMenus.create({
      id: menu.id,
      title: menu.title,
      contexts: menu.contexts || ["all"], // 默认所有上下文都可见
      parentId: menu.parentId || undefined
    })

    // 绑定点击事件
    if (menu.onClick) {
      chrome.contextMenus.onClicked.addListener((info, tab) => {
        if (info.menuItemId === menu.id) {
          menu.onClick(info, tab)
        }
      })
    }

    // 递归创建子菜单
    if (Array.isArray(menu.children)) {
      menu.children.forEach(createMenu)
    }
  }

  // 执行菜单创建
  menuList.forEach(createMenu)
})

// 加入稍后阅读功能
function handleAddToReadLater(info, tab) {
  console.log(info, tab) 
  chrome.tabs.sendMessage(tab.id, { action: "addToReadLater" }, (response) => {
    
    console.log("加入稍后阅读功能:", response)
  })
}

// 下载为PDF功能
function handleDownloadAsPDF(info, tab) {
  console.log(info, tab) 
  chrome.tabs.sendMessage(tab.id, { action: "downloadAsPDF" }, (response) => {
    console.log("下载PDF中:", response)
  })
}

// 下载为Markdown功能
function handleDownloadAsMarkdown(info, tab) {
  console.log(info, tab) 
  chrome.tabs.sendMessage(tab.id, { action: "downloadAsMarkdown" }, (response) => {
    console.log("下载Markdown中:", response)
  })
}

// 复制为Markdown功能
function handleCopyAsMarkdown(info, tab) {
  console.log(info, tab) 
  chrome.tabs.sendMessage(tab.id, { action: "copyAsMarkdown" }, (response) => {
    console.log("复制Markdown:", response)
  })
}
