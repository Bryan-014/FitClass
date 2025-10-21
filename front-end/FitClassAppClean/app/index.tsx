import StyledButton from '@/src/components/StyledButton';
import StyledInput from '@/src/components/StyledInput';
import { login } from '@/src/services/authService';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha o email e a senha.');
      return;
    }

    setLoading(true);
    try {
      const token = await login({ login: email, senha: password });

      if (token) {
        router.replace('/home');
      } else {
        Alert.alert('Falha no Login', 'Usuário ou senha incorretos.');
      }

    } catch (error) {
      console.error("Erro inesperado na tela de login:", error);
      Alert.alert('Erro', 'Ocorreu um problema ao tentar fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.title}>FITCLASS</Text>

        <StyledInput
          placeholder="EMAIL"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        <StyledInput
          placeholder="SENHA"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <StyledButton variant='primary' onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : 'Login'}
        </StyledButton>

        <StyledButton variant='secondary' onPress={() => router.push('/register')} disabled={loading}>
          Registrar-se
        </StyledButton>

        <StyledButton variant='google' onPress={() => Alert.alert('Aviso', 'Funcionalidade ainda não implementada.')} disabled={loading}>
          <Image source={require('../src/assets/google.png')} style={styles.googleIcon} />
          <Text style={styles.buttonTextGoogle}>Sign in with Google</Text>
        </StyledButton>

        <StyledButton variant="secondary" onPress={() => Alert.alert('Aviso', 'Funcionalidade ainda não implementada.')} disabled={loading}>
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