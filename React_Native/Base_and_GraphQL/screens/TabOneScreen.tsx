import React from 'react';
import { StyleSheet } from 'react-native';
import { gql, useQuery } from '@apollo/client';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

const GET_GREETING = gql`
query coins {
  coins {
    id
    name
    symbol
    rank
    quotes {
      USD {
        price
        market_cap
        percent_change_1h
      }
    }
  }
}
`;

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const { loading, error, data } = useQuery(GET_GREETING, {
    variables: { language: 'english' },
  });

  if (loading) return <Text>Loading ...</Text>;

  if (error) {
    console.log(JSON.stringify(error))
  }

  if (data) {
    console.log(data.coins[0])
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
