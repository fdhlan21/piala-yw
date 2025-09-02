import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { colors, fonts } from '../../utils'
import { MyHeader, MyInput, MyRadio } from '../../components'
import eksposisiData from '../ModulLiterasi/eksposisi.json'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Eksposisi({navigation}) {
  const [currentTeks, setCurrentTeks] = useState(0) // Index teks yang sedang aktif (0 atau 1)
  const [currentTahap, setCurrentTahap] = useState(0) // Index tahap CIRC (0-5)
  const [userAnswers, setUserAnswers] = useState({}) // Menyimpan jawaban user
  const [evaluationAnswers, setEvaluationAnswers] = useState({}) // Untuk soal pilihan ganda
  const [showEvaluation, setShowEvaluation] = useState(false)

  const currentData = eksposisiData.teks[currentTeks]
  
  const tahapNames = [
    'Aktivasi Konteks',
    'Membaca Terpadu', 
    'Tinjauan Kritis',
    'Komposisi Reflektif',
    'Diskusi Kolaboratif',
    'Presentasi Kritis'
  ]

  // Function untuk validasi input setiap tahap
  const validateCurrentStep = () => {
    const circ = currentData.pembelajaran_circ
    let requiredFields = []
    let missingFields = []

    if (showEvaluation) {
      // Validasi evaluasi - pilihan ganda
      const totalQuestions = currentData.evaluasi.pilihan_ganda.length
      for (let i = 1; i <= totalQuestions; i++) {
        if (evaluationAnswers[`teks_${currentTeks}_q_${i}`] === undefined) {
          missingFields.push(`Soal pilihan ganda nomor ${i}`)
        }
      }
      
      // Validasi refleksi akhir
      const totalRefleksi = currentData.evaluasi.refleksi.pertanyaan.length
      for (let i = 0; i < totalRefleksi; i++) {
        const key = `teks_${currentTeks}_tahap_${currentTahap}_refleksi_akhir_${i}`
        if (!userAnswers[key] || userAnswers[key].trim() === '') {
          missingFields.push(`Refleksi akhir nomor ${i + 1}`)
        }
      }
    } else {
      switch(currentTahap) {
        case 0: // Aktivasi Konteks
          const tahap1Questions = circ.tahap_1_aktivasi_konteks.pertanyaan?.length || 0
          for (let i = 0; i < tahap1Questions; i++) {
            const key = `teks_${currentTeks}_tahap_${currentTahap}_pertanyaan_${i}`
            if (!userAnswers[key] || userAnswers[key].trim() === '') {
              missingFields.push(`Pertanyaan nomor ${i + 1}`)
            }
          }
          break

        case 1: // Membaca Terpadu
          const idePokok = userAnswers[`teks_${currentTeks}_tahap_${currentTahap}_ide_pokok`]
          if (!idePokok || idePokok.trim() === '') {
            missingFields.push('Ide pokok tiap paragraf')
          }
          break

        case 2: // Tinjauan Kritis
          const tahap3Questions = circ.tahap_3_tinjauan_kritis.pertanyaan?.length || 0
          for (let i = 0; i < tahap3Questions; i++) {
            const key = `teks_${currentTeks}_tahap_${currentTahap}_kritis_${i}`
            if (!userAnswers[key] || userAnswers[key].trim() === '') {
              missingFields.push(`Pertanyaan kritis nomor ${i + 1}`)
            }
          }
          break

        case 3: // Komposisi Reflektif
          const refleksi = userAnswers[`teks_${currentTeks}_tahap_${currentTahap}_refleksi`]
          if (!refleksi || refleksi.trim() === '') {
            missingFields.push('Refleksi')
          }
          break

        case 4: // Diskusi Kolaboratif
          const diskusiRefleksi = userAnswers[`teks_${currentTeks}_tahap_${currentTahap}_diskusi_refleksi`]
          const tanggapanTeman = userAnswers[`teks_${currentTeks}_tahap_${currentTahap}_tanggapan_teman`]
          if (!diskusiRefleksi || diskusiRefleksi.trim() === '') {
            missingFields.push('Refleksi untuk diskusi')
          }
          if (!tanggapanTeman || tanggapanTeman.trim() === '') {
            missingFields.push('Tanggapan untuk teman')
          }
          break

        case 5: // Presentasi Kritis
          const ringkasan = userAnswers[`teks_${currentTeks}_tahap_${currentTahap}_ringkasan`]
          const sikap = userAnswers[`teks_${currentTeks}_tahap_${currentTahap}_sikap`]
          const solusi = userAnswers[`teks_${currentTeks}_tahap_${currentTahap}_solusi`]
          
          if (!ringkasan || ringkasan.trim() === '') {
            missingFields.push('Ringkasan')
          }
          if (!sikap || sikap.trim() === '') {
            missingFields.push('Sikap/Pendapat')
          }
          if (!solusi || solusi.trim() === '') {
            missingFields.push('Solusi')
          }
          break
      }
    }

    return missingFields
  }

  // Function untuk menyimpan data ke AsyncStorage
  const saveToStorage = async () => {
    try {
      const eksposisiProgress = {
        userAnswers,
        evaluationAnswers,
        completedAt: new Date().toISOString(),
        totalTeks: eksposisiData.teks.length,
        progress: 100
      }
      
      await AsyncStorage.setItem('eksposisi_progress', JSON.stringify(eksposisiProgress))
      
      // Update progress modul literasi
      const modulProgress = await AsyncStorage.getItem('modul_literasi_progress')
      let progress = modulProgress ? JSON.parse(modulProgress) : {}
      
      progress.eksposisi = {
        completed: true,
        completedAt: new Date().toISOString(),
        progress: 100
      }
      
      await AsyncStorage.setItem('modul_literasi_progress', JSON.stringify(progress))
      
      console.log('Data berhasil disimpan ke storage')
    } catch (error) {
      console.error('Error saving to storage:', error)
    }
  }

  // Function untuk menyelesaikan modul
  const completeModule = async () => {
    try {
      console.log('Menyimpan data ke storage...') // Debug log
      
      // Save data ke AsyncStorage
      await saveToStorage()
      
      // Show success alert
      Alert.alert(
        'Selamat! 🎉',
        'Anda telah menyelesaikan Modul Eksposisi dengan progress 100%!\n\nData pembelajaran telah disimpan.',
        [
          {
            text: 'Kembali ke Menu',
            onPress: () => {
              console.log('Navigasi ke ModulLiterasi') // Debug log
              navigation.replace('ModulLiterasi')
            }
          }
        ]
      )
    } catch (error) {
      console.error('Error completing module:', error)
      Alert.alert('Error', 'Gagal menyimpan data. Silakan coba lagi.')
    }
  }

  // Function untuk menyimpan jawaban
  const saveAnswer = (key, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [`teks_${currentTeks}_tahap_${currentTahap}_${key}`]: value
    }))
  }

  // Function untuk menyimpan jawaban evaluasi
  const saveEvaluationAnswer = (questionId, answer) => {
    setEvaluationAnswers(prev => ({
      ...prev,
      [`teks_${currentTeks}_q_${questionId}`]: answer
    }))
  }

  // Navigasi ke tahap berikutnya
  const nextTahap = () => {
    const missingFields = validateCurrentStep()
    
    if (missingFields.length > 0) {
      Alert.alert(
        'Field Belum Lengkap', 
        `Harap lengkapi:\n• ${missingFields.join('\n• ')}`,
        [{text: 'OK'}]
      )
      return
    }

    if (currentTahap < 5) {
      setCurrentTahap(currentTahap + 1)
    } else {
      setShowEvaluation(true)
    }
  }

  // Navigasi ke tahap sebelumnya
  const prevTahap = () => {
    if (showEvaluation) {
      setShowEvaluation(false)
    } else if (currentTahap > 0) {
      setCurrentTahap(currentTahap - 1)
    }
  }

  // Pindah ke teks berikutnya atau selesai
  const nextTeks = async () => {
    console.log('nextTeks dipanggil, currentTeks:', currentTeks, 'total teks:', eksposisiData.teks.length) // Debug log
    
    const missingFields = validateCurrentStep()
    
    if (missingFields.length > 0) {
      Alert.alert(
        'Field Belum Lengkap', 
        `Harap lengkapi:\n• ${missingFields.join('\n• ')}`,
        [{text: 'OK'}]
      )
      return
    }

    if (currentTeks < eksposisiData.teks.length - 1) {
      console.log('Pindah ke teks berikutnya') // Debug log
      setCurrentTeks(currentTeks + 1)
      setCurrentTahap(0)
      setShowEvaluation(false)
    } else {
      console.log('Semua teks selesai, menjalankan complete module') // Debug log
      // Semua teks selesai - complete module
      await completeModule()
    }
  }

  // Render konten berdasarkan tahap
  const renderTahapContent = () => {
    const circ = currentData.pembelajaran_circ

    switch(currentTahap) {
      case 0: // Aktivasi Konteks
        const tahap1 = circ.tahap_1_aktivasi_konteks
        return (
          <View>
            {/* Gambar Raja Ampat untuk Teks 1 */}
            {currentTeks === 0 && (
              <View style={styles.imageContainer}>
                <Image 
                  source={require('../../assets/rajaampat.jpeg')} 
                  style={styles.contextImage}
                  resizeMode="cover"
                />
                <Text style={styles.imageCaption}>Raja Ampat - Papua</Text>
              </View>
            )}
            
            <Text style={styles.instructionText}>
              {tahap1.tugas ? tahap1.tugas.join('\n') : ''}
            </Text>
            {tahap1.pertanyaan?.map((pertanyaan, index) => (
              <MyInput
                key={index}
                label={`${index + 1}. ${pertanyaan}`}
                multiline
                onChangeText={(value) => saveAnswer(`pertanyaan_${index}`, value)}
                value={userAnswers[`teks_${currentTeks}_tahap_${currentTahap}_pertanyaan_${index}`] || ''}
              />
            ))}
          </View>
        )

      case 1: // Membaca Terpadu
        const tahap2 = circ.tahap_2_membaca_terpadu
        return (
          <View>
            <Text style={styles.sectionTitle}>Teks Bacaan:</Text>
            <Text style={styles.textContent}>{currentData.teks_bacaan}</Text>
            
            <Text style={styles.instructionText}>
              {Array.isArray(tahap2.tugas) ? tahap2.tugas.join('\n') : tahap2.tugas}
            </Text>
            
            <MyInput
              label="Tuliskan ide pokok tiap paragraf:"
              multiline
              numberOfLines={6}
              onChangeText={(value) => saveAnswer('ide_pokok', value)}
              value={userAnswers[`teks_${currentTeks}_tahap_${currentTahap}_ide_pokok`] || ''}
            />
          </View>
        )

      case 2: // Tinjauan Kritis
        const tahap3 = circ.tahap_3_tinjauan_kritis
        return (
          <View>
            {tahap3.pertanyaan?.map((pertanyaan, index) => (
              <MyInput
                key={index}
                label={`${index + 1}. ${pertanyaan}`}
                multiline
                onChangeText={(value) => saveAnswer(`kritis_${index}`, value)}
                value={userAnswers[`teks_${currentTeks}_tahap_${currentTahap}_kritis_${index}`] || ''}
              />
            ))}
          </View>
        )

      case 3: // Komposisi Reflektif
        const tahap4 = circ.tahap_4_komposisi_reflektif
        return (
          <View>
            <Text style={styles.instructionText}>{tahap4.tugas}</Text>
            <MyInput
              label="Tuliskan refleksi Anda:"
              multiline
              numberOfLines={8}
              onChangeText={(value) => saveAnswer('refleksi', value)}
              value={userAnswers[`teks_${currentTeks}_tahap_${currentTahap}_refleksi`] || ''}
            />
          </View>
        )

      case 4: // Diskusi Kolaboratif
        const tahap5 = circ.tahap_5_diskusi_kolaboratif
        return (
          <View>
            <Text style={styles.instructionText}>
              {tahap5.tugas?.join('\n')}
            </Text>
            
            <MyInput
              label="Unggah/Tulis refleksi untuk diskusi:"
              multiline
              numberOfLines={6}
              onChangeText={(value) => saveAnswer('diskusi_refleksi', value)}
              value={userAnswers[`teks_${currentTeks}_tahap_${currentTahap}_diskusi_refleksi`] || ''}
            />
            
            <MyInput
              label="Tanggapan untuk teman:"
              multiline
              numberOfLines={4}
              placeholder="Contoh: Saya setuju dengan pendapat..."
              onChangeText={(value) => saveAnswer('tanggapan_teman', value)}
              value={userAnswers[`teks_${currentTeks}_tahap_${currentTahap}_tanggapan_teman`] || ''}
            />
          </View>
        )

      case 5: // Presentasi Kritis
        const tahap6 = circ.tahap_6_presentasi_kritis
        return (
          <View>
            <Text style={styles.instructionText}>{tahap6.tugas}</Text>
            
            <MyInput
              label="Ringkasan:"
              multiline
              onChangeText={(value) => saveAnswer('ringkasan', value)}
              value={userAnswers[`teks_${currentTeks}_tahap_${currentTahap}_ringkasan`] || ''}
            />
            
            <MyInput
              label="Sikap/Pendapat:"
              multiline
              onChangeText={(value) => saveAnswer('sikap', value)}
              value={userAnswers[`teks_${currentTeks}_tahap_${currentTahap}_sikap`] || ''}
            />
            
            <MyInput
              label="Solusi:"
              multiline
              onChangeText={(value) => saveAnswer('solusi', value)}
              value={userAnswers[`teks_${currentTeks}_tahap_${currentTahap}_solusi`] || ''}
            />
          </View>
        )
    }
  }

  // Render evaluasi
  const renderEvaluation = () => {
    const evaluasi = currentData.evaluasi
    return (
      <View>
        <Text style={styles.sectionTitle}>Evaluasi - Pilihan Ganda</Text>
        
        {evaluasi.pilihan_ganda.map((soal) => (
          <View key={soal.id} style={styles.questionContainer}>
            <Text style={styles.questionText}>{soal.id}. {soal.pertanyaan}</Text>
            <View style={styles.radioGroup}>
              {soal.pilihan.map((pilihan, index) => (
                <MyRadio
                  key={index}
                  label={`${String.fromCharCode(97 + index)}. ${pilihan}`}
                  selected={evaluationAnswers[`teks_${currentTeks}_q_${soal.id}`] === index}
                  onPress={() => saveEvaluationAnswer(soal.id, index)}
                />
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Refleksi Akhir</Text>
        {evaluasi.refleksi.pertanyaan.map((pertanyaan, index) => (
          <MyInput
            key={index}
            label={`${index + 1}. ${pertanyaan}`}
            multiline
            numberOfLines={4}
            onChangeText={(value) => saveAnswer(`refleksi_akhir_${index}`, value)}
            value={userAnswers[`teks_${currentTeks}_tahap_${currentTahap}_refleksi_akhir_${index}`] || ''}
          />
        ))}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MyHeader title="Eksposisi" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.titleText}>{currentData.judul}</Text>
          <Text style={styles.progressText}>
            Teks {currentTeks + 1} dari {eksposisiData.teks.length} | 
            {showEvaluation ? ' Evaluasi' : ` ${tahapNames[currentTahap]} (${currentTahap + 1}/6)`}
          </Text>
        </View>

        {/* Tujuan Pembelajaran */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tujuan Pembelajaran:</Text>
          {currentData.tujuan_pembelajaran.map((tujuan, index) => (
            <Text key={index} style={styles.bulletText}>• {tujuan}</Text>
          ))}
        </View>

        {/* Konten Tahap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {showEvaluation ? 'Evaluasi' : `Tahap ${currentTahap + 1}: ${tahapNames[currentTahap]}`}
          </Text>
          {showEvaluation ? renderEvaluation() : renderTahapContent()}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {(currentTahap > 0 || showEvaluation) && (
            <TouchableOpacity style={styles.navButton} onPress={prevTahap}>
              <Text style={styles.navButtonText}>Sebelumnya</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.navButton, styles.primaryButton]} 
            onPress={showEvaluation ? nextTeks : nextTahap}
          >
            <Text style={[styles.navButtonText, styles.primaryButtonText]}>
              {showEvaluation ? 
                (currentTeks < eksposisiData.teks.length - 1 ? 'Teks Berikutnya' : 'Selesai') 
                : (currentTahap < 5 ? 'Selanjutnya' : 'Evaluasi')
              }
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerInfo: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 18,
    fontFamily: fonts.primary[600],
    color: colors.white,
    marginBottom: 5,
  },
  progressText: {
    fontSize: 14,
    fontFamily: fonts.primary[400],
    color: colors.white,
    opacity: 0.9,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.primary[600],
    color: '#2c3e50',
    marginBottom: 10,
  },
  bulletText: {
    fontSize: 14,
    fontFamily: fonts.primary[400],
    color: '#34495e',
    marginBottom: 5,
    lineHeight: 20,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: fonts.primary[400],
    color: '#34495e',
    marginBottom: 15,
    lineHeight: 20,
  },
  textContent: {
    fontSize: 14,
    fontFamily: fonts.primary[400],
    color: '#2c3e50',
    lineHeight: 22,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 14,
    fontFamily: fonts.primary[500],
    color: '#2c3e50',
    marginBottom: 10,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    minWidth: 100,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  navButtonText: {
    fontSize: 14,
    fontFamily: fonts.primary[500],
    color: colors.primary,
  },
  primaryButtonText: {
    color: colors.white,
  },
  imageContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contextImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  imageCaption: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: fonts.primary[400],
    color: '#7f8c8d',
    padding: 8,
    backgroundColor: '#f8f9fa',
  },
  radioGroup: {
    marginLeft: 10,
  },
})