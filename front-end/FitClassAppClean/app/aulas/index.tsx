import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Stack, router, useFocusEffect } from 'expo-router';
import { getAulas, Aula } from '@/src/services/aulaService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ListaAulasScreen = () => {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchAulas = async () => {
        setLoading(true);
        try {
          const data = await getAulas();
          setAulas(data);
        } catch (error) {
          Alert.alert("Erro", "Não foi possível carregar a lista de aulas.");
        } finally {
          setLoading(false);
        }
      };
      fetchAulas();
    }, [])
  );

  const renderItem = ({ item }: { item: Aula }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/aulas/${item.id}`)}>
      <Ionicons name="barbell-outline" size={40} color="#A33E3E" />
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.nome}</Text>
        <Text style={styles.cardSubtitle}>Instrutor: {item.instrutor.nome}</Text>
        <Text style={styles.cardSubtitle}>
            {new Date(item.dataHora).toLocaleDateString('pt-BR')} às {new Date(item.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={24} color="#555" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aulas</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFF" style={{ flex: 1 }}/>
      ) : (
        <FlatList
          data={aulas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id!.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma aula cadastrada.</Text>}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/aulas/new')}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1A1A1A' },
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#2B2727'
  },
  backButton: { padding: 8 },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  card: {
    backgroundColor: '#2B2727',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTextContainer: { flex: 1, marginLeft: 15 },
  cardTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  cardSubtitle: { color: '#AAA', fontSize: 14, marginTop: 4 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 50, fontSize: 16, fontStyle: 'italic' },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 25,
    bottom: 25,
    backgroundColor: '#A33E3E',
    borderRadius: 30,
    elevation: 8,
  },
});

export default ListaAulasScreen;