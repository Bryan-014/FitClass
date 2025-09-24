import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import StyledInput from '@/src/components/StyledInput';

const RegisterScreen = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');

    const handleRegister = () => {
        if (senha !== confirmaSenha) {
            Alert.alert('Erro', 'As senhas não coincidem!');
            return;
        }
        console.log({ nome, email, senha });
        Alert.alert('Sucesso', 'Conta criada com sucesso!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FITCLASS</Text>

            <StyledInput placeholder="NOME" value={nome} onChangeText={setNome} />
            <StyledInput placeholder="EMAIL" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <StyledInput placeholder="SENHA" value={senha} onChangeText={setSenha} secureTextEntry />
            <StyledInput placeholder="CONFIRMAR SENHA" value={confirmaSenha} onChangeText={setConfirmaSenha} secureTextEntry/>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Registrar-se</Text>
            </TouchableOpacity>

            <Link href="/" style={styles.link}>Já tenho uma conta</Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2B2727',
        justifyContent: 'center',
        padding: 35,
    },
    title: {
        fontSize: 48,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 50,
        fontWeight: '300',
    },
    input: {
        backgroundColor: '#3D3D3D',
        color: '#FFF',
        borderRadius: 8,
        padding: 15,
        marginBottom: 35,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#1E1E1E', // A cor que você queria
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10, // Margem extra para separar do último input
    },
    buttonText: {
        color: '#888',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        marginTop: 15,
        borderRadius: 8,
        overflow: 'hidden',
    },
    link: {
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
        fontWeight: 'bold',
    }
});

export default RegisterScreen;