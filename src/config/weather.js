// 高德天气API配置
export const weatherConfig = {
  // 请在这里填入你的高德API Key
  // 获取地址: https://lbs.amap.com/
  amapKey: 'c9116ce9d4a9f94ee6dc81391fab0a53',
  
  // 是否自动获取城市（基于IP定位）
  autoDetectCity: true,  // 改为 false，使用下面配置的默认城市
  
  // 城市编码（adcode）- 当 autoDetectCity 为 false 时使用
  // 常用城市编码：
  // 北京: 110000
  // 上海: 310000
  // 广州: 440100
  // 深圳: 440300
  // 杭州: 330100
  // 成都: 510100
  // 合肥: 340100
  // 蜀山区: 340104
  // 更多城市编码请查询: https://lbs.amap.com/api/webservice/guide/api/district
  cityCode: '340104',  // 合肥市蜀山区
  
  // 天气更新间隔（毫秒）
  // 建议不要太频繁，避免超出API调用限制
  updateInterval: 30 * 60 * 1000 // 30分钟
}
