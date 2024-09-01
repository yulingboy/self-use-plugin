import { getLunarDate, getSolarTerms } from "chinese-days"
import dayjs from "dayjs"
import React, { useEffect, useState } from "react"
import { SolarDay } from "tyme4ts"

// TimeCalendar 组件
const TimeCalendar: React.FC = () => {
  // 定义当前时间的状态
  const [currentTime, setCurrentTime] = useState(dayjs())

  // 每分钟更新一次时间
  useEffect(() => {
    const updateTime = () => setCurrentTime(dayjs())
    const intervalId = setInterval(updateTime, 60 * 1000) // 每 60 秒更新一次
    updateTime() // 页面加载时立即更新时间
    return () => clearInterval(intervalId) // 清理定时器
  }, [])

  // 提取当前时间的小时、分钟、日期信息
  const currentHour = currentTime.format("HH")
  const currentMinute = currentTime.format("mm")
  const currentDate = currentTime.format("YYYY/MM/DD")

  // 将星期几转换为中文表示
  const getChineseWeekday = (day: number): string => {
    const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
    return weekdays[day]
  }
  const currentWeekday = getChineseWeekday(currentTime.day())

  // 获取农历信息和节日
  const solarDay = SolarDay.fromYmd(currentTime.year(), currentTime.month() + 1, currentTime.date())
  const lunarDay = solarDay.getLunarDay()

  // 农历节日和公历节日
  const lunarFestival = lunarDay.getFestival()?.getName() || ""
  const solarFestival = solarDay.getFestival()?.getName() || ""

  // 获取二十四节气信息
  const solarTerms = getSolarTerms(currentDate) || []
  const currentSolarTerm = solarTerms.length > 0 ? solarTerms[0].name : ""

  // 获取农历日期信息：年份干支、生肖、农历月份与日期
  const { yearCyl, lunarMonCN, lunarDayCN, zodiac } = getLunarDate(currentDate)

  return (
    <div className="flex flex-col items-center gap-4 text-white">
      {/* 显示当前时间 */}
      <div className="flex items-center gap-2 text-5xl">
        <span>{currentHour}</span>
        <span>:</span>
        <span>{currentMinute}</span>
      </div>

      {/* 显示当前日期、农历信息、节日、星期几、二十四节气 */}
      <div className="flex gap-2 text-base">
        {/* 公历日期 */}
        <span>{currentDate}</span>

        {/* 农历日期 */}
        <span>农历{yearCyl}年{zodiac}{lunarMonCN}{lunarDayCN}</span>

        {/* 显示农历节日（若有） */}
        {lunarFestival && <span>{lunarFestival}</span>}

        {/* 显示公历节日（若有） */}
        {solarFestival && <span>{solarFestival}</span>}

        {/* 显示二十四节气（若有） */}
        {currentSolarTerm && <span>{currentSolarTerm}</span>}

        {/* 显示星期几 */}
        <span>{currentWeekday}</span>
      </div>
    </div>
  )
}

export default TimeCalendar
