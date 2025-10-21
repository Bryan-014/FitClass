import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Stack, router, useFocusEffect } from 'expo-router';
import StyledButton from '@/src/components/StyledButton';
import { getAulas, Aula } from '@/src/services/aulaService';

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
    <TouchableOpacity style={styles.listItem} onPress={() => router.push(`/aulas/${item.id}`)}>
      <Text style={styles.listItemTitle}>{item.nome}</Text>
      <Text style={styles.listItemSubtitle}>{item.descricao || 'Sem descrição'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Gerenciar Aulas' }} />
      
      {loading && aulas.length === 0 ? (
        <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 20 }}/>
      ) : (
        <FlatList
          data={aulas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id!.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma aula encontrada.</Text>}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <View style={styles.footer}>
        <StyledButton variant="primary" onPress={() => router.push('/aulas/new')}>
          Adicionar Nova Aula
        </StyledButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2B2727', padding: 10 },
  listItem: { backgroundColor: '#4A4A4A', padding: 20, borderRadius: 8, marginBottom: 10 },
  listItemTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  listItemSubtitle: { color: '#DDD', fontSize: 14, marginTop: 5 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 50, fontSize: 16 },
  footer: { position: 'absolute', bottom: 20, left: 20, right: 20 },
});

export default ListaAulasScreen;