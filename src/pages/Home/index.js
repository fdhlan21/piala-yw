import {StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, TouchableNativeFeedback} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, fonts} from '../../utils';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { Image } from 'react-native';

const {width} = Dimensions.get('window');

export default function Home({navigation}) {
  const [user] = useState({});
  
  const menus = [
    {
      id: 1,
      title: 'Modul Literasi Membaca',
      icon: require('../../assets/book.png'),
      route: 'ModulLiterasi'
    },
    {
      id: 2,
      title: 'Latihan & Refleksi',
      icon: require('../../assets/latihan.png'),
      route: 'LatihanRefleksi'
    },
    {
      id: 3,
      title: 'Forum Diskusi',
      icon: require('../../assets/diskusi.png'),
      route: 'ForumDiskusi'
    },
    {
      id: 4,
      title: 'Tentan Aplikasi',
      icon: require('../../assets/info.png'),
      route: 'TentangAplikasi'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1E2A38', '#ffffff']}
        style={styles.headerGradient}
        start={{x: 0, y: 0}}
        end={{x: 1.2, y: 0}}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Selamat datang,</Text>
            <Text style={styles.greetingText}>{user.nama_lengkap || 'User'}</Text>
          </View>
          <FastImage
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>

        <View style={styles.menuContainer}>
          {/* First Row - 2 Menus */}
          <View style={styles.menuRow}>
            {menus.slice(0, 2).map((menu) => (
              <TouchableNativeFeedback 
                key={menu.id}
                onPress={() => navigation.navigate(menu.route)}>
                <View style={styles.menuItem}>
                  <Image style={styles.menuIcon} source={menu.icon} />
                  <Text style={styles.menuText}>{menu.title}</Text>
                </View>
              </TouchableNativeFeedback>
            ))}
          </View>
          
          {/* Second Row - 2 Menus */}
          <View style={styles.menuRow}>
            {menus.slice(2, 4).map((menu) => (
              <TouchableNativeFeedback 
                key={menu.id}
                onPress={() => navigation.navigate(menu.route)}>
                <View style={styles.menuItem}>
                  <Image style={styles.menuIcon} source={menu.icon} />
                  <Text style={styles.menuText}>{menu.title}</Text>
                </View>
              </TouchableNativeFeedback>
            ))}
          </View>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerGradient: {
    paddingBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    top: 10
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  greetingText: {
    fontFamily: fonts.secondary[600],
    fontSize: 20,
    color: 'white',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  menuContainer: {
    padding: 20,
    alignItems: 'center',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  singleMenuRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuItem: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.primary,
    width: '48%', // Slightly less than half to account for space-between
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    width: 80,
    height: 80,
    alignSelf: 'center'
  },
  menuText: {
    color: colors.white,
    fontFamily: fonts.primary[600],
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10
  },
  productsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 80
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  productInfo: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignSelf: 'stretch',
  },
  productName: {
    fontFamily: fonts.secondary[700],
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  productPrice: {
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
});