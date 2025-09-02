import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import { colors, fonts } from '../../utils'
import { MyHeader, MyInput, MyRadio } from '../../components'
import opiniPublikData from '../ModulLiterasi/Opini.json'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function OpiniPublik({navigation}) {
  const [currentTeks, setCurrentTeks] = useState(0) // Index teks (0 atau 1)
  const [currentTahap, setCurrentTahap] = useState(0) // Index tahap CIRC (0-5)
  const [userAnswers, setUserAnswers] = useState({}) // Menyimpan jawaban user
  const [evaluationAnswers, setEvaluationAnswers] = useState({}) // Untuk soal pilihan ganda
  const [showEvaluation, setShowEvaluation] = useState(false)

  const currentData = opiniPublikData
  
  const tahapNames = [
    'Aktivasi Konteks',
    'Membaca Terpadu', 
    'Tinjauan Kritis',
    'Komposisi Reflektif',
    'Diskusi Kolaboratif',
    'Presentasi Kritis'
  ]

  // Get current text content
  const getCurrentText = () => {
    return currentData.texts[currentTeks]
  }

  // Get tasks based on current text and phase
  const getCurrentTasks = (tahapIndex) => {
    const phaseKeys = ['phase_1', 'phase_2', 'phase_3', 'phase_4', 'phase_5', 'phase_6']
    const phaseData = currentData.circ_phases[phaseKeys[tahapIndex]]
    
    // For phases with text-specific tasks
    if (tahapIndex === 0 || tahapIndex === 2 || tahapIndex === 3 || tahapIndex === 4 || tahapIndex === 5) {
      const textSuffix = currentTeks === 1 ? '_text2' : ''
      return phaseData[`tasks${textSuffix}`] || phaseData.tasks
    }
    
    return phaseData
  }

  // Get ideal answer for phase 2
  const getPhase2IdealAnswer = () => {
    const phaseData = currentData.circ_phases.phase_2
    return currentTeks === 1 ? phaseData.ideal_answer_text2 : phaseData.ideal_answer_text1
  }

  // Function untuk validasi input setiap tahap
  const validateCurrentStep = () => {
    let missingFields = []

    if (showEvaluation) {
      // Validasi evaluasi - pilihan ganda
      const mcKey = currentTeks === 1 ? 'multiple_choice_text2' : 'multiple_choice'
      const totalQuestions = currentData.final_assessment[mcKey].length
      for (let i = 0; i < totalQuestions; i++) {
        if (evaluationAnswers[`q_${i}`] === undefined) {
          missingFields.push(`Soal pilihan ganda nomor ${i + 1}`)
        }
      }
      
      // Validasi refleksi akhir
      const reflectionKey = currentTeks === 1 ? 'reflection_questions_text2' : 'reflection_questions'
      const totalRefleksi = currentData.final_assessment[reflectionKey].length
      for (let i = 0; i < totalRefleksi; i++) {
        const key = `refleksi_akhir_${i}`
        if (!userAnswers[key] || userAnswers[key].trim() === '') {
          missingFields.push(`Refleksi akhir nomor ${i + 1}`)
        }
      }
    } else {
      const tasks = getCurrentTasks(currentTahap)
      
      switch(currentTahap) {
        case 0: // Aktivasi Konteks
          for (let i = 0; i < tasks.length; i++) {
            const key = `tahap_${currentTahap}_task_${i}`
            if (!userAnswers[key] || userAnswers[key].trim() === '') {
              missingFields.push(`Pertanyaan nomor ${i + 1}`)
            }
          }
          break

        case 1: // Membaca Terpadu
          const key = `tahap_${currentTahap}_opini`
          if (!userAnswers[key] || userAnswers[key].trim() === '') {
            missingFields.push('Pernyataan opini utama dari setiap paragraf')
          }
          break

        case 2: // Tinjauan Kritis
          for (let i = 0; i < tasks.length; i++) {
            const key = `tahap_${currentTahap}_task_${i}`
            if (!userAnswers[key] || userAnswers[key].trim() === '') {
              missingFields.push(`Pertanyaan kritis nomor ${i + 1}`)
            }
          }
          break

        case 3: // Komposisi Reflektif
          const refleksiKey = `tahap_${currentTahap}_refleksi`
          if (!userAnswers[refleksiKey] || userAnswers[refleksiKey].trim() === '') {
            missingFields.push('Refleksi')
          }
          break

        case 4: // Diskusi Kolaboratif
          const diskusiRefleksi = userAnswers[`tahap_${currentTahap}_diskusi_refleksi`]
          const tanggapanTeman = userAnswers[`tahap_${currentTahap}_tanggapan_teman`]
          if (!diskusiRefleksi || diskusiRefleksi.trim() === '') {
            missingFields.push('Refleksi untuk diskusi')
          }
          if (!tanggapanTeman || tanggapanTeman.trim() === '') {
            missingFields.push('Tanggapan untuk teman')
          }
          break

        case 5: // Presentasi Kritis
          const presentasiFields = ['judul', 'sikap', 'argumen']
          presentasiFields.forEach((field) => {
            const key = `tahap_${currentTahap}_${field}`
            if (!userAnswers[key] || userAnswers[key].trim() === '') {
              missingFields.push(field.charAt(0).toUpperCase() + field.slice(1))
            }
          })
          break
      }
    }

    return missingFields
  }

  // Function untuk menyimpan data ke AsyncStorage
  const saveToStorage = async () => {
    try {
      const opiniPublikProgress = {
        userAnswers,
        evaluationAnswers,
        currentTeks,
        completedAt: new Date().toISOString(),
        progress: 100
      }
      
      await AsyncStorage.setItem('opini_publik_progress', JSON.stringify(opiniPublikProgress))
      
      // Update progress modul literasi
      const modulProgress = await AsyncStorage.getItem('modul_literasi_progress')
      let progress = modulProgress ? JSON.parse(modulProgress) : {}
      
      progress.opini_publik = {
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
      await saveToStorage()
      
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
      [key]: value
    }))
  }

  // Function untuk menyimpan jawaban evaluasi
  const saveEvaluationAnswer = (questionIndex, answer) => {
    setEvaluationAnswers(prev => ({
      ...prev,
      [`q_${questionIndex}`]: answer
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

  // Selesai dengan teks saat ini
  const finishCurrentText = async () => {
    const missingFields = validateCurrentStep()
    
    if (missingFields.length > 0) {
      Alert.alert(
        'Field Belum Lengkap', 
        `Harap lengkapi:\n• ${missingFields.join('\n• ')}`,
        [{text: 'OK'}]
      )
      return
    }

    if (currentTeks < currentData.texts.length - 1) {
      // Masih ada teks berikutnya
      setCurrentTeks(currentTeks + 1)
      setCurrentTahap(0)
      setShowEvaluation(false)
      setUserAnswers({})
      setEvaluationAnswers({})
    } else {
      // Semua teks selesai
      await completeModule()
    }
  }

  // Render konten berdasarkan tahap
  const renderTahapContent = () => {
    const tasks = getCurrentTasks(currentTahap)

    switch(currentTahap) {
      case 0: // Aktivasi Konteks
        return (
          <View>
            <Text style={styles.instructionText}>
              Jawab pertanyaan berikut untuk mengaktifkan konteks pembelajaran:
            </Text>
            {tasks?.map((task, index) => (
              <MyInput
                key={index}
                label={`${index + 1}. ${task.question}`}
                multiline
                numberOfLines={3}
                placeholder={`Contoh: ${task.ideal_answer}`}
                onChangeText={(value) => saveAnswer(`tahap_${currentTahap}_task_${index}`, value)}
                value={userAnswers[`tahap_${currentTahap}_task_${index}`] || ''}
              />
            ))}
          </View>
        )

      case 1: // Membaca Terpadu
        const currentText = getCurrentText()
        return (
          <View>
            <Text style={styles.sectionTitle}>Teks Bacaan:</Text>
            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>{currentText.title}</Text>
              {currentText.paragraphs.map((paragraph, index) => (
                <Text key={index} style={styles.textContent}>
                  {paragraph}
                </Text>
              ))}
            </View>
            
            <Text style={styles.instructionText}>
              {currentData.circ_phases.phase_2.instruction}:
            </Text>
            
            <MyInput
              label="Tuliskan pernyataan opini utama dari setiap paragraf:"
              multiline
              numberOfLines={6}
              placeholder={getPhase2IdealAnswer()}
              onChangeText={(value) => saveAnswer(`tahap_${currentTahap}_opini`, value)}
              value={userAnswers[`tahap_${currentTahap}_opini`] || ''}
            />
          </View>
        )

      case 2: // Tinjauan Kritis
        return (
          <View>
            <Text style={styles.instructionText}>
              Analisis teks opini publik yang telah Anda baca:
            </Text>
            {tasks?.map((task, index) => (
              <MyInput
                key={index}
                label={`${index + 1}. ${task.question}`}
                multiline
                numberOfLines={4}
                placeholder={task.ideal_answer}
                onChangeText={(value) => saveAnswer(`tahap_${currentTahap}_task_${index}`, value)}
                value={userAnswers[`tahap_${currentTahap}_task_${index}`] || ''}
              />
            ))}
          </View>
        )

      case 3: // Komposisi Reflektif
        const tahap4Task = tasks?.[0]
        return (
          <View>
            <Text style={styles.instructionText}>{tahap4Task?.question}</Text>
            <MyInput
              label="Tuliskan refleksi Anda (2-3 paragraf):"
              multiline
              numberOfLines={8}
              placeholder={tahap4Task?.ideal_answer}
              onChangeText={(value) => saveAnswer(`tahap_${currentTahap}_refleksi`, value)}
              value={userAnswers[`tahap_${currentTahap}_refleksi`] || ''}
            />
          </View>
        )

      case 4: // Diskusi Kolaboratif
        const tahap5Task = tasks?.[0]
        return (
          <View>
            <Text style={styles.instructionText}>
              Bagian diskusi kolaboratif - unggah refleksi dan berikan tanggapan:
            </Text>
            
            <MyInput
              label="Unggah/Tulis refleksi untuk diskusi:"
              multiline
              numberOfLines={6}
              placeholder="Bagikan refleksi Anda untuk diskusi dengan teman..."
              onChangeText={(value) => saveAnswer(`tahap_${currentTahap}_diskusi_refleksi`, value)}
              value={userAnswers[`tahap_${currentTahap}_diskusi_refleksi`] || ''}
            />
            
            <MyInput
              label="Tanggapan untuk teman:"
              multiline
              numberOfLines={4}
              placeholder={tahap5Task?.example_response || "Contoh: Wah bagus sekali pendapatmu..."}
              onChangeText={(value) => saveAnswer(`tahap_${currentTahap}_tanggapan_teman`, value)}
              value={userAnswers[`tahap_${currentTahap}_tanggapan_teman`] || ''}
            />
          </View>
        )

      case 5: // Presentasi Kritis
        const tahap6Task = tasks?.[0]
        const idealAnswer = tahap6Task?.ideal_answer
        return (
          <View>
            <Text style={styles.instructionText}>{tahap6Task?.instruction}</Text>
            
            <MyInput
              label="Judul:"
              onChangeText={(value) => saveAnswer(`tahap_${currentTahap}_judul`, value)}
              value={userAnswers[`tahap_${currentTahap}_judul`] || ''}
              placeholder={idealAnswer?.title || "Contoh: Mengatasi Fenomena Begal di Indonesia"}
            />
            
            <MyInput
              label="Sikap/Pendapat:"
              multiline
              numberOfLines={3}
              onChangeText={(value) => saveAnswer(`tahap_${currentTahap}_sikap`, value)}
              value={userAnswers[`tahap_${currentTahap}_sikap`] || ''}
              placeholder={idealAnswer?.stance || "Contoh: Mendukung penuh penegakan hukum tegas"}
            />
            
            <MyInput
              label="Argumen:"
              multiline
              numberOfLines={4}
              onChangeText={(value) => saveAnswer(`tahap_${currentTahap}_argumen`, value)}
              value={userAnswers[`tahap_${currentTahap}_argumen`] || ''}
              placeholder={idealAnswer?.arguments || "Tuliskan argumen pendukung..."}
            />
          </View>
        )
    }
  }

  // Render evaluasi
  const renderEvaluation = () => {
    const mcKey = currentTeks === 1 ? 'multiple_choice_text2' : 'multiple_choice'
    const reflectionKey = currentTeks === 1 ? 'reflection_questions_text2' : 'reflection_questions'
    const assessment = currentData.final_assessment
    
    return (
      <View>
        <Text style={styles.sectionTitle}>Evaluasi - Pilihan Ganda</Text>
        
        {assessment[mcKey].map((soal, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.questionText}>{index + 1}. {soal.question}</Text>
            <View style={styles.radioGroup}>
              {soal.options.map((option, optionIndex) => (
                <MyRadio
                  key={optionIndex}
                  label={`${String.fromCharCode(97 + optionIndex)}. ${option}`}
                  selected={evaluationAnswers[`q_${index}`] === optionIndex}
                  onPress={() => saveEvaluationAnswer(index, optionIndex)}
                />
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Refleksi Akhir</Text>
        {assessment[reflectionKey].map((refleksi, index) => (
          <MyInput
            key={index}
            label={`${index + 1}. ${refleksi.question}`}
            multiline
            numberOfLines={4}
            placeholder={refleksi.ideal_answer}
            onChangeText={(value) => saveAnswer(`refleksi_akhir_${index}`, value)}
            value={userAnswers[`refleksi_akhir_${index}`] || ''}
          />
        ))}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MyHeader title="Opini Publik" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.titleText}>{currentData.title}</Text>
          <Text style={styles.progressText}>
            {showEvaluation ? 'Evaluasi' : `${tahapNames[currentTahap]} (${currentTahap + 1}/6)`}
          </Text>
          <Text style={styles.textProgress}>
            Teks {currentTeks + 1} dari {currentData.texts.length}
          </Text>
        </View>

        {/* Tujuan Pembelajaran */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tujuan Pembelajaran:</Text>
          {currentData.learning_objectives.map((tujuan, index) => (
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
            onPress={showEvaluation ? finishCurrentText : nextTahap}
          >
            <Text style={[styles.navButtonText, styles.primaryButtonText]}>
              {showEvaluation 
                ? (currentTeks < currentData.texts.length - 1 ? 'Teks Selanjutnya' : 'Selesai')
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
  textProgress: {
    fontSize: 12,
    fontFamily: fonts.primary[400],
    color: colors.white,
    opacity: 0.8,
    marginTop: 2,
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
  textContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  textTitle: {
    fontSize: 16,
    fontFamily: fonts.primary[600],
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  textContent: {
    fontSize: 14,
    fontFamily: fonts.primary[400],
    color: '#2c3e50',
    lineHeight: 22,
    marginBottom: 12,
    textAlign: 'justify',
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
  radioGroup: {
    marginLeft: 10,
  },
})