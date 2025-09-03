import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { colors, fonts } from '../../utils'
import { MyHeader, MyInput, MyRadio } from '../../components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Icon } from 'react-native-elements'

export default function LatihanRefleksi({navigation}) {
    const titleHeader = 'Latihan & Refleksi';
    const [completedModules, setCompletedModules] = useState([])
    const [selectedModule, setSelectedModule] = useState(null)
    const [currentExercise, setCurrentExercise] = useState(0)
    const [userAnswers, setUserAnswers] = useState({})
    const [showResults, setShowResults] = useState(false)
    const [moduleProgress, setModuleProgress] = useState({})

    const modules = [
        { 
            id: 'eksposisi', 
            name: 'Eksposisi',
            icon: '📝',
            exercises: [
                {
                    type: 'multiple_choice',
                    question: 'Tujuan teks eksposisi adalah...',
                    options: ['Menghibur', 'Mengajak', 'Menjelaskan', 'Menceritakan'],
                    correct: 2
                },
                {
                    type: 'multiple_choice', 
                    question: 'Ciri bahasa eksposisi adalah...',
                    options: ['Imajinatif', 'Persuasif', 'Objektif', 'Humor'],
                    correct: 2
                },
                {
                    type: 'reflection',
                    question: 'Bagaimana strategi membaca berbasis 6 fase CIRC membantu pemahamanmu terhadap teks eksposisi?',
                    placeholder: 'Tuliskan refleksi Anda tentang pembelajaran eksposisi...'
                }
            ]
        },
        { 
            id: 'argumentatif', 
            name: 'Argumentatif',
            icon: '💭',
            exercises: [
                {
                    type: 'multiple_choice',
                    question: 'Tujuan teks argumentatif adalah...',
                    options: ['Menceritakan pengalaman', 'Menjelaskan proses', 'Menyampaikan pendapat disertai alasan', 'Menggambarkan tempat'],
                    correct: 2
                },
                {
                    type: 'multiple_choice',
                    question: 'Struktur teks argumentatif terdiri dari...',
                    options: ['Tesis - Argumen - Kesimpulan', 'Orientasi - Komplikasi - Resolusi', 'Pernyataan - Deskripsi - Penutup', 'Pembuka - Isi - Penutup'],
                    correct: 0
                },
                {
                    type: 'reflection',
                    question: 'Apa yang kamu pelajari tentang pentingnya menyampaikan argumen yang logis dan didukung bukti?',
                    placeholder: 'Tuliskan refleksi Anda tentang pembelajaran argumentatif...'
                }
            ]
        },
        { 
            id: 'opini_publik', 
            name: 'Opini Publik',
            icon: '🗣️',
            exercises: [
                {
                    type: 'multiple_choice',
                    question: 'Karakteristik teks opini publik adalah...',
                    options: ['Subjektif dan berdasar pengalaman', 'Objektif dan faktual', 'Imajinatif dan kreatif', 'Deskriptif dan detail'],
                    correct: 0
                },
                {
                    type: 'multiple_choice',
                    question: 'Tujuan utama opini publik adalah...',
                    options: ['Menghibur pembaca', 'Menyampaikan pandangan personal terhadap isu', 'Menjelaskan fakta', 'Menceritakan kejadian'],
                    correct: 1
                },
                {
                    type: 'reflection',
                    question: 'Bagaimana kamu dapat menyampaikan opini yang bertanggung jawab dan konstruktif?',
                    placeholder: 'Tuliskan refleksi Anda tentang menyampaikan opini publik...'
                }
            ]
        },
        { 
            id: 'sastra_kontekstual', // Diperbaiki sesuai dengan key yang digunakan di ModulLiterasi
            name: 'Sastra Kontekstual',
            icon: '🎭',
            exercises: [
                {
                    type: 'multiple_choice',
                    question: 'Nilai utama dalam sastra kontekstual Papua adalah...',
                    options: ['Hiburan semata', 'Refleksi budaya dan realitas sosial', 'Estetika bahasa', 'Keindahan alam'],
                    correct: 1
                },
                {
                    type: 'multiple_choice',
                    question: 'Fungsi sastra dalam menyuarakan isu sosial adalah...',
                    options: ['Mengkritik pemerintah', 'Menyampaikan pesan melalui cara yang artistik', 'Menghibur saja', 'Mempromosikan budaya'],
                    correct: 1
                },
                {
                    type: 'reflection',
                    question: 'Bagaimana karya sastra dapat menjadi medium untuk memahami dan menyuarakan realitas Papua?',
                    placeholder: 'Tuliskan refleksi Anda tentang pembelajaran sastra kontekstual...'
                }
            ]
        },
        { 
            id: 'ilmiah_populer', 
            name: 'Ilmiah Populer',
            icon: '🔬',
            exercises: [
                {
                    type: 'multiple_choice',
                    question: 'Ciri utama teks ilmiah populer adalah...',
                    options: ['Menggunakan bahasa teknis', 'Menyajikan informasi ilmiah dengan bahasa mudah dipahami', 'Berisi opini pribadi', 'Menghibur pembaca'],
                    correct: 1
                },
                {
                    type: 'multiple_choice',
                    question: 'Fungsi data dan fakta dalam teks ilmiah populer adalah...',
                    options: ['Menghias tulisan', 'Mendukung argumen dengan bukti', 'Membuat tulisan panjang', 'Menunjukkan kepintaran penulis'],
                    correct: 1
                },
                {
                    type: 'reflection',
                    question: 'Bagaimana pembelajaran teks ilmiah populer membantu kamu dalam berpikir kritis dan analitis?',
                    placeholder: 'Tuliskan refleksi Anda tentang pembelajaran ilmiah populer...'
                }
            ]
        }
    ];

    useEffect(() => {
        loadProgress()
    }, [])

    const loadProgress = async () => {
        try {
            const progress = await AsyncStorage.getItem('modul_literasi_progress')
            if (progress) {
                const progressData = JSON.parse(progress)
                setModuleProgress(progressData)
                
                const completed = modules.filter(module => 
                    progressData[module.id] && progressData[module.id].completed
                )
                setCompletedModules(completed)
            }
        } catch (error) {
            console.error('Error loading progress:', error)
        }
    }

    const selectModule = (module) => {
        setSelectedModule(module)
        setCurrentExercise(0)
        setUserAnswers({})
        setShowResults(false)
    }

    const saveAnswer = (exerciseIndex, answer) => {
        setUserAnswers(prev => ({
            ...prev,
            [exerciseIndex]: answer
        }))
    }

    // Fungsi untuk validasi apakah jawaban sudah diisi dengan benar
    const isAnswerValid = () => {
        const answer = userAnswers[currentExercise]
        const exercise = selectedModule.exercises[currentExercise]
        
        if (answer === undefined) return false
        
        if (exercise.type === 'multiple_choice') {
            return Number.isInteger(answer) && answer >= 0
        }
        
        if (exercise.type === 'reflection') {
            return typeof answer === 'string' && answer.trim() !== ''
        }
        
        return true
    }

    const nextExercise = () => {
        if (currentExercise < selectedModule.exercises.length - 1) {
            setCurrentExercise(currentExercise + 1)
        } else {
            // Show results
            setShowResults(true)
        }
    }

    const prevExercise = () => {
        if (currentExercise > 0) {
            setCurrentExercise(currentExercise - 1)
        }
    }

    const calculateScore = () => {
        let correct = 0
        let total = 0
        
        selectedModule.exercises.forEach((exercise, index) => {
            if (exercise.type === 'multiple_choice') {
                total++
                if (userAnswers[index] === exercise.correct) {
                    correct++
                }
            }
        })
        
        return { correct, total, percentage: total > 0 ? Math.round((correct / total) * 100) : 0 }
    }

    const saveResults = async () => {
        try {
            const score = calculateScore()
            const results = {
                moduleId: selectedModule.id,
                score,
                answers: userAnswers,
                completedAt: new Date().toISOString()
            }
            
            const existingResults = await AsyncStorage.getItem('latihan_refleksi_results')
            const allResults = existingResults ? JSON.parse(existingResults) : {}
            allResults[selectedModule.id] = results
            
            await AsyncStorage.setItem('latihan_refleksi_results', JSON.stringify(allResults))
            
            Alert.alert(
                'Hasil Tersimpan! 📊',
                `Nilai Anda: ${score.correct}/${score.total} (${score.percentage}%)\n\nRefleksi telah disimpan untuk review lebih lanjut.`,
                [{ text: 'OK', onPress: () => setSelectedModule(null) }]
            )
        } catch (error) {
            console.error('Error saving results:', error)
        }
    }

    const renderModuleList = () => (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.introSection}>
                <Text style={styles.introTitle}>Latihan & Refleksi</Text>
                <Text style={styles.introText}>
                    Uji pemahaman Anda terhadap modul-modul yang telah diselesaikan dan refleksikan pengalaman pembelajaran Anda.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Modul yang Tersedia:</Text>
                {modules.map((module, index) => {
                    const isCompleted = completedModules.some(completed => completed.id === module.id)
                    
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.moduleCard,
                                isCompleted ? styles.moduleCompleted : styles.moduleDisabled
                            ]}
                            onPress={() => isCompleted ? selectModule(module) : null}
                            disabled={!isCompleted}
                        >
                            <Text style={styles.moduleIcon}>{module.icon}</Text>
                            <View style={styles.moduleInfo}>
                                <Text style={[
                                    styles.moduleName,
                                    !isCompleted && styles.moduleDisabledText
                                ]}>
                                    {module.name}
                                </Text>
                                <Text style={[
                                    styles.moduleStatus,
                                    !isCompleted && styles.moduleDisabledText
                                ]}>
                                    {isCompleted ? 'Siap untuk latihan' : 'Selesaikan modul terlebih dahulu'}
                                </Text>
                            </View>
                            {isCompleted && ( 
                               <Icon type='ionicon' name='arrow-forward-outline' size={20}/>
                            )}
                        </TouchableOpacity>
                    )
                })}
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>💡 Tips:</Text>
                <Text style={styles.infoText}>
                    • Selesaikan latihan pilihan ganda terlebih dahulu{'\n'}
                    • Tulis refleksi dengan jujur dan mendalam{'\n'}
                    • Gunakan hasil ini untuk evaluasi diri{'\n'}
                    • Ulangi latihan untuk memperdalam pemahaman
                </Text>
            </View>
        </ScrollView>
    )

    const renderExercise = () => {
        const exercise = selectedModule.exercises[currentExercise]
        
        return (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.exerciseHeader}>
                    <Text style={styles.exerciseModuleName}>
                        {selectedModule.icon} {selectedModule.name}
                    </Text>
                    <Text style={styles.exerciseProgress}>
                        Soal {currentExercise + 1} dari {selectedModule.exercises.length}
                    </Text>
                </View>

                <View style={styles.exerciseContainer}>
                    <Text style={styles.exerciseQuestion}>
                        {currentExercise + 1}. {exercise.question}
                    </Text>

                    {exercise.type === 'multiple_choice' ? (
                        <View style={styles.optionsContainer}>
                            {exercise.options.map((option, index) => (
                                <MyRadio
                                    key={index}
                                    label={`${String.fromCharCode(97 + index)}. ${option}`}
                                    selected={userAnswers[currentExercise] === index}
                                    onPress={() => saveAnswer(currentExercise, index)}
                                />
                            ))}
                        </View>
                    ) : (
                        <MyInput
                            multiline
                            numberOfLines={6}
                            placeholder={exercise.placeholder}
                            value={userAnswers[currentExercise] || ''}
                            onChangeText={(value) => saveAnswer(currentExercise, value)}
                        />
                    )}
                </View>

                <View style={styles.navigationContainer}>
                    {currentExercise > 0 && (
                        <TouchableOpacity style={styles.navButton} onPress={prevExercise}>
                            <Text style={styles.navButtonText}>Sebelumnya</Text>
                        </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity 
                        style={[styles.navButton, styles.primaryButton]}
                        onPress={nextExercise}
                        disabled={!isAnswerValid()} // Diperbaiki menggunakan fungsi validasi
                    >
                        <Text style={[styles.navButtonText, styles.primaryButtonText]}>
                            {currentExercise < selectedModule.exercises.length - 1 ? 'Selanjutnya' : 'Selesai'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }

    const renderResults = () => {
        const score = calculateScore()
        
        return (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.resultsHeader}>
                    <Text style={styles.resultsTitle}>Hasil Latihan</Text>
                    <Text style={styles.resultsModule}>{selectedModule.name}</Text>
                </View>

                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>
                        {score.correct}/{score.total}
                    </Text>
                    <Text style={styles.scorePercentage}>
                        ({score.percentage}%)
                    </Text>
                    <Text style={styles.scoreLabel}>
                        {score.percentage >= 80 ? 'Sangat Baik! 🎉' : 
                         score.percentage >= 60 ? 'Baik 👍' : 
                         'Perlu Peningkatan 💪'}
                    </Text>
                </View>

                <View style={styles.reviewContainer}>
                    <Text style={styles.reviewTitle}>Review Jawaban:</Text>
                    {selectedModule.exercises.map((exercise, index) => (
                        <View key={index} style={styles.reviewItem}>
                            <Text style={styles.reviewQuestion}>
                                {index + 1}. {exercise.question}
                            </Text>
                            {exercise.type === 'multiple_choice' ? (
                                <View>
                                    <Text style={[
                                        styles.reviewAnswer,
                                        userAnswers[index] === exercise.correct ? styles.correctAnswer : styles.wrongAnswer
                                    ]}>
                                        Jawaban Anda: {exercise.options[userAnswers[index]] || 'Tidak dijawab'}
                                    </Text>
                                    {userAnswers[index] !== exercise.correct && (
                                        <Text style={styles.correctAnswerText}>
                                            Jawaban yang benar: {exercise.options[exercise.correct]}
                                        </Text>
                                    )}
                                </View>
                            ) : (
                                <Text style={styles.reflectionPreview}>
                                    Refleksi Anda telah tersimpan ✓
                                </Text>
                            )}
                        </View>
                    ))}
                </View>

                <View style={styles.navigationContainer}>
                    <TouchableOpacity 
                        style={styles.navButton} 
                        onPress={() => setSelectedModule(null)}
                    >
                        <Text style={styles.navButtonText}>Kembali</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.navButton, styles.primaryButton]}
                        onPress={saveResults}
                    >
                        <Text style={[styles.navButtonText, styles.primaryButtonText]}>
                            Simpan Hasil
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }

    return (
        <View style={styles.container}>
            <MyHeader title={titleHeader} />
            {!selectedModule ? 
                renderModuleList() : 
                showResults ? 
                    renderResults() : 
                    renderExercise()
            }
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
    introSection: {
        backgroundColor: colors.primary,
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    introTitle: {
        fontSize: 20,
        fontFamily: fonts.primary[600],
        color: colors.white,
        marginBottom: 8,
    },
    introText: {
        fontSize: 14,
        fontFamily: fonts.primary[400],
        color: colors.white,
        lineHeight: 20,
        opacity: 0.9,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: fonts.primary[600],
        color: '#2c3e50',
        marginBottom: 15,
    },
    moduleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    moduleCompleted: {
        backgroundColor: colors.white,
        borderColor: colors.primary,
    },
    moduleDisabled: {
        opacity: 0.5,
    },
    moduleIcon: {
        fontSize: 24,
        marginRight: 15,
    },
    moduleInfo: {
        flex: 1,
    },
    moduleName: {
        fontSize: 16,
        fontFamily: fonts.primary[600],
        color: '#2c3e50',
        marginBottom: 4,
    },
    moduleStatus: {
        fontSize: 12,
        fontFamily: fonts.primary[400],
        color: '#6c757d',
    },
    moduleDisabledText: {
        color: '#adb5bd',
    },
    moduleArrow: {
        fontSize: 18,
        color: colors.primary,
        fontWeight: 'bold',
    },
    infoBox: {
        backgroundColor: '#fff3cd',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#ffc107',
    },
    infoTitle: {
        fontSize: 14,
        fontFamily: fonts.primary[600],
        color: '#856404',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 12,
        fontFamily: fonts.primary[400],
        color: '#856404',
        lineHeight: 18,
    },
    exerciseHeader: {
        backgroundColor: colors.primary,
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
    },
    exerciseModuleName: {
        fontSize: 18,
        fontFamily: fonts.primary[600],
        color: colors.white,
        marginBottom: 5,
    },
    exerciseProgress: {
        fontSize: 14,
        fontFamily: fonts.primary[400],
        color: colors.white,
        opacity: 0.9,
    },
    exerciseContainer: {
        marginBottom: 30,
    },
    exerciseQuestion: {
        fontSize: 16,
        fontFamily: fonts.primary[500],
        color: '#2c3e50',
        marginBottom: 20,
        lineHeight: 24,
    },
    optionsContainer: {
        paddingLeft: 10,
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
    resultsHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    resultsTitle: {
        fontSize: 24,
        fontFamily: fonts.primary[600],
        color: '#2c3e50',
        marginBottom: 5,
    },
    resultsModule: {
        fontSize: 16,
        fontFamily: fonts.primary[400],
        color: '#6c757d',
    },
    scoreContainer: {
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 20,
        padding: 25,
        marginBottom: 30,
    },
    scoreText: {
        fontSize: 36,
        fontFamily: fonts.primary[700],
        color: colors.white,
    },
    scorePercentage: {
        fontSize: 18,
        fontFamily: fonts.primary[500],
        color: colors.white,
        opacity: 0.9,
    },
    scoreLabel: {
        fontSize: 16,
        fontFamily: fonts.primary[500],
        color: colors.white,
        marginTop: 10,
    },
    reviewContainer: {
        marginBottom: 30,
    },
    reviewTitle: {
        fontSize: 18,
        fontFamily: fonts.primary[600],
        color: '#2c3e50',
        marginBottom: 15,
    },
    reviewItem: {
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
    },
    reviewQuestion: {
        fontSize: 14,
        fontFamily: fonts.primary[500],
        color: '#2c3e50',
        marginBottom: 10,
    },
    reviewAnswer: {
        fontSize: 14,
        fontFamily: fonts.primary[400],
        marginBottom: 5,
    },
    correctAnswer: {
        color: '#28a745',
    },
    wrongAnswer: {
        color: '#dc3545',
    },
    correctAnswerText: {
        fontSize: 14,
        fontFamily: fonts.primary[400],
        color: '#28a745',
    },
    reflectionPreview: {
        fontSize: 14,
        fontFamily: fonts.primary[400],
        color: '#28a745',
        fontStyle: 'italic',
    },
})