import { Heading, VStack, Icon, useTheme } from 'native-base';
import { Input } from '../components/Input';
import { Envelope, Key } from 'phosphor-react-native';
import auth from '@react-native-firebase/auth';
import Logo from '../assets/logo_primary.svg';
import { Button } from '../components/Button';
import { useState } from 'react';
import { Alert } from 'react-native';

export function Signin() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { colors } = useTheme();

  function handleSignin() {
    if (!email || !password) {
      return Alert.alert('Login', 'Insira seu usuário corretamente');
    }
    setIsLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        console.log(error);
        setIsLoading(false);

        if (error.code === 'auth/invalid-email') {
          return Alert.alert('Login', 'E-mail inválido.');
        }
        if (error.code === 'auth/user-not-found') {
          return Alert.alert('Login', 'E-mail ou senha inválida.');
        }
        if (error.code === 'auth/wrong-password') {
          return Alert.alert('Login', 'E-mail ou senha inválida.');
        }

        return Alert.alert('Login', 'Não foi possível fazer o login.')
      });
  }
  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>
      <Input
        placeholder="E-mail"
        mb={4}
        onChangeText={setEmail}
        InputLeftElement={
          <Icon ml={4} as={<Envelope color={colors.gray[300]} />} />
        }
      />
      <Input
        secureTextEntry
        placeholder="Senha"
        mb={8}
        onChangeText={setPassword}
        InputLeftElement={<Icon ml={4} as={<Key color={colors.gray[300]} />} />}
      />
      <Button
        title="Entrar"
        w="full"
        onPress={handleSignin}
        isLoading={isLoading}
      />
    </VStack>
  );
}
