import StyledButton from '@/src/components/StyledButton';
import { getInstrutores, Instrutor } from '@/src/services/instrutorService';
import { router, Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ListaInstrutoresScreen = () => {
  const [instrutores, setInstrutores] = useState<Instrutor[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchInstrutores = async () => {
        setLoading(true);
        try {
          const data = await getInstrutores();
          setInstrutores(data);
        } catch (error) {
          console.error("Erro ao buscar instrutores:", error);
          Alert.alert("Erro", "Não foi possível carregar a lista de instrutores.");
        } finally {
          setLoading(false);
        }
      };
      fetchInstrutores();
    }, [])
  );

  const renderItem = ({ item }: { item: Instrutor }) => (
    <TouchableOpacity style={styles.listItem} onPress={() => router.push(`/instrutores/${item.id}`)}>
      <Text style={styles.listItemTitle}>{item.nome}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Gerenciar Instrutores',
          headerStyle: { backgroundColor: '#2B2727' },
          headerTintColor: '#FFF',
          headerTitleAlign: 'center',
        }}
      />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 20 }}/>
        ) : (
          <FlatList
            data={instrutores}
            renderItem={renderItem}
            keyExtractor={(item) => item.id!.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum instrutor encontrado.</Text>}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}

        <View style={styles.footer}>
          <StyledButton variant="primary" onPress={() => router.push('/instrutores/new')}>
            Adicionar Novo Instrutor
          </StyledButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#2B2727' },
  container: { flex: 1, padding: 10 },
  listItem: {
    backgroundColor: '#4A4A4A',
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  listItemTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listItemSubtitle: {
    color: '#DDD',
    fontSize: 14,
    marginTop: 5,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default ListaInstrutoresScreen;