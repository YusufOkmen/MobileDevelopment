import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const LAT = '41.0050';
  const LON = '39.7269';

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // 1. THE NEW URL: We are now explicitly asking for 5 specific data points
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,uv_index`
        );
        const data = await response.json();
        
        if (data.error) {
          setErrorMsg("Konum bulunamadı.");
          return;
        }

        setWeather(data);
      } catch (error) {
        setErrorMsg("İnternet bağlantısında bir sorun oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  // --- THE UPGRADED DECISION MAKER ---
  const getPlantingAdvice = () => {
    if (!weather || !weather.current) return null;

    const current = weather.current;
    
    // We assign our new variables for easy reading
    const temp = current.temperature_2m;
    const code = current.weather_code;
    const wind = current.wind_speed_10m;
    const humidity = current.relative_humidity_2m;
    const uv = current.uv_index;

    // Rule 1: Temperature extremes (Too cold or too hot)
    if (temp < 5 || temp > 35) {
      return { 
        title: "Bekleyin 🛑", 
        detail: `Sıcaklık ${temp}°C. Fidan kökleri için aşırı sıcaklık tehlikelidir.`,
        cardColor: '#ff4444' 
      };
    } 
    // Rule 2: Precipitation
    else if (code >= 50) {
      return { 
        title: "Bekleyin 🛑", 
        detail: "Şu an yağışlı. Toprak çok çamurlu ve işlenmesi zor olabilir.",
        cardColor: '#ffbb33' 
      };
    } 
    // Rule 3: High Wind
    else if (wind > 30) {
      return { 
        title: "Dikkatli Olun ⚠️", 
        detail: `Rüzgar ${wind} km/s. Genç fidanların gövdeleri kırılabilir, destek çubuğu kullanın.`,
        cardColor: '#ffbb33' 
      };
    }
    // Rule 4: High UV Index
    else if (uv > 7) {
      return {
        title: "Güneşe Dikkat ☀️",
        detail: `UV İndeksi ${uv}. Açık kökler hızla kuruyabilir. Gölgelik bir alanda çalışın.`,
        cardColor: '#ffbb33'
      };
    }
    // Rule 5: Low Humidity (Dry Soil Risk)
    else if (humidity < 30) {
      return {
        title: "Can Suyunu Bol Verin 💧",
        detail: `Nem oranı %${humidity}. Hava çok kuru, dikimden sonra bolca sulama yapın.`,
        cardColor: '#33b5e5' // Water blue
      };
    }
    // All conditions are perfect
    else {
      return { 
        title: "Hemen Başlayın! 🌱", 
        detail: "Tüm koşullar fidan dikmek için harika!",
        cardColor: '#00C851' 
      };
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Hava durumu yükleniyor...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Hata: {errorMsg}</Text>
      </View>
    );
  }

  const advice = getPlantingAdvice();
  const current = weather?.current;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.cityText}>Trabzon</Text>
      
      <Text style={styles.tempText}>{Math.round(current?.temperature_2m)}°C</Text>
      
      {/* 2. THE NEW DATA DISPLAY METRICS */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Nem</Text>
          <Text style={styles.metricValue}>%{current?.relative_humidity_2m}</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Rüzgar</Text>
          <Text style={styles.metricValue}>{current?.wind_speed_10m} km/s</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>UV İndeksi</Text>
          <Text style={styles.metricValue}>{current?.uv_index}</Text>
        </View>
      </View>
      
      {advice && (
        <View style={[styles.adviceCard, { backgroundColor: advice.cardColor }]}>
          <Text style={styles.adviceTitle}>{advice.title}</Text>
          <Text style={styles.adviceDetail}>{advice.detail}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#4A90E2', 
    padding: 20
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#4A90E2'
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#fff' },
  errorText: { color: '#ff4444', fontSize: 18, fontWeight: 'bold' },
  cityText: { fontSize: 40, fontWeight: 'bold', color: '#fff', marginTop: 40 },
  tempText: { fontSize: 80, fontWeight: '200', color: '#fff', marginVertical: 10 },
  
  // Styles for the new data grid
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 15,
  },
  metricBox: {
    alignItems: 'center',
  },
  metricLabel: {
    color: '#E0E0E0',
    fontSize: 14,
    marginBottom: 5,
  },
  metricValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  adviceCard: {
    padding: 20,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  adviceTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  adviceDetail: { fontSize: 16, color: '#fff', textAlign: 'center' }
});