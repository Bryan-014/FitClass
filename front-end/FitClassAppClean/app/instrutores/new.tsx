import StyledButton from '@/src/components/StyledButton';
import StyledInput from '@/src/components/StyledInput';
import { createInstrutor } from '@/src/services/instrutorService';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NovoInstrutorScreen = () => {
    const [nome, setNome] = useState('');
    const [especialidade, setEspecialidade] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!nome || !especialidade) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios.');
            return;
        }

        setLoading(true);
        try {
            await createInstrutor({ nome, especialidade });
            Alert.alert('Sucesso', 'Instrutor cadastrado com sucesso!');
            router.back(); 
        } catch (error) {
            console.error("Erro ao criar instrutor:", error);
            Alert.alert('Erro', 'Não foi possível cadastrar o instrutor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ title: 'Novo Instrutor' }} />
            <ScrollView style={styles.container}>
                <Text style={styles.label}>Nome do Instrutor</Text>
                <StyledInput 
                    value={nome} 
                    onChangeText={setNome} 
                    placeholder="Ex: João da Silva" 
                    editable={!loading} 
                />

                <Text style={styles.label}>Especialidade</Text>
                <StyledInput 
                    value={especialidade} 
                    onChangeText={setEspecialidade} 
                    placeholder="Ex: CrossFit, Yoga, Musculação" 
                    editable={!loading} 
                />
                
                <StyledButton onPress={handleSave} disabled={loading} style={styles.saveButton}>
                    {loading ? <ActivityIndicator color="#FFF" /> : 'Salvar Instrutor'}
                </StyledButton>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2B2727' },
    container: { 
        flex: 1, 
        padding: 20 
    },
    label: { 
        color: '#FFF', 
        fontSize: 16, 
        marginBottom: 8, 
        marginTop: 15,
        fontWeight: 'bold',
    },
    saveButton: {
        marginTop: 30,
    }
});

export default NovoInstrutorScreen;