import { StyleSheet } from 'react-native';

import { View } from '@/components/Themed';

const styles = StyleSheet.create({
  separator: {
    height: 10,
    backgroundColor: 'transparent',
  },
});

export default function Separator() {
  return <View style={styles.separator} />;
}
