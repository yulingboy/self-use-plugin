chrome.topSites.get(function (sites) {
  console.log(sites) // 打印出用户的常用网站列表
  sites.forEach(function (site) {
    console.log(site.url) // 打印每个网站的 URL
  })
})
