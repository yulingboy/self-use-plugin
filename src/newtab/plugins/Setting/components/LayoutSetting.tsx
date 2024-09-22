import { updateSettingItem } from "@newtab/store/modules/setting"
import { useAppDispatch, useAppSelector } from "@newtab/store"
import { Form, Select, Switch } from "antd"
import React from "react"

const LayoutSetting: React.FC = () => {
  const dispatch = useAppDispatch()
  const { timeCalendar, search, navList, dock } = useAppSelector((state) => state.setting)

  // 处理开关更新
  const handleSwitchChange = (part, key, value: boolean) => {
    dispatch(updateSettingItem({ part, key, value }))
  }

  return (
    <div className="box-border size-full bg-white p-4 shadow">
      <Form autoComplete="off">
        {/* 布局类型选择 */}
        <Form.Item>
          <div className="flex justify-between">
            <span>布局类型</span>
            <Select
              defaultValue="jack"
              style={{ width: 120 }}
              options={[
                { value: "jack", label: "千山" },
                { value: "lucy", label: "万水" },
                { value: "Yiminghe", label: "火山" },
                { value: "disabled", label: "有道", disabled: true }
              ]}
            />
          </div>
        </Form.Item>

        {/* 动态生成的开关 */}
        {[
          { label: "显示时间", value: timeCalendar.show, part: "timeCalendar" },
          { label: "显示搜索框", value: search.show, part: "search" },
          { label: "显示导航", value: navList.show, part: "navList" },
          { label: "显示Dock", value: dock.show, part: "dock" }
        ].map(({ label, value, part }) => (
          <Form.Item key={part}>
            <div className="flex justify-between">
              <span>{label}</span>
              <Switch checked={value} onChange={(checked) => handleSwitchChange(part, "show", checked)} />
            </div>
          </Form.Item>
        ))}
      </Form>
    </div>
  )
}

export default LayoutSetting
