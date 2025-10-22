import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import StyledInput from '@/src/components/StyledInput';
import StyledButton from '@/src/components/StyledButton';
import { register } from '@/src/services/authService';
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    
    const [loading, setLoading] = useState(false);
    const router = useRouter(); 

    const handleRegister = async () => {
        if (!nome || !email || !senha || !confirmaSenha) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios!');
            return;
        }
        if (senha !== confirmaSenha) {
            Alert.alert('Erro', 'As senhas não coincidem!');
            return;
        }

        setLoading(true); 
        try {
            const result = await register({ nome, login: email, senha });
            if (result) {
                Alert.alert('Sucesso!', 'Conta criada. Agora você pode fazer o login.');
                router.push('/'); 
            }
        } catch (error) {
            console.error("Erro inesperado no registro:", error);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Criar Conta</Text>
                </View>
                
                <View style={styles.formContainer}>
                    <StyledInput placeholder="NOME COMPLETO" value={nome} onChangeText={setNome} editable={!loading} />
                    <StyledInput placeholder="EMAIL" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!loading} />
                    <StyledInput placeholder="SENHA" value={senha} onChangeText={setSenha} secureTextEntry editable={!loading} />
                    <StyledInput placeholder="CONFIRMAR SENHA" value={confirmaSenha} onChangeText={setConfirmaSenha} secureTextEntry editable={!loading}/>
                </View>

                <View style={styles.actionsContainer}>
                    <StyledButton variant="primary" onPress={handleRegister} disabled={loading} style={styles.registerButton}>
                        {loading ? <ActivityIndicator color="#FFF" /> : 'Finalizar Cadastro'}
                    </StyledButton>

                    <TouchableOpacity onPress={() => router.push('/')} disabled={loading}>
                        <Text style={styles.linkText}>Já tenho uma conta</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 40,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
        position: 'relative',
        width: '100%',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: 10,
    },
    title: {
        fontSize: 32,
        color: '#FFF',
        fontWeight: 'bold',
    },
    formContainer: {
        width: '100%',
        gap: 15,
    },
    actionsContainer: {
        width: '100%',
        marginTop: 30,
        alignItems: 'center',
        gap: 20,
    },
    registerButton: {
        backgroundColor: '#A33E3E',
        width: '100%',
    },
    linkText: {
        color: '#AAA',
        fontSize: 14,
        textDecorationLine: 'underline',
    }
});

export default RegisterScreen;