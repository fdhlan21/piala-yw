import { View, Text, ScrollView, TouchableNativeFeedback, StyleSheet, Image, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { colors, fonts } from '../../utils'
import { MyHeader } from '../../components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'

const { height } = Dimensions.get('window');

export default function ModulLiterasi({navigation}) {
  const [modulProgress, setModulProgress] = useState({})

  const jenisModul = [
    {
      id: 1,
      title: 'Eksposisi',
      route: 'Eksposisi',
      storageKey: 'eksposisi_progress'
    },
    {
      id: 2,
      title: 'Argumentatif',
      route: 'Argumentatif',
      storageKey: 'argumentatif_progress'
    },
    {
      id: 3,
      title: 'Opini Publik',
      route: 'OpiniPublik',
      storageKey: 'opini_publik_progress'
    },
    {
      id: 4,
      title: 'Sastra Kontekstual',
      route: 'SastraKontekstual',
      storageKey: 'sastra_kontekstual_progress'
    },
    {
      id: 5,
      title: 'Ilmiah Populer',
      route: 'IlmiahPopuler',
      storageKey: 'ilmiah_populer_progress'
    }
  ];

  // Load progress data dari AsyncStorage
  const loadProgressData = async () => {
    try {
      const progressData = await AsyncStorage.getItem('modul_literasi_progress')
      if (progressData) {
        setModulProgress(JSON.parse(progressData))
      }
    } catch (error) {
      console.error('Error loading progress data:', error)
    }
  }

  // Refresh progress saat halaman focus
  useFocusEffect(
    React.useCallback(() => {
      loadProgressData()
    }, [])
  )

  // Function untuk mendapatkan status dan progress modul
  const getModulStatus = (modulKey) => {
    const progress = modulProgress[modulKey]
    
    if (!progress) {
      return {
        status: 'Belum Mulai',
        progress: 0,
        statusColor: '#95a5a6',
        progressColor: '#ecf0f1'
      }
    }
    
    if (progress.completed) {
      return {
        status: 'Selesai ✓',
        progress: 100,
        statusColor: '#27ae60',
        progressColor: '#27ae60'
      }
    }
    
    if (progress.progress > 0) {
      return {
        status: 'Sedang Berjalan',
        progress: progress.progress,
        statusColor: '#f39c12',
        progressColor: '#f39c12'
      }
    }
    
    return {
      status: 'Belum Mulai',
      progress: 0,
      statusColor: '#95a5a6',
      progressColor: '#ecf0f1'
    }
  }

  return (
    <View style={styles.container}>
      <MyHeader title="Modul Literasi"/>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.mainTitle}>Modul Literasi Membaca</Text>
          <Text style={styles.subtitle}>Pilih jenis modul yang ingin dipelajari</Text>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {jenisModul.map((modul) => {
            const modulKey = modul.title.toLowerCase().replace(' ', '_')
            const statusInfo = getModulStatus(modulKey)
            
            return (
              <TouchableNativeFeedback 
                key={modul.id}
                onPress={() => navigation.navigate(modul.route)}
                background={TouchableNativeFeedback.Ripple('#e3f2fd', false)}>
                <View style={styles.menuCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.numberBadge}>
                      <Text style={styles.numberText}>{modul.id}</Text>
                    </View>
                    {statusInfo.progress === 100 && (
                      <View style={styles.completeBadge}>
                        <Text style={styles.completeText}>✓</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.menuTitle}>{modul.title}</Text>
                    <View style={styles.cardFooter}>
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { 
                                width: `${statusInfo.progress}%`,
                                backgroundColor: statusInfo.progressColor
                              }
                            ]} 
                          />
                        </View>
                        <Text style={styles.progressText}>
                          {statusInfo.progress}%
                        </Text>
                      </View>
                      <Text style={[
                        styles.statusText, 
                        { color: statusInfo.statusColor }
                      ]}>
                        {statusInfo.status}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableNativeFeedback>
            )
          })}
        </View>

      
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerSection: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  mainTitle: {
    fontSize: 22,
    fontFamily: fonts.primary[700],
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.primary[400],
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  menuGrid: {
    paddingBottom: 20,
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 140,
    paddingVertical: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 16,
    fontFamily: fonts.primary[700],
    color: colors.white,
  },
  completeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeText: {
    fontSize: 16,
    color: colors.white,
    fontFamily: fonts.primary[700],
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 18,
    fontFamily: fonts.primary[600],
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  cardFooter: {
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
    justifyContent: 'center',
  },
  progressBar: {
    height: 8,
    width: '60%',
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    minWidth: 2,
  },
  progressText: {
    fontSize: 12,
    fontFamily: fonts.primary[500],
    color: '#7f8c8d',
    minWidth: 35,
  },
  statusText: {
    fontSize: 14,
    fontFamily: fonts.primary[500],
    textAlign: 'center',
  },
  summarySection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: fonts.primary[600],
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 15,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: fonts.primary[700],
    color: colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: fonts.primary[400],
    color: '#7f8c8d',
    textAlign: 'center',
  },
});