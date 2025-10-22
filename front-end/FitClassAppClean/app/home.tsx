import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Stack, router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMeuPerfil, getMinhasProximasAulas, Usuario, Agendamento } from '@/src/services/usuarioService';
import { removeToken } from '@/src/services/tokenService';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const HomeScreen = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [proximasAulas, setProximasAulas] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const perfilData = await getMeuPerfil();
          setUsuario(perfilData);
          // const aulasData = await getMinhasProximasAulas();
          // setProximasAulas(aulasData);
        } catch (error) {
          console.error("Erro ao carregar dados da home:", error);
          Alert.alert("Erro", "Não foi possível carregar seus dados.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  const handleLogout = async () => {
    await removeToken();
    router.replace("/");
  };

  const renderMinhaAulaCard = ({ item }: { item: Agendamento }) => (
    <View style={styles.smallCard}>
      <View>
        <Text style={styles.smallCardTitle}>{item.aulaNome}</Text>
        <Text style={styles.smallCardText}>{new Date(item.horario).toLocaleDateString('pt-BR')}</Text>
        <Text style={styles.smallCardText}>{new Date(item.horario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: '#A3E635' }]}>
        <Text style={styles.statusBadgeText}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSubtext}>Bem-vindo(a) de volta,</Text>
            <Text style={styles.headerText}>{loading ? "Carregando..." : usuario?.nome}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('./user/profile')}>
            <Ionicons name="person-circle-outline" size={48} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.mainActionCard} onPress={() => router.push('/aulas/browse')}>
          <MaterialCommunityIcons name="plus-circle" size={40} color="#FFF" />
          <Text style={styles.mainActionText}>Agendar Nova Aula</Text>
          <Text style={styles.mainActionSubtext}>Ver aulas disponíveis e garantir sua vaga.</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minhas Próximas Aulas</Text>
          {loading ? (
            <ActivityIndicator color="#FFF" style={{ alignSelf: 'center', marginTop: 10 }} />
          ) : (
            <FlatList
              data={proximasAulas}
              renderItem={renderMinhaAulaCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={<Text style={styles.emptyText}>Você ainda não agendou nenhuma aula.</Text>}
              contentContainerStyle={{ paddingLeft: 20 }}
            />
          )}
        </View>

        {usuario?.role === "ADMIN" && (
          <TouchableOpacity style={styles.adminButton} onPress={() => router.push("/admin/dashboard")}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#FFF" />
            <Text style={styles.adminButtonText}>Painel do Administrador</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1A1A1A' },
  container: { paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerSubtext: { color: '#AAA', fontSize: 16 },
  headerText: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  mainActionCard: {
    backgroundColor: '#A33E3E',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,
  },
  mainActionText: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  mainActionSubtext: { color: '#F0F0F0', fontSize: 14, marginTop: 5, textAlign: 'center' },
  section: { marginTop: 40 },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  smallCard: {
    backgroundColor: '#2B2727',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    width: 160,
    height: 140,
    justifyContent: 'space-between',
  },
  smallCardTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  smallCardText: { color: '#DDD', fontSize: 12, marginTop: 4 },
  statusBadge: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  statusBadgeText: { color: '#1A1A1A', fontSize: 10, fontWeight: 'bold' },
  emptyText: { color: '#888', fontStyle: 'italic', paddingLeft: 20 },
  adminButton: {
    backgroundColor: '#4A4A4A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 30,
  },
  adminButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 15,
  },
  logoutButtonText: { color: '#FF6B6B', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});

export default HomeScreen;
