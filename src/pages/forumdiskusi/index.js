import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../../utils'
import { MyHeader } from '../../components'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default function ForumDiskusi() {
  const [selectedModule, setSelectedModule] = useState('semua')
  const [newPost, setNewPost] = useState('')
  const [showNewPostForm, setShowNewPostForm] = useState(false)
  const [discussions, setDiscussions] = useState([
    {
      id: '1',
      module: 'Eksposisi',
      title: 'Refleksi tentang #SaveRajaAmpat',
      author: 'Lince Laura A.',
      timestamp: '2 jam lalu',
      content: 'Saya merasa prihatin dengan ancaman terhadap Raja Ampat. Lingkungan yang indah dan penting bagi masyarakat seharusnya dijaga, bukan dieksploitasi. Saya memahami bahwa tambang bisa memberikan penghasilan, tapi kerugian ekologisnya jauh lebih besar.',
      replies: [
        {
          id: 'r1',
          author: 'Andi Wijaya',
          timestamp: '1 jam lalu',
          content: 'Setuju dengan pendapat kamu. Kerusakan lingkungan tidak sebanding dengan keuntungan ekonomi. Kita memang perlu sumber daya, tapi harus ada batas agar alam tetap lestari.'
        }
      ]
    },
    {
      id: '2',
      module: 'Argumentasi',
      title: 'Program Makan Siang Gratis - Perspektif Mahasiswa',
      author: 'Rika Sari M.',
      timestamp: '5 jam lalu',
      content: 'Saya sangat mendukung program makan siang gratis di Papua. Anak-anak yang belajar dalam kondisi lapar sulit memahami pelajaran. Dengan makan siang bergizi, mereka punya energi untuk belajar dan berkembang.',
      replies: [
        {
          id: 'r2',
          author: 'Jefry Yoman',
          timestamp: '4 jam lalu',
          content: 'Wah bagus sekali pendapatmu, Rika. Aku setuju bahwa keterlibatan orang tua itu penting. Mungkin program ini juga bisa melibatkan UMKM lokal agar lebih berdampak luas.'
        }
      ]
    },
    {
      id: '3',
      module: 'Sastra',
      title: 'Makna "Di Antara Tifa dan Wi-Fi"',
      author: 'Intan Sari',
      timestamp: '1 hari lalu',
      content: 'Cerpen ini membuat saya sadar bahwa belajar tidak selalu butuh fasilitas sempurna. Semangat dan dukungan orang terdekat justru menjadi kekuatan terbesar. Ayah Lince mengingatkan saya pada orang tua saya.',
      replies: [
        {
          id: 'r3',
          author: 'Joni Mambrasar',
          timestamp: '1 hari lalu',
          content: 'Cerita kamu menyentuh, Intan. Aku juga belajar dari Lince bahwa tidak semua perjuangan harus besar, yang kecil tapi konsisten justru berharga.'
        }
      ]
    }
  ])

  const modules = [
    { key: 'semua', label: 'Semua Modul' },
    { key: 'Eksposisi', label: 'Eksposisi' },
    { key: 'Argumentasi', label: 'Argumentasi' },
    { key: 'Opini', label: 'Opini Publik' },
    { key: 'Sastra', label: 'Sastra Lokal' },
    { key: 'Ilmiah', label: 'Ilmiah Populer' }
  ]

  const filteredDiscussions = selectedModule === 'semua' 
    ? discussions 
    : discussions.filter(item => item.module === selectedModule)

  const handleNewPost = () => {
    if (newPost.trim() === '') {
      Alert.alert('Peringatan', 'Silakan tulis refleksi Anda terlebih dahulu')
      return
    }

    const newDiscussion = {
      id: Date.now().toString(),
      module: selectedModule === 'semua' ? 'Umum' : selectedModule,
      title: `Refleksi - ${newPost.substring(0, 30)}...`,
      author: 'Anda',
      timestamp: 'Baru saja',
      content: newPost,
      replies: []
    }

    setDiscussions([newDiscussion, ...discussions])
    setNewPost('')
    setShowNewPostForm(false)
    Alert.alert('Berhasil', 'Refleksi Anda telah dibagikan ke forum!')
  }

  const DiscussionItem = ({ item }) => (
    <View style={styles.discussionCard}>
      <View style={styles.discussionHeader}>
        <View style={styles.moduleTag}>
          <Text style={styles.moduleText}>{item.module}</Text>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      
      <Text style={styles.discussionTitle}>{item.title}</Text>
      <Text style={styles.authorName}>oleh {item.author}</Text>
      <Text style={styles.discussionContent}>{item.content}</Text>
      
      <View style={styles.discussionFooter}>
        <TouchableOpacity style={styles.replyButton}>
          <Icon name="reply" size={16} color={colors.primary} />
          <Text style={styles.replyText}>Tanggapi ({item.replies.length})</Text>
        </TouchableOpacity>
      </View>

      {item.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {item.replies.map(reply => (
            <View key={reply.id} style={styles.replyItem}>
              <Text style={styles.replyAuthor}>{reply.author}</Text>
              <Text style={styles.replyTimestamp}>{reply.timestamp}</Text>
              <Text style={styles.replyContent}>{reply.content}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      <MyHeader title="Forum Diskusi" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Module Filter */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {modules.map(module => (
              <TouchableOpacity
                key={module.key}
                style={[
                  styles.filterButton,
                  selectedModule === module.key && styles.filterButtonActive
                ]}
                onPress={() => setSelectedModule(module.key)}
              >
                <Text style={[
                  styles.filterText,
                  selectedModule === module.key && styles.filterTextActive
                ]}>
                  {module.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* New Post Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.newPostButton}
            onPress={() => setShowNewPostForm(!showNewPostForm)}
          >
            <Icon name="add" size={20} color={colors.white} />
            <Text style={styles.newPostButtonText}>Bagikan Refleksi</Text>
          </TouchableOpacity>
        </View>

        {/* New Post Form */}
        {showNewPostForm && (
          <View style={styles.newPostForm}>
            <Text style={styles.formTitle}>Bagikan Refleksi Anda</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Tuliskan refleksi atau tanggapan Anda tentang modul yang telah dipelajari..."
              multiline
              numberOfLines={4}
              value={newPost}
              onChangeText={setNewPost}
              textAlignVertical="top"
            />
            <View style={styles.formActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setShowNewPostForm(false)
                  setNewPost('')
                }}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleNewPost}
              >
                <Text style={styles.submitButtonText}>Bagikan</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Discussion Info */}
        <View style={styles.infoContainer}>
          <Icon name="info" size={16} color={colors.primary} />
          <Text style={styles.infoText}>
            Bagikan refleksi dan tanggapi pendapat teman untuk memperdalam pemahaman
          </Text>
        </View>

        {/* Discussions List */}
        <View style={styles.discussionsContainer}>
          {filteredDiscussions.map(item => (
            <DiscussionItem key={item.id} item={item} />
          ))}
        </View>

        {filteredDiscussions.length === 0 && (
          <View style={styles.emptyContainer}>
            <Icon name="forum" size={48} color={colors.border} />
            <Text style={styles.emptyText}>Belum ada diskusi untuk modul ini</Text>
            <Text style={styles.emptySubtext}>Jadilah yang pertama membagikan refleksi!</Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: colors.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  filterText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500'
  },
  filterTextActive: {
    color: colors.white
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  newPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8
  },
  newPostButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600'
  },
  newPostForm: {
    margin: 20,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.white,
    fontSize: 14,
    color: colors.text,
    minHeight: 100
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 14
  },
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 6
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600'
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 12,
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
    gap: 8
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.primary,
    lineHeight: 18
  },
  discussionsContainer: {
    paddingHorizontal: 20
  },
  discussionCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  discussionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  moduleTag: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  moduleText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500'
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary
  },
  discussionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4
  },
  authorName: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 8
  },
  discussionContent: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12
  },
  discussionFooter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  replyText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500'
  },
  repliesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  replyItem: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  replyAuthor: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2
  },
  replyTimestamp: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4
  },
  replyContent: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    fontWeight: '500'
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center'
  }
}