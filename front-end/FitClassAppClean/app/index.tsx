import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import { router, Stack } from 'expo-router';
import StyledInput from '@/src/components/StyledInput';
import StyledButton from '@/src/components/StyledButton';

const LoginScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => { // Removido o "async" pois não estamos usando 'await'
    console.log('Tentativa de Login com (MODO TESTE):', { email, password });

    // --- LÓGICA DE TESTE (HARDCODED) ---
    // Esta verificação é temporária, apenas para testar a navegação.
    if (email.toLowerCase() === 'aluno@fitclass.com' && password === '123456') {
      Alert.alert('Sucesso (Modo Teste)!', 'Login realizado com sucesso.');
      router.replace('/home');
    } else {
      Alert.alert('Erro (Modo Teste)', 'Email ou senha inválidos.');
    }


    /* // --- CÓDIGO DA API 

    try {
      const response = await fetch("http://10.20.14.217/api_login/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.status === "success") {
        router.replace('/home');
      } else {
        Alert.alert('Erro', data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    }
    */
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.title}>FITCLASS</Text>

        <StyledInput placeholder="EMAIL" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <StyledInput placeholder="SENHA" value={password} onChangeText={setPassword} secureTextEntry />

        <StyledButton variant='primary' onPress={handleLogin}>
          Login
        </StyledButton>

        <StyledButton variant='secondary' onPress={() => router.push('/register')}>
          Registrar-se
        </StyledButton>

        <StyledButton variant='google' onPress={() => Alert.alert('Aviso', 'Funcionalidade ainda não implementada.')}>
          <Image source={require('../src/assets/google.png')} style={styles.googleIcon} />
          <Text style={styles.buttonTextGoogle}>Sign in with Google</Text>
        </StyledButton>

        <StyledButton variant="secondary" onPress={() => Alert.alert('Aviso', 'Funcionalidade ainda não implementada.')}>
          Recuperar Senha
        </StyledButton>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2727',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 25,
    gap: 15,
  },
  title: {
    fontSize: 48,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 50,
    fontWeight: '300',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonTextGoogle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;