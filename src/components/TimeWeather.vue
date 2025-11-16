<template>
  <div class="time-weather">
    <div class="time-display">
      <span class="time">{{ currentTime }}</span>
      <span class="date">{{ currentDate }}</span>
    </div>
    <div class="weather-display" v-if="weather">
      <span class="weather-icon">{{ getWeatherIcon(weather.description) }}</span>
      <div class="weather-info">
        <div class="weather-main">
          <span class="temperature">{{ weather.temperature }}°</span>
          <span class="weather-desc">{{ weather.description }}</span>
        </div>
        <div class="weather-detail" v-if="weather.city">
          <span class="city-name">{{ weather.city }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { weatherConfig } from '../config/weather'

const currentTime = ref('')
const currentDate = ref('')
const weather = ref(null)
const currentCity = ref('') // 当前城市

let timeInterval = null
let weatherInterval = null

// 更新时间
const updateTime = () => {
  const now = new Date()
  
  // 格式化时间 HH:MM
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
  
  // 格式化日期
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[now.getDay()]
  currentDate.value = `${month}月${day}日 ${weekday}`
}

// 根据天气描述返回对应的图标
const getWeatherIcon = (description) => {
  if (!description) return '🌡️'
  
  const weatherMap = {
    '晴': '☀️',
    '多云': '⛅',
    '阴': '☁️',
    '小雨': '🌦️',
    '中雨': '🌧️',
    '大雨': '⛈️',
    '暴雨': '⛈️',
    '雷阵雨': '⛈️',
    '雨夹雪': '🌨️',
    '小雪': '🌨️',
    '中雪': '❄️',
    '大雪': '❄️',
    '暴雪': '❄️',
    '雾': '🌫️',
    '霾': '😷',
    '沙尘暴': '🌪️',
    '浮尘': '🌫️',
    '扬沙': '🌫️',
    '冰雹': '🧊'
  }
  
  // 精确匹配
  if (weatherMap[description]) {
    return weatherMap[description]
  }
  
  // 模糊匹配
  for (const [key, icon] of Object.entries(weatherMap)) {
    if (description.includes(key)) {
      return icon
    }
  }
  
  return '🌡️' // 默认图标
}

// 获取当前城市（基于IP定位）
const getCurrentCity = async () => {
  try {
    const { amapKey } = weatherConfig
    if (!amapKey || amapKey === 'YOUR_AMAP_KEY') {
      return null
    }
    
    // 使用高德IP定位API
    const url = `https://restapi.amap.com/v3/ip?key=${amapKey}`
    const response = await fetch(url)
    const data = await response.json()
    
    console.log('IP定位返回数据:', data)
    
    // 检查返回状态
    if (data.status === '1') {
      // 成功获取定位信息
      if (data.adcode && data.adcode !== '[]') {
        currentCity.value = data.city || data.province
        console.log('定位成功 - 城市:', currentCity.value, '编码:', data.adcode)
        return data.adcode
      } else {
        console.warn('IP定位返回了空的adcode，可能是局域网IP或国外IP')
        return null
      }
    } else {
      console.error('IP定位失败:', data.info)
      return null
    }
  } catch (error) {
    console.error('获取城市位置失败:', error)
    return null
  }
}

// 获取天气信息（使用高德天气API）
const fetchWeather = async (cityCodeParam = null) => {
  try {
    const { amapKey, cityCode: defaultCityCode } = weatherConfig
    
    // 如果没有配置API Key，使用模拟数据
    if (!amapKey || amapKey === 'YOUR_AMAP_KEY') {
      console.warn('请在 src/config/weather.js 中配置高德天气API Key')
      weather.value = {
        temperature: Math.floor(Math.random() * 15) + 15,
        description: ['晴', '多云', '阴'][Math.floor(Math.random() * 3)]
      }
      return
    }
    
    // 使用传入的城市编码，如果没有则使用配置的默认城市编码
    const targetCityCode = cityCodeParam || defaultCityCode
    
    // 调用高德天气API
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${targetCityCode}&key=${amapKey}&extensions=base`
    const response = await fetch(url)
    const data = await response.json()
    
    console.log('天气数据:', data)
    
    if (data.status === '1' && data.lives && data.lives.length > 0) {
      const live = data.lives[0]
      weather.value = {
        temperature: live.temperature_float || live.temperature,
        description: live.weather,
        city: live.city,
        humidity: live.humidity,
        windDirection: live.winddirection,
        windPower: live.windpower,
        reportTime: live.reporttime
      }
      console.log('天气更新成功:', weather.value)
    } else {
      console.error('获取天气失败:', data.info)
      weather.value = {
        temperature: '--',
        description: '未知'
      }
    }
  } catch (error) {
    console.error('获取天气失败:', error)
    weather.value = {
      temperature: '--',
      description: '未知'
    }
  }
}

onMounted(async () => {
  updateTime()
  
  // 如果启用自动获取城市
  if (weatherConfig.autoDetectCity) {
    const detectedCityCode = await getCurrentCity()
    if (detectedCityCode) {
      await fetchWeather(detectedCityCode)
      // 定期更新天气时也使用检测到的城市
      weatherInterval = setInterval(() => fetchWeather(detectedCityCode), weatherConfig.updateInterval)
    } else {
      // 获取城市失败，使用默认城市
      await fetchWeather()
      weatherInterval = setInterval(fetchWeather, weatherConfig.updateInterval)
    }
  } else {
    // 不自动获取城市，使用配置的城市
    await fetchWeather()
    weatherInterval = setInterval(fetchWeather, weatherConfig.updateInterval)
  }
  
  // 每分钟更新一次时间
  timeInterval = setInterval(updateTime, 60000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
  if (weatherInterval) {
    clearInterval(weatherInterval)
  }
})
</script>

<style scoped>
.time-weather {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 13px;
  color: var(--text-secondary);
}

.time-display {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.time {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.date {
  font-size: 12px;
  color: var(--text-secondary);
}

.weather-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 16px;
  border-left: 1px solid var(--border-color);
}

.weather-icon {
  font-size: 20px;
  line-height: 1;
}

.weather-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.weather-main {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.temperature {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.weather-desc {
  font-size: 12px;
  color: var(--text-secondary);
}

.weather-detail {
  display: flex;
  align-items: center;
  gap: 4px;
}

.city-name {
  font-size: 11px;
  color: var(--text-tertiary);
}

@media (max-width: 768px) {
  .time-weather {
    gap: 12px;
    font-size: 12px;
  }
  
  .time {
    font-size: 14px;
  }
  
  .date {
    display: none;
  }
  
  .weather-display {
    padding-left: 12px;
  }
  
  .weather-detail {
    display: none;
  }
  
  .temperature {
    font-size: 14px;
  }
}
</style>
