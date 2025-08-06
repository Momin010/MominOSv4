
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Cloud, Sun, CloudRain, CloudSnow, Wind, Eye, Droplets, 
  Thermometer, MapPin, Search, RefreshCw, Calendar, Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  visibility: number
  uvIndex: number
  pressure: number
  feelsLike: number
  hourly: HourlyData[]
  daily: DailyData[]
}

interface HourlyData {
  time: string
  temperature: number
  condition: string
  precipitation: number
}

interface DailyData {
  day: string
  high: number
  low: number
  condition: string
  precipitation: number
}

const mockWeatherData: WeatherData = {
  location: "San Francisco, CA",
  temperature: 22,
  condition: "Partly Cloudy",
  humidity: 65,
  windSpeed: 12,
  visibility: 10,
  uvIndex: 6,
  pressure: 1013,
  feelsLike: 24,
  hourly: [
    { time: "12:00", temperature: 22, condition: "sunny", precipitation: 0 },
    { time: "13:00", temperature: 24, condition: "partly-cloudy", precipitation: 0 },
    { time: "14:00", temperature: 26, condition: "partly-cloudy", precipitation: 5 },
    { time: "15:00", temperature: 25, condition: "cloudy", precipitation: 10 },
    { time: "16:00", temperature: 23, condition: "rainy", precipitation: 80 },
  ],
  daily: [
    { day: "Today", high: 26, low: 18, condition: "partly-cloudy", precipitation: 20 },
    { day: "Tomorrow", high: 24, low: 16, condition: "rainy", precipitation: 85 },
    { day: "Wed", high: 21, low: 14, condition: "cloudy", precipitation: 60 },
    { day: "Thu", high: 23, low: 15, condition: "sunny", precipitation: 10 },
    { day: "Fri", high: 25, low: 17, condition: "partly-cloudy", precipitation: 15 },
  ]
}

export default function WeatherApp() {
  const [weather, setWeather] = useState<WeatherData>(mockWeatherData)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return <Sun className="w-8 h-8 text-yellow-500" />
      case 'partly-cloudy': return <Cloud className="w-8 h-8 text-gray-500" />
      case 'cloudy': return <Cloud className="w-8 h-8 text-gray-600" />
      case 'rainy': return <CloudRain className="w-8 h-8 text-blue-500" />
      case 'snowy': return <CloudSnow className="w-8 h-8 text-blue-300" />
      default: return <Sun className="w-8 h-8 text-yellow-500" />
    }
  }

  const searchLocation = async () => {
    if (!searchQuery.trim()) return
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setWeather({
        ...weather,
        location: searchQuery,
        temperature: Math.floor(Math.random() * 30) + 5
      })
      setLoading(false)
    }, 1000)
  }

  const refreshWeather = () => {
    setLoading(true)
    setTimeout(() => {
      setWeather({
        ...weather,
        temperature: Math.floor(Math.random() * 30) + 5,
        humidity: Math.floor(Math.random() * 40) + 40
      })
      setLoading(false)
    }, 500)
  }

  return (
    <div className="h-full bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 overflow-auto">
      <div className="p-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Sierro Weather</h1>
            <p className="text-blue-100">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Button onClick={refreshWeather} variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-8">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70"
            />
          </div>
          <Button onClick={searchLocation} className="bg-white/20 hover:bg-white/30">
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Current Weather */}
        <motion.div 
          className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {weather.location}
              </h2>
              <p className="text-blue-100">{weather.condition}</p>
            </div>
            {getWeatherIcon(weather.condition)}
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-6xl font-light">
              {weather.temperature}°C
            </div>
            <div className="text-blue-100">
              <p>Feels like {weather.feelsLike}°C</p>
            </div>
          </div>
        </motion.div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Droplets, label: "Humidity", value: `${weather.humidity}%` },
            { icon: Wind, label: "Wind", value: `${weather.windSpeed} km/h` },
            { icon: Eye, label: "Visibility", value: `${weather.visibility} km` },
            { icon: Thermometer, label: "Pressure", value: `${weather.pressure} hPa` },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white/20 backdrop-blur-lg rounded-xl p-4 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <item.icon className="w-6 h-6 mx-auto mb-2 text-blue-200" />
              <p className="text-sm text-blue-100">{item.label}</p>
              <p className="font-semibold">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Hourly Forecast */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Hourly Forecast
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {weather.hourly.map((hour, index) => (
              <motion.div
                key={index}
                className="bg-white/20 backdrop-blur-lg rounded-xl p-4 min-w-[120px] text-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-sm text-blue-100 mb-2">{hour.time}</p>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(hour.condition)}
                </div>
                <p className="font-semibold mb-1">{hour.temperature}°</p>
                <p className="text-xs text-blue-200">{hour.precipitation}%</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Daily Forecast */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            7-Day Forecast
          </h3>
          <div className="space-y-3">
            {weather.daily.map((day, index) => (
              <motion.div
                key={index}
                className="bg-white/20 backdrop-blur-lg rounded-xl p-4 flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 font-semibold">{day.day}</div>
                  {getWeatherIcon(day.condition)}
                  <div className="text-blue-100 text-sm">{day.precipitation}%</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{day.high}°</span>
                  <span className="text-blue-200">{day.low}°</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
