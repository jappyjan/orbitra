import { StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { View } from '@/components/Themed';
import { CircleCard } from '@/components/CircleCard';
import { useCircleStore } from '@/stores/useCircleStore';
import { usePersonStore } from '@/stores/usePersonStore';

export default function CirclesScreen() {
  const router = useRouter();
  const circles = useCircleStore((s) => s.getAllCircles());
  const getPeopleByCircle = usePersonStore((s) => s.getPeopleByCircle);

  return (
    <View style={styles.container}>
      <FlatList
        data={circles}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const members = getPeopleByCircle(item.id);
          return (
            <Pressable
              style={styles.cardWrapper}
              onPress={() => router.push(`/circle/${item.id}`)}
            >
              <CircleCard circle={item} memberCount={members.length} members={members} />
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 12,
  },
  row: {
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
    marginBottom: 12,
  },
});
