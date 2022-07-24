import {
  HStack,
  VStack,
  IconButton,
  useTheme,
  Text,
  Heading,
  FlatList,
  Center
} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import Logo from '../assets/logo_secondary.svg';
import { ChatTeardropText, SignOut } from 'phosphor-react-native';
import { Filter } from '../components/Filter';
import { useEffect, useState } from 'react';
import { Order, OrderProps } from '../components/Order';
import { Button } from '../components/Button';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { dateFormat } from '../utils/formatDateFirestore';
import { LoadingScreen } from '../components/Loading';

export function Home() {
  const [loading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<'open' | 'closed'>('open');
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const { colors } = useTheme();
  const navigation = useNavigation();
  function handleNewOrder() {
    navigation.navigate('new');
  }
  function handleOpenDetails(orderId: string) {
    navigation.navigate('details', { orderId });
  }
  function handleLogOut() {
    auth()
      .signOut()
      .catch(error => {
        console.log(error);
        return Alert.alert('Sair', 'Não foi possível sair da aplicação.');
      });
  }
  useEffect(() => {
    setIsLoading(true);

    const subscriber = firestore()
      .collection('orders')
      .where('status', '==', selected)
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => {
          const { patrimony, description, status, created_at } = doc.data();

          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(created_at)
          };
        });
        setOrders(data);
        setIsLoading(false);
      });
    return subscriber;
  }, [selected]);
  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />
        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleLogOut}
        />
      </HStack>
      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100">Meus Chamados</Heading>
          <Text color="gray.200">3</Text>
        </HStack>
        <HStack space={3} mb={8}>
          <Filter
            type="open"
            title="em andamento"
            onPress={() => setSelected('open')}
            isActive={selected === 'open'}
          />
          <Filter
            type="closed"
            title="finalizados"
            onPress={() => setSelected('closed')}
            isActive={selected === 'closed'}
          />
        </HStack>
        {loading ? (
          <LoadingScreen />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={items => items.id}
            renderItem={({ item }) => (
              <Order data={item} onPress={() => handleOpenDetails(item.id)} />
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardropText color={colors.gray[300]} size={40} />
                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                  Você ainda não possui {'\n'}
                  Solicitações {''}
                  {selected === 'open' ? 'em andamento' : 'finalizados'}
                </Text>
              </Center>
            )}
          />
        )}

        <Button title="Nova Solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
