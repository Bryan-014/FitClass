import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { Stack, router, useFocusEffect } from "expo-router";
import StyledButton from "@/src/components/StyledButton";
import {
  getMeuPerfil,
  getMinhasProximasAulas,
  Usuario,
  Agendamento,
} from "@/src/services/usuarioService";
import { removeToken } from "@/src/services/tokenService";

const HomeScreen = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [proximasAulas, setProximasAulas] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [perfilData, aulasData] = await Promise.all([
            getMeuPerfil(),
            getMinhasProximasAulas(),
          ]);
          setUsuario(perfilData);
          setProximasAulas(aulasData);
        } catch (error) {
          console.error("Erro ao carregar dados da home:", error);
          Alert.alert(
            "Erro",
            "Não foi possível carregar seus dados. Tente novamente."
          );
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

  const renderAulaCard = ({ item }: { item: Agendamento }) => (
    <View style={styles.classCard}>
      <Text style={styles.cardTitle}>{item.aulaNome}</Text>
      <Text style={styles.cardSubtitle}>
        {item.horario} com {item.instrutorNome}
      </Text>
      <Text style={styles.cardStatus}>Status: {item.status}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Início",
          headerStyle: { backgroundColor: "#2B2727" },
          headerTintColor: "#FFF",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerLeft: () => null,
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcomeText}>
          {loading ? "Carregando..." : `Bem-vindo(a), ${usuario?.nome || ""}!`}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suas Próximas Aulas</Text>
          {loading ? (
            <ActivityIndicator color="#FFF" size="large" />
          ) : (
            <FlatList
              data={proximasAulas}
              renderItem={renderAulaCard}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Você não tem nenhuma aula agendada.
                </Text>
              }
              scrollEnabled={false}
            />
          )}
        </View>

        {usuario?.role === "ADMIN" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gerenciamento</Text>
            <StyledButton
              onPress={() => router.push("/aulas")}
              style={{ marginBottom: 10 }}
            >
              Gerenciar Aulas
            </StyledButton>
            <StyledButton onPress={() => router.push("/instrutores")}>
              Gerenciar Instrutores
            </StyledButton>
          </View>
        )}

        <StyledButton
          variant="secondary"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Sair (Logout)
        </StyledButton>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2B2727" },
  container: { padding: 20, paddingBottom: 40 },
  welcomeText: {
    fontSize: 28,
    fontWeight: "300",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 30,
  },
  section: { marginBottom: 30 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 15,
  },
  classCard: {
    backgroundColor: "#4A4A4A",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
  cardSubtitle: { fontSize: 14, color: "#DDD", marginTop: 5 },
  cardStatus: {
    fontSize: 14,
    color: "#A3E635",
    fontWeight: "bold",
    marginTop: 10,
  },
  emptyText: {
    color: "#888",
    textAlign: "center",
    fontStyle: "italic",
    fontSize: 16,
  },
  logoutButton: { marginTop: 20, backgroundColor: "#A33E3E" },
});

export default HomeScreen;
