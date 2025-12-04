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
          <span class="city-name" @click="showLocationModal = true" title="点击更改城市">{{ weather.city }}</span>
          <button 
            class="location-btn" 
            @click="showLocationModal = true"
            title="设置城市定位"
          >
            📍
          </button>
        </div>
      </div>
    </div>
    
    <!-- 手动定位弹窗（使用Teleport传送到body） -->
    <Teleport to="body">
      <div class="location-modal" v-if="showLocationModal" @click.self="closeLocationModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>设置城市定位</h3>
          <button class="close-btn" @click="closeLocationModal">×</button>
        </div>
        
        <div class="modal-body">
          <div class="location-options">
            <div class="option-card" :class="{ active: locationMode === 'auto' }" @click="setLocationMode('auto')">
              <div class="option-icon">🌐</div>
              <div class="option-text">
                <h4>自动定位</h4>
                <p>根据IP地址自动获取位置</p>
              </div>
            </div>
            
            <div class="option-card" :class="{ active: locationMode === 'manual' }" @click="setLocationMode('manual')">
              <div class="option-icon">📍</div>
              <div class="option-text">
                <h4>手动设置</h4>
                <p>选择或搜索指定城市</p>
              </div>
            </div>
          </div>
          
          <!-- 手动选择城市 -->
          <div class="manual-location" v-if="locationMode === 'manual'">
            <div class="search-box">
              <input 
                v-model="searchQuery"
                placeholder="搜索城市名称..."
                @input="searchCities"
                class="city-search"
              />
            </div>
            
            <!-- 搜索结果 -->
            <div class="city-results" v-if="searchResults.length > 0">
              <div 
                class="city-item" 
                v-for="city in searchResults" 
                :key="`${city.adcode}-${city.fullName}`"
                @click="selectCity(city)"
                :class="{ selected: selectedCity && selectedCity.adcode === city.adcode }"
              >
                <div class="city-info">
                  <span class="city-full-name">{{ city.fullName || city.name }}</span>
                  <span class="city-name-sub">{{ city.name }}</span>
                </div>
                <span class="city-level">{{ city.level }}</span>
              </div>
            </div>
            
            <!-- 热门城市 -->
            <div class="popular-cities" v-else>
              <h5>热门城市</h5>
              <div class="city-grid">
                <button 
                  class="city-chip"
                  v-for="city in popularCities"
                  :key="city.adcode"
                  @click="selectCity(city)"
                >
                  {{ city.name }}
                </button>
              </div>
            </div>
            
            <!-- 当前选中的城市 -->
            <div class="selected-city" v-if="selectedCity">
              <h5>选中城市</h5>
              <div class="city-preview">
                <div class="preview-info">
                  <span class="city-name">{{ selectedCity.fullName || selectedCity.name }}</span>
                  <span class="city-type">{{ selectedCity.level }}</span>
                </div>
                <span class="city-code">编码：{{ selectedCity.adcode }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeLocationModal">取消</button>
          <button 
            class="btn btn-danger" 
            v-if="userLocation"
            @click="clearLocationSettings"
            title="清除手动设置，恢复默认"
          >
            清除设置
          </button>
          <button class="btn btn-primary" @click="applyLocationSettings" :disabled="locationMode === 'manual' && !selectedCity">确定</button>
        </div>
      </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { weatherConfig } from '../config/weather'

const currentTime = ref('')
const currentDate = ref('')
const weather = ref(null)
const currentCity = ref('') // 当前城市

// 位置设置相关
const showLocationModal = ref(false)
const locationMode = ref('auto') // 'auto' | 'manual'
const searchQuery = ref('')
const searchResults = ref([])
const selectedCity = ref(null)
const userLocation = ref(null) // 用户保存的位置设置

let timeInterval = null
let weatherInterval = null
let searchTimeout = null

// 热门城市列表（支持区县级）
const popularCities = ref([
  { name: '北京市', adcode: '110000', level: 'province' },
  { name: '北京-朝阳区', adcode: '110105', level: 'district' },
  { name: '北京-海淀区', adcode: '110108', level: 'district' },
  { name: '上海市', adcode: '310000', level: 'province' },
  { name: '上海-浦东新区', adcode: '310115', level: 'district' },
  { name: '上海-黄浦区', adcode: '310101', level: 'district' },
  { name: '广州-天河区', adcode: '440106', level: 'district' },
  { name: '深圳-南山区', adcode: '440305', level: 'district' },
  { name: '深圳-福田区', adcode: '440304', level: 'district' },
  { name: '杭州-西湖区', adcode: '330106', level: 'district' },
  { name: '成都-武侯区', adcode: '510107', level: 'district' },
  { name: '武汉-武昌区', adcode: '420106', level: 'district' },
  { name: '南京-鼓楼区', adcode: '320106', level: 'district' },
  { name: '合肥-蜀山区', adcode: '340104', level: 'district' },
  { name: '合肥-政务区', adcode: '340104', level: 'district' },
  { name: '苏州-工业园区', adcode: '320505', level: 'district' }
])

// 本地存储键名
const STORAGE_KEYS = {
  LOCATION_MODE: 'weather_location_mode',
  USER_LOCATION: 'weather_user_location'
}

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

// 从本地存储加载设置
const loadLocationSettings = () => {
  try {
    const savedMode = localStorage.getItem(STORAGE_KEYS.LOCATION_MODE)
    const savedLocation = localStorage.getItem(STORAGE_KEYS.USER_LOCATION)
    
    if (savedMode) {
      locationMode.value = savedMode
    }
    
    if (savedLocation) {
      userLocation.value = JSON.parse(savedLocation)
      selectedCity.value = userLocation.value
    }
  } catch (error) {
    console.error('加载位置设置失败:', error)
  }
}

// 保存设置到本地存储
const saveLocationSettings = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.LOCATION_MODE, locationMode.value)
    if (userLocation.value) {
      localStorage.setItem(STORAGE_KEYS.USER_LOCATION, JSON.stringify(userLocation.value))
    }
  } catch (error) {
    console.error('保存位置设置失败:', error)
  }
}

// 城市搜索（防抖）
const searchCities = async () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(async () => {
    if (!searchQuery.value || searchQuery.value.trim().length < 2) {
      searchResults.value = []
      return
    }
    
    try {
      const { amapKey } = weatherConfig
      if (!amapKey || amapKey === 'YOUR_AMAP_KEY') {
        console.warn('请配置高德API Key以使用城市搜索功能')
        return
      }
      
      // 设置subdistrict=2来获取下级行政区
      const url = `https://restapi.amap.com/v3/config/district?keywords=${encodeURIComponent(searchQuery.value.trim())}&subdistrict=2&key=${amapKey}`
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.status === '1' && data.districts && data.districts.length > 0) {
        // 收集所有级别的地区
        const allDistricts = []
        
        data.districts.forEach(province => {
          // 添加省级
          if (province.level === 'province' || province.level === 'city') {
            allDistricts.push({
              name: province.name,
              adcode: province.adcode,
              level: province.level === 'province' ? '省/直辖市' : '市',
              fullName: province.name
            })
          }
          
          // 添加市级
          if (province.districts && province.districts.length > 0) {
            province.districts.forEach(city => {
              allDistricts.push({
                name: city.name,
                adcode: city.adcode,
                level: city.level === 'city' ? '市' : '区',
                fullName: `${province.name}-${city.name}`
              })
              
              // 添加区县级
              if (city.districts && city.districts.length > 0) {
                city.districts.forEach(district => {
                  allDistricts.push({
                    name: district.name,
                    adcode: district.adcode,
                    level: '区/县',
                    fullName: `${province.name}-${city.name}-${district.name}`
                  })
                })
              }
            })
          }
        })
        
        // 限制显示20个结果，优先显示更精确的结果
        searchResults.value = allDistricts
          .filter(d => d.name.includes(searchQuery.value.trim()))
          .slice(0, 20)
      } else {
        searchResults.value = []
      }
    } catch (error) {
      console.error('搜索城市失败:', error)
      searchResults.value = []
    }
  }, 300)
}

// 选择城市
const selectCity = (city) => {
  selectedCity.value = city
  searchResults.value = []
  searchQuery.value = ''
}

// 设置定位模式
const setLocationMode = (mode) => {
  locationMode.value = mode
  if (mode === 'auto') {
    selectedCity.value = null
  }
}

// 关闭弹窗
const closeLocationModal = () => {
  showLocationModal.value = false
  searchQuery.value = ''
  searchResults.value = []
  // 恢复到当前保存的设置
  if (userLocation.value) {
    selectedCity.value = userLocation.value
  }
}

// 清除位置设置
const clearLocationSettings = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.LOCATION_MODE)
    localStorage.removeItem(STORAGE_KEYS.USER_LOCATION)
    
    // 重置为默认值
    locationMode.value = 'auto'
    userLocation.value = null
    selectedCity.value = null
    
    console.log('已清除位置设置')
  } catch (error) {
    console.error('清除位置设置失败:', error)
  }
}

// 应用位置设置
const applyLocationSettings = async () => {
  try {
    // 保存设置
    if (locationMode.value === 'manual' && selectedCity.value) {
      userLocation.value = selectedCity.value
      console.log('保存手动位置:', selectedCity.value.name)
    } else if (locationMode.value === 'auto') {
      userLocation.value = null
      console.log('切换到自动定位')
    }
    
    saveLocationSettings()
    
    // 立即更新天气
    await initWeather()
    
    // 关闭弹窗
    showLocationModal.value = false
  } catch (error) {
    console.error('应用位置设置失败:', error)
  }
}

// 初始化天气（根据设置）
const initWeather = async () => {
  // 清除之前的定时器
  if (weatherInterval) {
    clearInterval(weatherInterval)
  }
  
  let cityCode = null
  
  if (locationMode.value === 'manual' && userLocation.value) {
    // 使用用户手动设置的城市
    cityCode = userLocation.value.adcode
    console.log('使用手动设置的城市:', userLocation.value.name, cityCode)
  } else {
    // 尝试自动获取城市
    cityCode = await getCurrentCity()
    if (!cityCode) {
      // 自动获取失败，使用默认城市
      cityCode = weatherConfig.cityCode
      console.log('使用默认城市:', cityCode)
    }
  }
  
  // 获取天气并设置定时更新
  await fetchWeather(cityCode)
  weatherInterval = setInterval(() => fetchWeather(cityCode), weatherConfig.updateInterval)
}

onMounted(async () => {
  updateTime()
  
  // 加载用户设置
  loadLocationSettings()
  
  // 初始化天气
  await initWeather()
  
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
  white-space: nowrap;
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
  cursor: pointer;
  transition: color 0.3s;
}

.city-name:hover {
  color: var(--primary-color);
}

.location-btn {
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
  padding: 2px;
  margin-left: 4px;
}

.location-btn:hover {
  opacity: 1;
}

/* 位置设置弹窗 */
.location-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: auto;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 0;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.3s;
}

.close-btn:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.location-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.option-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.option-card:hover {
  border-color: var(--primary-color);
  background-color: rgba(var(--primary-color-rgb), 0.05);
}

.option-card.active {
  border-color: var(--primary-color);
  background-color: rgba(var(--primary-color-rgb), 0.1);
}

.option-icon {
  font-size: 24px;
  line-height: 1;
}

.option-text h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.option-text p {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.manual-location {
  margin-top: 24px;
}

.search-box {
  margin-bottom: 16px;
}

.city-search {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: border-color 0.3s;
}

.city-search:focus {
  outline: none;
  border-color: var(--primary-color);
}

.city-results {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 16px;
}

.city-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s;
}

.city-item:last-child {
  border-bottom: none;
}

.city-item:hover {
  background-color: var(--bg-secondary);
}

.city-item.selected {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  border-left: 3px solid var(--primary-color);
}

.city-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.city-full-name {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.city-name-sub {
  font-size: 12px;
  color: var(--text-secondary);
}

.city-level {
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  padding: 2px 8px;
  border-radius: 4px;
}

.popular-cities h5 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 8px;
}

.city-chip {
  padding: 8px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.city-chip:hover {
  border-color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
}

.selected-city {
  margin-top: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.selected-city h5 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.city-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-info .city-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.city-type {
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 4px;
}

.city-code {
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px;
  border-top: 1px solid var(--border-color);
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-primary:disabled {
  background: var(--text-tertiary);
  cursor: not-allowed;
  opacity: 0.5;
}

.btn-primary:disabled:hover {
  background: var(--text-tertiary);
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

@media (max-width: 1024px) {
  .time-weather {
    gap: 16px;
  }
  
  .time-display {
    gap: 6px;
  }
  
  .modal-content {
    width: 95%;
    max-width: 450px;
  }
  
  .location-options {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .time-weather {
    gap: 12px;
    font-size: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .time {
    font-size: 14px;
  }
  
  .date {
    font-size: 11px;
    color: var(--text-tertiary);
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
  
  .modal-content {
    width: 95%;
    max-height: 85vh;
  }
  
  .modal-header {
    padding: 16px 20px;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .modal-footer {
    padding: 16px 20px;
  }
  
  .city-grid {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: 6px;
  }
  
  .city-chip {
    padding: 6px 10px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .time-weather {
    gap: 8px;
  }
  
  .time-display {
    gap: 4px;
  }
  
  .date {
    display: none;
  }
  
  .weather-display {
    padding-left: 8px;
    border-left: none;
  }
  
  .weather-icon {
    font-size: 16px;
  }
  
  .temperature {
    font-size: 13px;
  }
  
  .weather-desc {
    display: none;
  }
  
  .modal-content {
    width: 98%;
    max-height: 90vh;
    margin: 10px;
  }
  
  .modal-header {
    padding: 12px 16px;
  }
  
  .modal-header h3 {
    font-size: 16px;
  }
  
  .modal-body {
    padding: 16px;
  }
  
  .modal-footer {
    padding: 12px 16px;
    flex-direction: column;
    gap: 8px;
  }
  
  .btn {
    width: 100%;
    padding: 10px 16px;
  }
  
  .option-card {
    padding: 12px;
    gap: 8px;
  }
  
  .option-text h4 {
    font-size: 13px;
  }
  
  .option-text p {
    font-size: 11px;
  }
  
  .city-grid {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 4px;
  }
  
  .city-chip {
    padding: 6px 8px;
    font-size: 11px;
  }
}
</style>
