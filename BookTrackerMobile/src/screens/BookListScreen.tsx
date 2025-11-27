
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Plus, Camera } from 'lucide-react-native';
import { getBooks, toggleAvailability } from '../api/books';
import { Book } from '../types/Book';

export const BookListScreen = () => {
  const navigation = useNavigation<any>();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      console.error('Error cargando libros:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [])
  );

  const handleToggle = async (id: number) => {
    try {
      await toggleAvailability(id);
      loadBooks(); // Recargar para ver el cambio actualizado
    } catch (error) {
      console.error('Error actualizando disponibilidad:', error);
    }
  };

  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BookForm', { book: item })}
    >
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text style={styles.bookTitle} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
          <Text style={styles.bookIsbn}>ISBN: {item.isbn}</Text>
        </View>
        <TouchableOpacity onPress={() => handleToggle(item.id)}>
            <View style={[styles.availabilityBadge, { backgroundColor: item.availability ? '#4CAF50' : '#F44336' }]}>
                <Text style={styles.availabilityText}>{item.availability ? 'Disp.' : 'No Disp.'}</Text>
            </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2B3B45" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BookTracker</Text>
        <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('BookForm')}
        >
          <Plus color="#FFF" size={24} />
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#2B3B45" />
        </View>
      ) : (
        <FlatList
            data={books}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyText}>No hay libros registrados</Text>}
            refreshing={loading}
            onRefresh={loadBooks}
        />
      )}

      {/* FAB Scanner */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Scanner')}
      >
        <Camera color="#2B3B45" size={24} />
        <Text style={styles.fabText}>Escanear ISBN</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#2B3B45',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B3B45',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  bookIsbn: {
    fontSize: 12,
    color: '#999',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#FFB700',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: '#2B3B45',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
    fontSize: 16,
  },
});