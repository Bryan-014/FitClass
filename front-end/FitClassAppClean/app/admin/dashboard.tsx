import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const AdminDashboardScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Painel Admin</Text>
                    <View style={{ width: 40 }} /> 
                </View>

                <Text style={styles.subtitle}>
                    Selecione um módulo para gerenciar os dados do sistema.
                </Text>

                <TouchableOpacity style={styles.card} onPress={() => router.push('/aulas')}>
                    <Ionicons name="barbell-outline" size={32} color="#A33E3E" />
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>Gerenciar Aulas</Text>
                        <Text style={styles.cardSubtitle}>Crie, edite e visualize todas as aulas.</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={24} color="#555" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={() => router.push('/instrutores')}>
                    <Ionicons name="clipboard-outline" size={32} color="#A33E3E" />
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>Gerenciar Instrutores</Text>
                        <Text style={styles.cardSubtitle}>Adicione, edite e remova instrutores.</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={24} color="#555" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={() => router.push('/alunos')}>
                    <Ionicons name="people-outline" size={32} color="#A33E3E" />
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>Gerenciar Alunos</Text>
                        <Text style={styles.cardSubtitle}>Consulte, edite e remova alunos.</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={24} color="#555" />
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#1A1A1A' },
    container: { padding: 20 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#AAA',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
    },
    card: {
        backgroundColor: '#2B2727',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3,
    },
    cardTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    cardTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        color: '#AAA',
        fontSize: 14,
        marginTop: 4,
    },
});

export default AdminDashboardScreen;