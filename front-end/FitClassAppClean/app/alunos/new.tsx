import React, { useState } from 'react';
import { StyleSheet, Alert, ActivityIndicator, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import StyledInput from '@/src/components/StyledInput';
import StyledButton from '@/src/components/StyledButton';
import { createAluno } from '@/src/services/alunoService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const NovoAlunoScreen = () => {
    const [nome, setNome] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!nome) {
            Alert.alert('Erro', 'O campo nome é obrigatório.');
            return;
        }
        setLoading(true);
        try {
            await createAluno({ nome });
            Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
            router.back();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível cadastrar o aluno.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Novo Aluno</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>Nome do Aluno</Text>
                <StyledInput value={nome} onChangeText={setNome} placeholder="Nome completo do aluno" editable={!loading} />
                
                <StyledButton onPress={handleSave} disabled={loading} style={styles.saveButton}>
                    {loading ? <ActivityIndicator color="#FFF" /> : 'Salvar Aluno'}
                </StyledButton>
            </ScrollView>
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
    },
    backButton: { padding: 8 },
    headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
    container: { padding: 20 },
    label: { 
        color: '#FFF', 
        fontSize: 16, 
        marginBottom: 8, 
        marginTop: 15,
        fontWeight: 'bold',
    },
    saveButton: {
        marginTop: 30,
        backgroundColor: '#A33E3E',
    }
});

export default NovoAlunoScreen;