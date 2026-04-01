import { StyleSheet, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { AvatarCircle } from '@/components/AvatarCircle';
import { EmptyState } from '@/components/EmptyState';
import { useCircleStore } from '@/stores/useCircleStore';
import { usePersonStore } from '@/stores/usePersonStore';
import { getFullName, getInitials } from '@/models/Person';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function CircleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const circle = useCircleStore((s) => s.getCircle(id));
  const members = usePersonStore((s) => s.getPeopleByCircle(id));

  if (!circle) {
    return (
      <View style={styles.container}>
        <Text>Circle not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: circle.name }} />
      <View
        style={[styles.header, { borderBottomColor: colors.separator }]}
        lightColor={colors.background}
        darkColor={colors.background}
      >
        <View
          style={[styles.colorIndicator, { backgroundColor: circle.color }]}
          lightColor={circle.color}
          darkColor={circle.color}
        />
        <Text style={styles.headerTitle}>{circle.name}</Text>
        <Text style={[styles.headerCount, { color: colors.textSecondary }]}>
          {members.length} {members.length === 1 ? 'person' : 'people'}
        </Text>
      </View>
      {members.length === 0 ? (
        <EmptyState
          icon="user-plus"
          title="No members"
          subtitle={`Add people to the ${circle.name} circle`}
          actionLabel="Add Person"
          onAction={() => router.push('/person/add')}
        />
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item }) => (
            <Pressable
              style={styles.memberCell}
              onPress={() => router.push(`/person/${item.id}`)}
            >
              <AvatarCircle
                photoUri={item.photoUri}
                initials={getInitials(item)}
                size={60}
                backgroundColor={circle.color}
              />
              <Text style={styles.memberName} numberOfLines={2}>
                {getFullName(item)}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerCount: {
    fontSize: 14,
    marginLeft: 'auto',
  },
  grid: {
    padding: 12,
  },
  gridRow: {
    gap: 12,
  },
  memberCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  memberName: {
    fontSize: 13,
    textAlign: 'center',
  },
});
