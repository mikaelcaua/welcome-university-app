import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import BrazilMapSvg from '@/assets/map/brazil_map.svg';
import { useStatesViewModel } from './viewmodel';

export default function StatesScreen() {
  const { loading, data, selectState } = useStatesViewModel();

  function handlePress(evt: any) {
    const stateId = evt.target?.attributes?.id?.value;
    if (stateId) {
      selectState(stateId);
      }
      console.log(stateId)
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress}>
        <BrazilMapSvg width="100%" height="100%" />
      </Pressable>

      {loading && <ActivityIndicator size="large" />}

      {data && (
        <View style={styles.box}>
          <Text style={styles.title}>Estado selecionado:</Text>
          <Text>{JSON.stringify(data, null, 2)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  box: {
    padding: 16,
    backgroundColor: '#EEE',
    margin: 10,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
