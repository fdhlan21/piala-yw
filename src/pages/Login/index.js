import {View, Text} from 'react-native';
import React from 'react';
import {colors, fonts, windowWidth} from '../../utils';
import {useToast} from 'react-native-toast-notifications';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import {MyButton, MyGap, MyInput} from '../../components';
import {useState} from 'react';
import SoundPlayer from 'react-native-sound-player';
import axios from 'axios';
import {apiURL, storeData} from '../../utils/localStorage';
import MyLoading from '../../components/MyLoading';
import {TouchableOpacity} from 'react-native';
import { Image } from 'react-native';

export default function Login({navigation, route}) {
  const [kirim, setKirim] = useState({
    fullname:'',
    nim:'',
    pengguruan_tinggi:'',
    password: '',
  });

  const toast = useToast();
  const updateKirim = (x, v) => {
    setKirim({
      ...kirim,
      [x]: v,
    });
  };
  
  const [loading, setLoading] = useState(false);
  
  const sendData = () => {
    // Perbaikan: ganti kirim.username menjadi kirim.fullname atau field yang sesuai untuk login
    if (kirim.fullname.length == 0) {
      toast.show('Nama lengkap masih kosong !');
    } else if (kirim.nim.length == 0) {
      toast.show('NIM masih kosong !');
    } else if (kirim.pengguruan_tinggi.length == 0) {
      toast.show('Perguruan tinggi masih kosong !');
    } else if (kirim.password.length == 0) {
      toast.show('Kata sandi masih kosong !');
    } else {
      console.log(kirim);
      setLoading(true);
      axios.post(apiURL + 'login', kirim).then(res => {
        setTimeout(() => {
          setLoading(false);
          if (res.data.status == 200) {
            storeData('user', res.data.data);
            navigation.replace('MainApp');
          } else {
            toast.show(res.data.message);
          }
        }, 700);
      }).catch(error => {
        setLoading(false);
        toast.show('Terjadi kesalahan koneksi');
        console.error('Login error:', error);
      });
    }
  };

  return (
    <View
      style={{flex: 1, backgroundColor: colors.white, flexDirection: 'column'}}>
      <View
        style={{
          flex: 0.5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../assets/logo.png')}
          style={{
            width: 180,
            height: 180,
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          backgroundColor: colors.white,
          paddingHorizontal: 20,
          top:-40
        }}>
        <Text
          style={{
            marginBottom: 20,
            fontFamily: fonts.secondary[800],
            fontSize: 20,
          }}>
          Masuk
        </Text>

        <MyInput
          value={kirim.fullname}
          onChangeText={x => updateKirim('fullname', x)}
          label="Nama Lengkap"
          placeholder="Masukan Nama Lengkap"
          iconname="person-outline"
        />

        <MyInput
          value={kirim.nim}
          onChangeText={x => updateKirim('nim', x)}
          label="NIM"
          placeholder="Masukan NIM"
          iconname="map-outline"
        />

        <MyInput
          value={kirim.pengguruan_tinggi}
          onChangeText={x => updateKirim('pengguruan_tinggi', x)}
          label="Perguruan Tinggi"
          placeholder="Masukan Perguruan Tinggi"
          iconname="school-outline"
        />

        <MyInput
          value={kirim.password}
          onChangeText={x => updateKirim('password', x)}
          label="Kata Sandi"
          placeholder="Masukan kata sandi"
          iconname="lock-closed-outline"
          secureTextEntry
        />
        
        <MyGap jarak={20} />
        
        {!loading && <MyButton onPress={sendData} title="MASUK" />}
        {loading && <MyLoading />}
        
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={{
            marginTop: 10,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 15,
          }}>
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              fontSize: 14,
            }}>
            Belum punya akun ?{' '}
            <Text
              style={{
                color: colors.primary,
                fontFamily: fonts.secondary[800],
              }}>
              Daftar disini
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}