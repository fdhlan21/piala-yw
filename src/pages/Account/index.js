import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {fonts} from '../../utils/fonts';
import {
  MYAPP,
  storeData,
} from '../../utils/localStorage';
import {Color, colors} from '../../utils/colors';
import {MyButton, MyGap, MyHeader} from '../../components';
import {useIsFocused} from '@react-navigation/native';
import {ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ({navigation, route}) {
  // Dummy data mahasiswa
  const [user, setUser] = useState({
    nama: 'Yeni Witdianti',
    nim: '20230001',
    asal_perguruan_tinggi: 'Universitas Papua Barat Daya'
  });
  
  const isFocused = useIsFocused();
  const [open, setOpen] = useState(false);
  
  // State untuk progress tracking
  const [progressData, setProgressData] = useState({});
  const [overallStats, setOverallStats] = useState({
    totalModul: 5,
    modulSelesai: 0,
    totalProgress: 0
  });

  // Data modul sesuai dengan aplikasi PIALA-YW
  const modulList = [
    { key: 'eksposisi', title: 'Eksposisi', phases: 6 },
    { key: 'argumentatif', title: 'Argumentatif', phases: 6 },
    { key: 'opini_publik', title: 'Opini Publik', phases: 6 },
    { key: 'sastra_kontekstual', title: 'Sastra Kontekstual', phases: 6 },
    { key: 'ilmiah_populer', title: 'Ilmiah Populer', phases: 6 }
  ];

  // Load progress data dari AsyncStorage
  const loadProgressData = async () => {
    try {
      const progressStr = await AsyncStorage.getItem('modul_literasi_progress');
      if (progressStr) {
        const progress = JSON.parse(progressStr);
        setProgressData(progress);
        calculateOverallStats(progress);
      } else {
        // Dummy data jika belum ada progress
        const dummyProgress = {
          eksposisi: { progress: 83, completed: false, currentPhase: 5 },
          argumentatif: { progress: 100, completed: true, currentPhase: 6 },
          opini_publik: { progress: 50, completed: false, currentPhase: 3 },
          sastra_kontekstual: { progress: 16, completed: false, currentPhase: 1 },
          ilmiah_populer: { progress: 0, completed: false, currentPhase: 0 }
        };
        setProgressData(dummyProgress);
        calculateOverallStats(dummyProgress);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };

  // Hitung statistik keseluruhan
  const calculateOverallStats = (progress) => {
    let modulSelesai = 0;
    let totalProgress = 0;

    modulList.forEach(modul => {
      const modulProgress = progress[modul.key];
      if (modulProgress) {
        if (modulProgress.completed) {
          modulSelesai++;
        }
        totalProgress += modulProgress.progress || 0;
      }
    });

    setOverallStats({
      totalModul: modulList.length,
      modulSelesai,
      totalProgress: Math.round(totalProgress / modulList.length)
    });
  };

  useEffect(() => {
    if (isFocused) {
      // Simulasi loading dan load progress data
      setTimeout(() => {
        setOpen(true);
        console.log('Dummy user data:', user);
      }, 500);
      loadProgressData();
    }
  }, [isFocused]);

  const btnKeluar = () => {
    Alert.alert(MYAPP, 'Apakah kamu yakin akan keluar ?', [
      {
        text: 'Batal',
        style: 'cancel',
      },
      {
        text: 'Keluar',
        onPress: () => {
          storeData('user', null);

          navigation.reset({
            index: 0,
            routes: [{name: 'Splash'}],
          });
        },
      },
    ]);
  };

  const MyList = ({label, value}) => {
    return (
      <View
        style={{
          marginTop: 10,
        }}>
        <Text
          style={{
            fontFamily: fonts.primary[600],
            color: colors.primary,
            marginLeft: 10,
          }}>
          {label}
        </Text>

        <View
          style={{
            marginVertical: 2,
            padding: 5,
            paddingHorizontal: 10,
            backgroundColor: Color.blueGray[50],
            borderRadius: 30,
            height: 40,
          }}>
          <Text
            style={{
              ...fonts.body3,
              color: Color.blueGray[900],
            }}>
            {value}
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <MyHeader title="Akun Saya" onPress={() => navigation.goBack()} />
      {!open && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        {open && (
          <View
            style={{
              margin: 5,
              flex: 1,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}></View>
            <View style={{padding: 10}}>
              <MyList label="Nama" value={user.nama} />
              <MyList label="NIM" value={user.nim} />
              <MyList label="Asal Perguruan Tinggi" value={user.asal_perguruan_tinggi} />
              
              {/* Progress Section sesuai dengan PIALA-YW */}
              <View style={{marginTop: 25}}>
                <Text style={{
                  fontFamily: fonts.primary[600],
                  color: colors.primary,
                  fontSize: 16,
                  marginBottom: 15,
                  textAlign: 'center'
                }}>Pelacakan Kemajuan Pembelajaran</Text>
                
                {/* Overall Stats */}
                <View style={{
                  backgroundColor: Color.blueGray[50],
                  borderRadius: 15,
                  padding: 15,
                  marginBottom: 15
                }}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    <View style={{alignItems: 'center'}}>
                      <Text style={{
                        fontSize: 20,
                        fontFamily: fonts.primary[700],
                        color: colors.primary
                      }}>{overallStats.modulSelesai}</Text>
                      <Text style={{
                        fontSize: 12,
                        fontFamily: fonts.primary[400],
                        color: Color.blueGray[600],
                        textAlign: 'center'
                      }}>Modul Selesai</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                      <Text style={{
                        fontSize: 20,
                        fontFamily: fonts.primary[700],
                        color: colors.primary
                      }}>{overallStats.totalProgress}%</Text>
                      <Text style={{
                        fontSize: 12,
                        fontFamily: fonts.primary[400],
                        color: Color.blueGray[600],
                        textAlign: 'center'
                      }}>Progress Keseluruhan</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                      <Text style={{
                        fontSize: 20,
                        fontFamily: fonts.primary[700],
                        color: colors.primary
                      }}>{overallStats.totalModul}</Text>
                      <Text style={{
                        fontSize: 12,
                        fontFamily: fonts.primary[400],
                        color: Color.blueGray[600],
                        textAlign: 'center'
                      }}>Total Modul</Text>
                    </View>
                  </View>
                </View>

                {/* Progress per Modul */}
                {modulList.map((modul, index) => {
                  const modulProgress = progressData[modul.key] || { progress: 0, completed: false, currentPhase: 0 };
                  const statusColor = modulProgress.completed ? '#27ae60' : 
                                    modulProgress.progress > 0 ? '#f39c12' : '#95a5a6';
                  const statusText = modulProgress.completed ? 'Selesai' : 
                                   modulProgress.progress > 0 ? `Fase ${modulProgress.currentPhase}/6` : 'Belum Mulai';

                  return (
                    <View key={index} style={{
                      backgroundColor: 'white',
                      borderRadius: 12,
                      padding: 12,
                      marginBottom: 10,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View style={{flex: 1}}>
                          <Text style={{
                            fontFamily: fonts.primary[600],
                            color: Color.blueGray[900],
                            fontSize: 14
                          }}>{modul.title}</Text>
                          <Text style={{
                            fontSize: 12,
                            color: statusColor,
                            fontFamily: fonts.primary[500],
                            marginTop: 2
                          }}>{statusText}</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                          <View style={{
                            width: 80,
                            height: 6,
                            backgroundColor: Color.blueGray[200],
                            borderRadius: 3,
                            marginBottom: 4
                          }}>
                            <View style={{
                              width: `${modulProgress.progress}%`,
                              height: '100%',
                              backgroundColor: statusColor,
                              borderRadius: 3
                            }} />
                          </View>
                          <Text style={{
                            fontSize: 12,
                            color: Color.blueGray[600],
                            fontFamily: fonts.primary[500]
                          }}>{modulProgress.progress}%</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
            {/* data detail */}
          </View>
        )}
        <View
          style={{
            padding: 20,
          }}>
          <MyButton
            warna={colors.primary}
            title="Edit Profile"
            onPress={() => navigation.navigate('AccountEdit', user)}
          />
          <MyGap jarak={10} />
          <MyButton
            onPress={btnKeluar}
            warna={Color.blueGray[400]}
            title="Log Out"
            iconColor={colors.white}
            colorText={colors.white}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});