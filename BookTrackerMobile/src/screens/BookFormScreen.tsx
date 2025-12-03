import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ChevronLeft, Save, RefreshCw } from 'lucide-react-native';
import { createBook, getBookByISBN, toggleAvailability } from '../api/books';
import { Book } from '../types/Book';

type RootStackParamList = {
  BookList: undefined;
  BookForm: { book?: Book; scannedISBN?: string };
};

type BookFormRouteProp = RouteProp<RootStackParamList, 'BookForm'>;

export const BookFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<BookFormRouteProp>();
  const { book: initialBook, scannedISBN } = route.params || {};

  const [isDetailMode, setIsDetailMode] = useState(!!initialBook);
  const [currentBookId, setCurrentBookId] = useState<number | null>(initialBook?.id || null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    author: '',
    isbn: scannedISBN || '',
    releaseDate: new Date().toISOString().split('T')[0],
    availability: true, // Default true for new books
  });

  // Cargar datos si viene de la lista
  useEffect(() => {
    if (initialBook) {
      setFormData({
        name: initialBook.name,
        author: initialBook.author,
        isbn: initialBook.isbn,
        releaseDate: initialBook.releaseDate,
        availability: initialBook.availability,
      });
      setCurrentBookId(initialBook.id);
      setIsDetailMode(true);
    }
  }, [initialBook]);

  // Buscar por ISBN si viene del escáner
  useEffect(() => {
    const fetchByISBN = async () => {
      if (scannedISBN) {
        setFormData(prev => ({ ...prev, isbn: scannedISBN }));
        setSearching(true);
        try {
          const foundBook = await getBookByISBN(scannedISBN);
          if (foundBook) {
            setFormData({
              name: foundBook.name,
              author: foundBook.author,
              isbn: foundBook.isbn,
              releaseDate: foundBook.releaseDate,
              availability: foundBook.availability,
            });
            setCurrentBookId(foundBook.id);
            setIsDetailMode(true);
            Alert.alert('Libro Encontrado', 'El libro ya está registrado en el sistema.');
          } else {
            setIsDetailMode(false); // No existe, modo creación
            setCurrentBookId(null);
          }
        } catch (error) {
          console.log('Error buscando libro', error);
        } finally {
          setSearching(false);
        }
      }
    };

    fetchByISBN();
  }, [scannedISBN]);

  const handleSaveNew = async () => {
    if (!formData.name || !formData.author || !formData.isbn || !formData.releaseDate) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await createBook(formData);
      Alert.alert('Éxito', 'Libro registrado correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el libro.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!currentBookId) return;
    
    setLoading(true);
    try {
      // Llamada al endpoint PATCH para cambiar disponibilidad
      const updatedBook = await toggleAvailability(currentBookId);
      
      // Actualizar estado local
      setFormData(prev => ({ ...prev, availability: updatedBook.availability }));
      
      const statusMessage = updatedBook.availability ? 'DISPONIBLE' : 'NO DISPONIBLE';
      Alert.alert('Estado Actualizado', `El libro ahora está ${statusMessage}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado del libro.');
    } finally {
      setLoading(false);
    }
  };

  if (searching) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2B3B45" />
        <Text style={styles.loadingText}>Verificando catálogo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft color="#FFF" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isDetailMode ? 'Gestión de Préstamo' : 'Registrar Nuevo Libro'}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>ISBN</Text>
            <TextInput
              style={[styles.input, isDetailMode && styles.readOnlyInput]}
              value={formData.isbn}
              onChangeText={(text) => setFormData({ ...formData, isbn: text })}
              placeholder="ISBN"
              editable={!isDetailMode}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Título</Text>
            <TextInput
              style={[styles.input, isDetailMode && styles.readOnlyInput]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Título"
              editable={!isDetailMode}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Autor</Text>
            <TextInput
              style={[styles.input, isDetailMode && styles.readOnlyInput]}
              value={formData.author}
              onChangeText={(text) => setFormData({ ...formData, author: text })}
              placeholder="Autor"
              editable={!isDetailMode}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Fecha Lanzamiento</Text>
            <TextInput
              style={[styles.input, isDetailMode && styles.readOnlyInput]}
              value={formData.releaseDate}
              onChangeText={(text) => setFormData({ ...formData, releaseDate: text })}
              placeholder="YYYY-MM-DD"
              editable={!isDetailMode}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Estado Actual</Text>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: formData.availability ? '#E8F5E9' : '#FFEBEE' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: formData.availability ? '#2E7D32' : '#C62828' }
              ]}>
                {formData.availability ? 'DISPONIBLE EN BIBLIOTECA' : 'PRESTADO / NO DISPONIBLE'}
              </Text>
            </View>
          </View>
        </View>

        {/* Acciones Dependiendo del Modo */}
        {isDetailMode ? (
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              { backgroundColor: formData.availability ? '#FFB700' : '#2B3B45' }
            ]} 
            onPress={handleToggleStatus}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={formData.availability ? '#2B3B45' : '#FFF'} />
            ) : (
              <>
                <RefreshCw color={formData.availability ? '#2B3B45' : '#FFF'} size={20} style={{ marginRight: 10 }} />
                <Text style={[
                  styles.actionButtonText,
                  { color: formData.availability ? '#2B3B45' : '#FFF' }
                ]}>
                  {formData.availability ? 'PRESTAR LIBRO (Marcar No Disponible)' : 'DEVOLVER LIBRO (Marcar Disponible)'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#FFB700' }]} 
            onPress={handleSaveNew}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#2B3B45" />
            ) : (
              <>
                <Save color="#2B3B45" size={20} style={{ marginRight: 10 }} />
                <Text style={[styles.actionButtonText, { color: '#2B3B45' }]}>
                  Guardar Nuevo Libro
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' },
  header: {
    backgroundColor: '#2B3B45',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 4 },
  content: { padding: 20 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 13, color: '#666', marginBottom: 6, fontWeight: '600', textTransform: 'uppercase' },
  input: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
    color: '#333',
  },
  readOnlyInput: {
    backgroundColor: '#F0F2F5',
    color: '#555',
    borderColor: 'transparent',
  },
  statusBadge: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionButton: {
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});