import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import {fonts} from '../../utils/fonts';
import {
  MYAPP,
  storeData,
} from '../../utils/localStorage';
import {colors} from '../../utils/colors';
import {
  MyButton,
  MyGap,
  MyHeader,
  MyInput,
} from '../../components';
import {useToast} from 'react-native-toast-notifications';

export default function AccountEdit({navigation, route}) {
  const [kirim, setKirim] = useState({
    nama: '',
    nim: '',
    asal_perguruan_tinggi: ''
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Mengambil data dari route params atau set dummy data
    if (route.params) {
      setKirim({
        nama: route.params.nama || '',
        nim: route.params.nim || '',
        asal_perguruan_tinggi: route.params.asal_perguruan_tinggi || ''
      });
    } else {
      // Fallback dummy data
      setKirim({
        nama: 'Yeni Witdianti',
        nim: '20230001',
        asal_perguruan_tinggi: 'Universitas Papua Barat Daya'
      });
    }
  }, [route.params]);

  const handleSave = () => {
    // Validasi input
    if (!kirim.nama.trim()) {
      Alert.alert(MYAPP, 'Nama tidak boleh kosong');
      return;
    }
    
    if (!kirim.nim.trim()) {
      Alert.alert(MYAPP, 'NIM tidak boleh kosong');
      return;
    }
    
    if (!kirim.asal_perguruan_tinggi.trim()) {
      Alert.alert(MYAPP, 'Asal perguruan tinggi tidak boleh kosong');
      return;
    }

    setLoading(true);
    
    // Simulasi proses save
    setTimeout(() => {
      setLoading(false);
      
      // Simpan dummy data ke local storage (jika diperlukan)
      const updatedUser = {
        nama: kirim.nama,
        nim: kirim.nim,
        asal_perguruan_tinggi: kirim.asal_perguruan_tinggi
      };
      
      storeData('user', updatedUser);
      
      // Tampilkan toast sukses
      toast.show('Profil berhasil diperbarui!', {
        type: 'success',
      });
      
      // Kembali ke halaman sebelumnya
      navigation.goBack();
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MyHeader title="Edit Profile" onPress={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Edit Informasi Profil</Text>
          <Text style={styles.formSubtitle}>
            Perbarui informasi profil Anda di bawah ini
          </Text>
        </View>

        <MyInput
          label="Nama Lengkap"
          iconname="person-outline"
          value={kirim.nama}
          onChangeText={x => setKirim({...kirim, nama: x})}
          placeholder="Masukkan nama lengkap"
        />

        <MyInput
          label="NIM (Nomor Induk Mahasiswa)"
          iconname="card-outline"
          value={kirim.nim}
          onChangeText={x => setKirim({...kirim, nim: x})}
          placeholder="Masukkan NIM"
          keyboardType="numeric"
        />

        <MyInput
          label="Asal Perguruan Tinggi"
          iconname="school-outline"
          value={kirim.asal_perguruan_tinggi}
          onChangeText={x => setKirim({...kirim, asal_perguruan_tinggi: x})}
          placeholder="Masukkan asal perguruan tinggi"
        />

        <MyGap jarak={30} />

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Menyimpan perubahan...</Text>
          </View>
        ) : (
          <MyButton
            warna={colors.primary}
            colorText={colors.white}
            iconColor={colors.white}
            onPress={handleSave}
            title="Simpan Perubahan"
            Icons="save-outline"
          />
        )}
        
        <MyGap jarak={20} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
    marginBottom: 25,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 18,
    fontFamily: fonts.primary[700],
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    fontFamily: fonts.primary[400],
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 20,
  },
  loadingContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.primary[500],
    color: colors.primary,
  },
});