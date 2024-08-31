/**
 * 校验各种类型数据是否为空
 *
 * @param obj 对象
 */
export function isEmpty(obj: any): boolean {
  if (obj === undefined) {
    return true
  } else if (obj === null) {
    return true
  } else if (typeof obj === "string") {
    return obj.length === 0
  } else if (obj instanceof Array) {
    return obj.length === 0
  } else if (obj instanceof Set) {
    return obj.size === 0
  } else {
    return false
  }
}

/**
 * 字符串忽略大小写相等
 *
 * @param source
 * @param target
 * @returns boolean
 */
export function equalsIgnoreCase(source?: string, target?: string) {
  if (source && target) {
    const sourceLow = source.toLowerCase(),
      targetLow = target.toLowerCase()

    return sourceLow === targetLow
  } else {
    return false
  }
}

/**
 * 存在任意字符
 * @param source
 * @param tragets
 * @returns
 */
export function containsAny(source: string, ...tragets: string[]) {
  return tragets.some(item => source.includes(item))
}

/**
 * 存在全部字符
 * @param source
 * @param tragets
 * @returns
 */
export function containsAll(source: string, ...tragets: string[]) {
  return tragets.every(item => source.includes(item))
}

/**
 * 深克隆
 *
 * @param obj 对象
 */
export function deepClone<E extends object>(obj: E, ...ignoreKeys: string[]): E {
  const json = JSON.stringify(obj)
  const newObj = JSON.parse(json)

  for (const key of ignoreKeys) {
    if (Reflect.has(newObj, key)) {
      Reflect.deleteProperty(newObj, key)
    }
  }
  return newObj
}

/**
 * 复制参数
 *
 * @param source 来源
 * @param target 目标
 * @param deep 深度
 */
export function copy(
  source: object,
  target: object,
  onlyExist: boolean = false,
  skipEmpty: boolean = true,
  deep: number = 0
) {
  const keys = Object.keys(source)
  for (const key of keys) {
    const temp = source[key]

    if (skipEmpty && isEmpty(temp)) continue
    if (onlyExist && !Reflect.has(target, key)) continue

    // 如果deep大于0且为对象则递归复制内部参数
    if (typeof temp === "object" && deep > 0) {
      copy(temp, target[key], onlyExist, skipEmpty, deep - 1)
    } else {
      target[key] = temp
    }
  }
}

/**
 * 获取除keys参数外对象的key
 *
 * @param source 来源
 * @param keys Key
 * @returns 除keys参数外的key
 */
export function otherKeys<T extends object, K extends keyof T>(source: T, ...keys: K[]): Array<K> {
  return Object.keys(source).filter(key => !keys.includes(key as K)) as Array<K>
}

/**
 * 生成UUID
 *
 * @returns string uuid
 */
export function uuid() {
  const temp: any[] = []
  const hexDigits = "0123456789abcdef"

  for (let i = 0; i < 36; i++) {
    temp[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }

  temp[14] = "4" // bits 12-15 of the time_hi_and_version field to 0010
  temp[19] = hexDigits.substr((temp[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  temp[8] = temp[13] = temp[18] = temp[23] = "-"
  return temp.join("")
}
