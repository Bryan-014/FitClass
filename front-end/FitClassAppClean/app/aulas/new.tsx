import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import StyledInput from '@/src/components/StyledInput';
import StyledButton from '@/src/components/StyledButton';
import { createAula } from '@/src/services/aulaService';

const NovaAulaScreen = () => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!nome) {
            Alert.alert('Erro', 'O nome da aula é obrigatório.');
            return;
        }
        setLoading(true);
        try {
            await createAula({ nome, descricao });
            Alert.alert('Sucesso', 'Aula criada com sucesso!');
            router.back(); 
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível criar a aula.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ title: 'Nova Aula' }} />
            <Text style={styles.label}>Nome da Aula</Text>
            <StyledInput value={nome} onChangeText={setNome} placeholder="Ex: CrossFit Avançado" editable={!loading} />

            <Text style={styles.label}>Descrição</Text>
            <StyledInput value={descricao} onChangeText={setDescricao} placeholder="Descrição curta da aula" multiline editable={!loading} />
            
            <StyledButton onPress={handleSave} disabled={loading} style={{ marginTop: 20 }}>
                {loading ? <ActivityIndicator color="#FFF" /> : 'Salvar Aula'}
            </StyledButton>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2B2727', padding: 20 },
    label: { color: '#FFF', fontSize: 16, marginBottom: 5, marginTop: 15 },
});

export default NovaAulaScreen;