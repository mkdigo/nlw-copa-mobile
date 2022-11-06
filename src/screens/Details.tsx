import { useState, useEffect } from 'react';
import { Share } from 'react-native';
import { VStack, useToast, HStack } from 'native-base';
import { useRoute } from '@react-navigation/native';

import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { PollCardProps } from '../components/PollCard';
import { EmptyMyPollList } from '../components/EmptyMyPollList';
import { Option } from '../components/Option';
import { PollHeader } from '../components/PollHeader';
import { Guesses } from '../components/Guesses';

import { api } from '../services/api';

interface RouteParams {
  id: string;
}

export function Details() {
  const route = useRoute();
  const { id } = route.params as RouteParams;
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [pollDetails, setPollDetails] = useState<PollCardProps>(
    {} as PollCardProps
  );
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>(
    'guesses'
  );

  async function fetchPollDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/polls/${id}`);
      setPollDetails(response.data.poll);
    } catch (error) {
      console.log(error);
      toast.show({
        title: 'Não foi possível carregar os detalhes do bolão.',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: pollDetails.code,
    });
  }

  useEffect(() => {
    fetchPollDetails();
  }, [id]);

  if (isLoading) return <Loading />;

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header
        title={pollDetails.title}
        showBackButton
        onShare={handleCodeShare}
      />

      {pollDetails._count?.participants > 0 ? (
        <VStack>
          <PollHeader data={pollDetails} />
          <HStack bgColor='gray.800' p={1} rounded='sm' mb={5}>
            <Option
              title='Seus palpites'
              isSelected={optionSelected === 'guesses'}
              onPress={() => setOptionSelected('guesses')}
            />
            <Option
              title='Ranking do grupo'
              isSelected={optionSelected === 'ranking'}
              onPress={() => setOptionSelected('ranking')}
            />
          </HStack>

          <Guesses pollId={pollDetails.id} code={pollDetails.code} />
        </VStack>
      ) : (
        <EmptyMyPollList code={pollDetails.code} />
      )}
    </VStack>
  );
}
