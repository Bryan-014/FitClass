import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Stack, router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMeuPerfil, Usuario } from "@/src/services/usuarioService";
import {
  getMinhasProximasAulas,
  Agendamento,
} from "@/src/services/agendamentoService";
import { getMinhasAulasInstrutor, Aula } from "@/src/services/aulaService";
import { removeToken } from "@/src/services/tokenService";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const HomeScreen = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [aulasAluno, setAulasAluno] = useState<Agendamento[]>([]);
  const [aulasInstrutor, setAulasInstrutor] = useState<Aula[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const perfilData = await getMeuPerfil();
          console.log("PERFIL RECEBIDO DA API:", perfilData);
          setUsuario(perfilData);

          if (perfilData.role === "ALUNO") {
            const aulasData = await getMinhasProximasAulas();
            setAulasAluno(aulasData);
          } else if (perfilData.role === "INSTRUTOR") {
            const aulasInstrutorData = await getMinhasAulasInstrutor();
            setAulasInstrutor(aulasInstrutorData);
          }
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

  const renderMinhaAulaCard = ({ item }: { item: Agendamento }) => {
    const dataHora = new Date(item.aula.dataHora);
    const dataValida = dataHora.toString() !== "Invalid Date";

    return (
      <TouchableOpacity
        style={styles.smallCard}
        onPress={() => router.push(`/agendamentos/${item.id}`)}
      >
        <View>
          <Text style={styles.smallCardTitle}>{item.aula.nome}</Text>
          <Text style={styles.smallCardText}>
            {dataValida
              ? dataHora.toLocaleDateString("pt-BR")
              : "Data Indefinida"}
          </Text>
          <Text style={styles.smallCardText}>
            {dataValida
              ? dataHora.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Horário Indefinido"}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: "#A3E635" }]}>
          <Text style={styles.statusBadgeText}>{item.status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderAulaInstrutorCard = ({ item }: { item: Aula }) => {
    const dataHora = new Date(item.dataHora);
    const dataValida = dataHora.toString() !== "Invalid Date";

    return (
      <TouchableOpacity
        style={styles.cardInstrutor}
        onPress={() => router.push(`/instrutores/chamada/${item.id}`)}
      >
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.nome}</Text>
          <Text style={styles.cardSubtitle}>{item.descricao}</Text>
          <Text style={styles.cardSubtitle}>
            {dataValida
              ? dataHora.toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })
              : "Data/Hora Indefinida"}
          </Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={24} color="#555" />
      </TouchableOpacity>
    );
  };

  const renderRoleSpecificContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color="#FFF"
          style={{ alignSelf: "center", marginTop: 40 }}
        />
      );
    }

    if (usuario?.role === "ALUNO") {
      return (
        <>
          <TouchableOpacity
            style={styles.mainActionCard}
            onPress={() => router.push("/aulas/browse")}
          >
            <MaterialCommunityIcons name="plus-circle" size={40} color="#FFF" />
            <Text style={styles.mainActionText}>Agendar Nova Aula</Text>
            <Text style={styles.mainActionSubtext}>
              Ver aulas disponíveis e garantir sua vaga.
            </Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minhas Próximas Aulas</Text>
            <FlatList
              data={aulasAluno}
              renderItem={renderMinhaAulaCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Você ainda não agendou nenhuma aula.
                </Text>
              }
              contentContainerStyle={{ paddingLeft: 20 }}
            />
          </View>
        </>
      );
    }

    if (usuario?.role === "INSTRUTOR") {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suas Próximas Aulas</Text>
          <FlatList
            data={aulasInstrutor}
            renderItem={renderAulaInstrutorCard}
            keyExtractor={(item) => item.id!.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Você não tem nenhuma aula agendada.
              </Text>
            }
            contentContainerStyle={{ paddingHorizontal: 20 }}
            scrollEnabled={false}
          />
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSubtext}>Bem-vindo(a) de volta,</Text>
            <Text style={styles.headerText}>
              {loading ? "Carregando..." : usuario?.nome}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/user/profile")}>
            <Ionicons name="person-circle-outline" size={48} color="white" />
          </TouchableOpacity>
        </View>

        {renderRoleSpecificContent()}

        {usuario?.role === "ADMIN" && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => router.push("/admin/dashboard")}
          >
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
  safeArea: { flex: 1, backgroundColor: "#1A1A1A" },
  container: { paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerSubtext: { color: "#AAA", fontSize: 16 },
  headerText: { color: "#FFF", fontSize: 28, fontWeight: "bold" },
  mainActionCard: {
    backgroundColor: "#A33E3E",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  mainActionText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  mainActionSubtext: {
    color: "#F0F0F0",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  section: { marginTop: 40 },
  sectionTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  smallCard: {
    backgroundColor: "#2B2727",
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    width: 160,
    height: 140,
    justifyContent: "space-between",
  },
  smallCardTitle: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  smallCardText: { color: "#DDD", fontSize: 12, marginTop: 4 },
  statusBadge: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
  },
  statusBadgeText: { color: "#1A1A1A", fontSize: 10, fontWeight: "bold" },
  emptyText: {
    color: "#888",
    fontStyle: "italic",
    paddingLeft: 20,
    textAlign: "center",
  },
  cardInstrutor: {
    backgroundColor: "#2B2727",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  cardTextContainer: { flex: 1, marginRight: 10 },
  cardTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  cardSubtitle: { color: "#AAA", fontSize: 14, marginTop: 4 },
  adminButton: {
    backgroundColor: "#4A4A4A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 30,
  },
  adminButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginHorizontal: 20,
    marginTop: 15,
  },
  logoutButtonText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default HomeScreen;
