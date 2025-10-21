import StyledButton from '@/src/components/StyledButton';
import StyledInput from '@/src/components/StyledInput';
import { createAluno } from '@/src/services/alunoService';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
            <Stack.Screen options={{ title: 'Novo Aluno' }} />
            <ScrollView style={styles.container}>
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
    safeArea: { flex: 1, backgroundColor: '#2B2727' },
    container: { flex: 1, padding: 20 },
    label: { color: '#FFF', fontSize: 16, marginBottom: 8, marginTop: 15, fontWeight: 'bold' },
    saveButton: { marginTop: 30 },
});

export default NovoAlunoScreen;