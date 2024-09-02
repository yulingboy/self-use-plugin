import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons"
import { uuid } from "@newtab/utils/common"
import { convertImageToBase64 } from "@newtab/utils/img"
import { fetchWebsiteInfo } from "@newtab/utils/website"
import { Dropdown, message, Modal } from "antd"
import React, { useEffect, useState } from "react"

import SiteModal from "./SiteModal"

interface SiteInfo {
  id: string
  url: string
  title: string
  iconBase64: string
}
interface Values {
  id: string
  url: string
  favicon: string
  description: string
  title: string
  autoGetIcon: boolean
}
const NavList: React.FC = () => {
  const [siteList, setSiteList] = useState<SiteInfo[]>([])
  const [messageApi, contextHolder] = message.useMessage()
  const [editingSite, setEditingSite] = useState<SiteInfo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFormLoading, setIsFormLoading] = useState(false)

  useEffect(() => {
    initializeSites()
  }, [])

  // 初始化站点数据
  const initializeSites = async () => {
    const cachedSites = getCachedSites()
    if (cachedSites) {
      setSiteList(cachedSites)
    } else {
      await loadTopSites()
    }
  }

  const getCachedSites = (): SiteInfo[] | null => {
    const cachedData = localStorage.getItem("siteList")
    return cachedData ? JSON.parse(cachedData) : null
  }

  const cacheSites = (sites: SiteInfo[]) => {
    localStorage.setItem("siteList", JSON.stringify(sites))
  }

  const loadTopSites = async () => {
    if (!chrome?.topSites?.get) return messageApi.warning("chrome.topSites API 不可用")

    messageApi.loading("正在加载站点数据，请稍候...")
    try {
      const topSites = await chrome.topSites.get()
      const sitesWithIcons = await enrichSitesWithIcons(topSites)
      setSiteList(sitesWithIcons)
      cacheSites(sitesWithIcons)
    } catch (error) {
      messageApi.error("获取站点数据失败，请稍后再试。")
    }
  }

  const enrichSitesWithIcons = async (topSites: chrome.topSites.MostVisitedURL[]) => {
    return Promise.all(
      topSites.map(async (site) => {
        const { favicon } = await fetchWebsiteInfo(site.url)
        const iconBase64 = favicon ? await convertImageToBase64(favicon) : ""
        return {
          id: uuid(),
          url: site.url,
          title: site.title,
          iconBase64
        }
      })
    )
  }

  const handleNavigateToSite = (site: SiteInfo) => {
    window.open(site.url)
  }

  const handleAddSite = () => {
    setEditingSite(null)
    setIsModalOpen(true)
  }

  const handleEditSite = (site: SiteInfo) => {
    setEditingSite(site)
    setIsModalOpen(true)
  }

  const handleDeleteSite = (site: SiteInfo) => {
    Modal.confirm({
      title: "提示",
      icon: <ExclamationCircleFilled />,
      content: "是否确认删除该链接，一旦删除，不可恢复",
      okText: "确认",
      cancelText: "取消",
      onOk() {
        const updatedSiteList = siteList.filter((s) => s.id !== site.id)
        setSiteList(updatedSiteList)
        cacheSites(updatedSiteList)
        messageApi.success("站点已删除")
      }
    })
  }

  const handleFormSubmit = async (values: Values) => {
    setIsFormLoading(true)
    try {
      let updatedSiteList: SiteInfo[]

      if (editingSite) {
        updatedSiteList = siteList.map((site) => (site.url === editingSite.url ? { ...site, ...values, iconBase64: site.iconBase64 } : site))
        messageApi.success("站点编辑成功")
      } else {
        const iconBase64 = values.autoGetIcon && values.favicon ? await convertImageToBase64(values.favicon) : ""
        updatedSiteList = [...siteList, { ...values, iconBase64, id: uuid() }]
        messageApi.success("站点添加成功")
      }

      setSiteList(updatedSiteList)
      cacheSites(updatedSiteList)
      setIsModalOpen(false)
    } catch (error) {
      messageApi.error("操作失败，请稍后再试。")
    } finally {
      setIsFormLoading(false)
    }
  }

  return (
    <div className="grid auto-rows-auto grid-cols-8 gap-8">
      {contextHolder}
      {siteList.map((site) => (
        <Dropdown
          key={site.id}
          menu={{
            items: [
              { label: "编辑", icon: <EditOutlined />, key: "edit", onClick: () => handleEditSite(site) },
              { label: "删除", icon: <DeleteOutlined />, key: "delete", onClick: () => handleDeleteSite(site) }
            ]
          }}
          trigger={["contextMenu"]}>
          <div className="relative size-16 cursor-pointer" onClick={() => handleNavigateToSite(site)}>
            <div className="flex size-16 items-center justify-center overflow-hidden rounded-2xl bg-white">
              {site.iconBase64 ? <img src={site.iconBase64} alt={site.title} className="max-h-16 max-w-16" /> : <div>图标</div>}
            </div>
            <div className="absolute -bottom-6 left-1/2 w-full -translate-x-1/2 truncate text-center text-white">{site.title}</div>
          </div>
        </Dropdown>
      ))}
      <div className="relative size-16 cursor-pointer" onClick={handleAddSite}>
        <div className="flex size-16 items-center justify-center overflow-hidden rounded-2xl bg-white">
          <PlusOutlined className="text-xl" />
        </div>
      </div>
      <SiteModal visible={isModalOpen} site={editingSite} onClose={() => setIsModalOpen(false)} onSubmit={handleFormSubmit} loading={isFormLoading} />
    </div>
  )
}

export default NavList
