import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { colors, fonts } from '../../utils'
import { MyHeader } from '../../components'
import { Color } from '../../utils/colors'

export default function TentangAplikasi() {
  const InfoSection = ({ title, children }) => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
      </View>
    )
  }

  const BulletPoint = ({ text }) => {
    return (
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>{text}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MyHeader title="Tentang Aplikasi"/>
    
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* Header Aplikasi */}
          <View style={styles.headerApp}>
            <Text style={styles.appTitle}>PIALA-YW</Text>
            <Text style={styles.appSubtitle}>
              Platform Integratif Literasi Akademik – Yeni Witdianti
            </Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>Versi 1.0 (Uji coba)</Text>
            </View>
          </View>

          {/* Deskripsi Singkat */}
          <InfoSection title="Deskripsi Singkat">
            <Text style={styles.descriptionText}>
              PIALA-YW adalah media pembelajaran membaca berbantuan Android yang 
              dikembangkan untuk mendukung pembelajaran literasi akademik mahasiswa 
              menggunakan strategi <Text style={styles.italicText}>Cooperative Integrated Reading and Composition</Text> (CIRC). 
              Aplikasi ini dirancang khusus untuk mendukung proses pembelajaran pada 
              mata kuliah Membaca di perguruan tinggi di Papua Barat Daya.
            </Text>
          </InfoSection>

          {/* Tujuan Aplikasi */}
          <InfoSection title="Tujuan Aplikasi">
            <BulletPoint 
              text="Membantu mahasiswa memahami teks akademik dan kontekstual melalui pembelajaran membaca terpadu" 
            />
            <BulletPoint 
              text="Mengintegrasikan keterampilan membaca dan menulis reflektif secara kolaboratif" 
            />
            <BulletPoint 
              text="Menjadi media bantu pembelajaran inovatif yang mendukung dosen dalam proses pengajaran" 
            />
          </InfoSection>

          {/* Fitur Utama */}
          <InfoSection title="Fitur Utama">
            <BulletPoint 
              text="Modul Literasi Membaca (Eksposisi, Argumentatif, Opini Publik, Ilmiah Populer, Sastra)" 
            />
            <BulletPoint 
              text="Latihan dan Refleksi" 
            />
            <BulletPoint 
              text="Forum Diskusi" 
            />
            <BulletPoint 
              text="Profil dan Pelacakan Kemajuan Mahasiswa" 
            />
          </InfoSection>

          {/* Strategi Pembelajaran */}
          <InfoSection title="Metode Pembelajaran">
            <View style={styles.methodContainer}>
              <Text style={styles.methodTitle}>6 Tahap Strategi CIRC</Text>
              <View style={styles.stepsContainer}>
                {[
                  'Aktivasi Konteks',
                  'Membaca Terpadu', 
                  'Tinjauan Kritis',
                  'Komposisi Reflektif',
                  'Diskusi Kolaboratif',
                  'Presentasi Kritis'
                ].map((step, index) => (
                  <View key={index} style={styles.stepItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </View>
          </InfoSection>

          {/* Target Pengguna */}
          <InfoSection title="Target Pengguna">
            <Text style={styles.descriptionText}>
              Aplikasi ini diperuntukkan bagi mahasiswa di perguruan tinggi Papua Barat Daya 
              yang mengambil mata kuliah Membaca, serta dosen yang membutuhkan media pembelajaran 
              literasi akademik yang inovatif dan interaktif.
            </Text>
          </InfoSection>

          {/* Developer Info */}
          <View style={styles.developerInfo}>
            <Text style={styles.developerTitle}>Dikembangkan oleh:</Text>
            <Text style={styles.developerName}>Yeni Witdianti</Text>
            <Text style={styles.developerInstitution}>Papua Barat Daya</Text>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  content: {
    padding: 20,
  },
  headerApp: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  appTitle: {
    fontSize: 28,
    fontFamily: fonts.primary[800],
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    fontFamily: fonts.primary[400],
    color: colors.white,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  versionBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  versionText: {
    fontSize: 14,
    fontFamily: fonts.primary[500],
    color: colors.white,
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.primary[700],
    color: colors.primary,
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 15,
    fontFamily: fonts.primary[400],
    color: '#000000',
    lineHeight: 24,
    textAlign: 'justify',
  },
  italicText: {
    fontStyle: 'italic',
    fontFamily: fonts.primary[500],
  },
  bulletContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: fonts.primary[700],
    marginRight: 10,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.primary[400],
    color: "#000000",
    lineHeight: 22,
  },
  methodContainer: {
    backgroundColor: Color.blueGray[50],
    borderRadius: 12,
    padding: 15,
  },
  methodTitle: {
    fontSize: 16,
    fontFamily: fonts.primary[600],
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  stepsContainer: {
    marginTop: 10,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontFamily: fonts.primary[600],
    color: colors.white,
  },
  stepText: {
    fontSize: 14,
    fontFamily: fonts.primary[500],
    color: '#555555',
  },
  developerInfo: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  developerTitle: {
    fontSize: 14,
    fontFamily: fonts.primary[500],
    color: '#555555',
    marginBottom: 8,
  },
  developerName: {
    fontSize: 18,
    fontFamily: fonts.primary[700],
    color: colors.primary,
    marginBottom: 4,
  },
  developerInstitution: {
    fontSize: 14,
    fontFamily: fonts.primary[400],
    color: '#555555',
  },
});