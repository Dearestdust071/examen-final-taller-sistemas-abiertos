import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ChevronLeft, Save } from 'lucide-react-native';
import { createBook, getBookByISBN } from '../api/books';
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

  // Estado para controlar si estamos en modo detalle (lectura) o creación
  const [isDetailMode, setIsDetailMode] = useState(!!initialBook);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    author: '',
    isbn: '',
    releaseDate: new Date().toISOString().split('T')[0],
  });

  // Cargar datos iniciales si se pasa un objeto libro completo (navegación desde lista)
  useEffect(() => {
    if (initialBook) {
      setFormData({
        name: initialBook.name,
        author: initialBook.author,
        isbn: initialBook.isbn,
        releaseDate: initialBook.releaseDate,
      });
      setIsDetailMode(true);
    }
  }, [initialBook]);

  // Buscar libro si se pasa un ISBN escaneado
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
            });
            setIsDetailMode(true);
            Alert.alert('Libro Encontrado', 'El libro ya existe en el catálogo.');
          } else {
            // Si no existe, mantenemos el ISBN y permitimos crear
            setIsDetailMode(false);
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

  const handleSave = async () => {
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
      Alert.alert('Error', 'No se pudo registrar el libro. Verifica los datos o la conexión.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (searching) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2B3B45" />
        <Text style={styles.loadingText}>Buscando ISBN en el catálogo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft color="#FFF" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isDetailMode ? 'Detalle del Libro' : 'Nuevo Libro'}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>ISBN</Text>
          <TextInput
            style={[styles.input, isDetailMode && styles.disabledInput]}
            value={formData.isbn}
            onChangeText={(text) => setFormData({ ...formData, isbn: text })}
            placeholder="Ej. 9780307474728"
            editable={!isDetailMode}
            keyboardType="numeric"
          />
          {scannedISBN && !isDetailMode && (
            <Text style={styles.helperText}>✓ Código capturado por escáner (No registrado)</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={[styles.input, isDetailMode && styles.disabledInput]}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Título del libro"
            editable={!isDetailMode}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Autor</Text>
          <TextInput
            style={[styles.input, isDetailMode && styles.disabledInput]}
            value={formData.author}
            onChangeText={(text) => setFormData({ ...formData, author: text })}
            placeholder="Nombre del autor"
            editable={!isDetailMode}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Fecha de Publicación (YYYY-MM-DD)</Text>
          <TextInput
            style={[styles.input, isDetailMode && styles.disabledInput]}
            value={formData.releaseDate}
            onChangeText={(text) => setFormData({ ...formData, releaseDate: text })}
            placeholder="2024-01-01"
            editable={!isDetailMode}
          />
        </View>

        {!isDetailMode && (
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#2B3B45" />
            ) : (
              <>
                <Save color="#2B3B45" size={20} style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Registrar Libro</Text>
              </>
            )}
          </TouchableOpacity>
        )}
        
        {isDetailMode && (
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    Modo de solo lectura. Para modificar disponibilidad, usa la lista principal.
                </Text>
            </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#2B3B45',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#2B3B45',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
    color: '#333',
  },
  disabledInput: {
    backgroundColor: '#E9ECEF',
    color: '#666',
  },
  helperText: {
    color: '#4CAF50',
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#FFB700',
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: {
    color: '#2B3B45',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  infoText: {
    color: '#0D47A1',
    textAlign: 'center',
    fontSize: 14,
  }
});