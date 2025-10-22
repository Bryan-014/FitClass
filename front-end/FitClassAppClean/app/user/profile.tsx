
import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ActivityIndicator, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import StyledInput from '@/src/components/StyledInput';
import StyledButton from '@/src/components/StyledButton';
import { getMeuPerfil, updateMeuPerfil, UpdateUsuarioData } from '@/src/services/usuarioService';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const data = await getMeuPerfil();
                setNome(data.nome);
                setEmail(data.login);
            } catch (error) {
                Alert.alert("Erro", "Não foi possível carregar seus dados de perfil.");
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleUpdate = async () => {
        if (!nome) {
            Alert.alert("Erro", "O nome não pode ficar em branco.");
            return;
        }
        setIsSaving(true);
        try {
            const updatedData: UpdateUsuarioData = { nome };
            await updateMeuPerfil(updatedData);
            Alert.alert("Sucesso", "Perfil atualizado!");
            router.back();
        } catch (error) {
            Alert.alert("Erro", "Não foi possível atualizar o perfil.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ActivityIndicator size="large" color="#FFF" style={{ flex: 1 }} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Editar Perfil</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>Nome</Text>
                    <StyledInput 
                        value={nome}
                        onChangeText={setNome}
                        editable={!isSaving}
                    />

                    <Text style={styles.label}>Email (não pode ser alterado)</Text>
                    <StyledInput 
                        value={email}
                        editable={false}
                        style={{ backgroundColor: '#333', color: '#888' }}
                    />
                </View>

                <StyledButton 
                    onPress={handleUpdate} 
                    disabled={isSaving} 
                    style={styles.actionButton}
                >
                    {isSaving ? <ActivityIndicator color="#FFF" /> : 'Salvar Alterações'}
                </StyledButton>

                <StyledButton 
                    variant="secondary"
                    onPress={() => { Alert.alert("Aviso", "Funcionalidade a ser implementada.") }}
                    disabled={isSaving} 
                    style={styles.secondaryButton}
                >
                    Alterar Senha
                </StyledButton>
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
        marginBottom: 30,
    },
    backButton: { padding: 8 },
    headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
    formContainer: { marginBottom: 30 },
    label: { 
        color: '#FFF', 
        fontSize: 16, 
        marginBottom: 8, 
        marginTop: 15,
        fontWeight: 'bold'
    },
    actionButton: {
        backgroundColor: '#A33E3E',
    },
    secondaryButton: {
        marginTop: 15,
        backgroundColor: '#4A4A4A'
    }
});

export default ProfileScreen;