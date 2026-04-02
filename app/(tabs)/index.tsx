import { useState, useMemo, useCallback } from 'react';
import { StyleSheet, FlatList, Pressable, TextInput, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { PersonCard } from '@/components/PersonCard';
import { FloatingAddButton } from '@/components/FloatingAddButton';
import { EmptyState } from '@/components/EmptyState';
import { usePersonStore } from '@/stores/usePersonStore';
import { useCircleStore } from '@/stores/useCircleStore';
import { getFullName } from '@/models/Person';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type SortMode = 'alphabetical' | 'recent';

export default function PeopleFeedScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [sortMode, setSortMode] = useState<SortMode>('alphabetical');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const peopleRecord = usePersonStore((s) => s.people);
  const people = useMemo(() => Object.values(peopleRecord), [peopleRecord]);

  const circlesRecord = useCircleStore((s) => s.circles);
  const circles = useMemo(() => Object.values(circlesRecord), [circlesRecord]);

  const filteredAndSorted = useMemo(() => {
    let result = people;

    // Filter by circle
    if (selectedCircleId) {
      result = result.filter((p) => p.circleIds.includes(selectedCircleId));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.firstName.toLowerCase().includes(lower) ||
          p.lastName.toLowerCase().includes(lower) ||
          p.tags.some((t) => t.toLowerCase().includes(lower))
      );
    }
    if (sortMode === 'alphabetical') {
      return [...result].sort((a, b) => getFullName(a).localeCompare(getFullName(b)));
    }
    return [...result].sort((a, b) => b.createdAt - a.createdAt);
  }, [people, searchQuery, sortMode, selectedCircleId]);

  const toggleSort = useCallback(() => {
    setSortMode((prev) => (prev === 'alphabetical' ? 'recent' : 'alphabetical'));
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Trigger a re-render by briefly setting refreshing state
    // In a future version with server sync, this would fetch fresh data
    setTimeout(() => setRefreshing(false), 300);
  }, []);

  if (people.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="users"
          title="No people yet"
          subtitle="Add your first person to start building your relationship map"
          actionLabel="Add Person"
          onAction={() => router.push('/person/add')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header} lightColor={colors.background} darkColor={colors.background}>
        <TextInput
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.backgroundSecondary,
              color: colors.text,
              borderColor: colors.cardBorder,
            },
          ]}
          placeholder="Search people..."
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable onPress={toggleSort} style={styles.sortButton}>
          <Text style={[styles.sortText, { color: colors.tint }]}>
            {sortMode === 'alphabetical' ? 'A-Z' : 'Recent'}
          </Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        style={styles.chipScroll}
      >
        <Pressable
          onPress={() => setSelectedCircleId(null)}
          style={[
            styles.chip,
            {
              backgroundColor: selectedCircleId === null ? colors.tint : colors.backgroundSecondary,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.chipText,
              { color: selectedCircleId === null ? '#fff' : colors.text },
            ]}
          >
            All
          </Text>
        </Pressable>
        {circles.map((circle) => (
          <Pressable
            key={circle.id}
            onPress={() =>
              setSelectedCircleId((prev) => (prev === circle.id ? null : circle.id))
            }
            style={[
              styles.chip,
              {
                backgroundColor:
                  selectedCircleId === circle.id ? circle.color : colors.backgroundSecondary,
                borderColor: selectedCircleId === circle.id ? circle.color : colors.cardBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: selectedCircleId === circle.id ? '#fff' : colors.text },
              ]}
            >
              {circle.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <FlatList
        data={filteredAndSorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/person/${item.id}`)}>
            <PersonCard person={item} />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} lightColor="transparent" darkColor="transparent" />}
      />
      <FloatingAddButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortText: {
    fontSize: 15,
    fontWeight: '600',
  },
  chipScroll: {
    flexGrow: 0,
    paddingBottom: 4,
  },
  chipRow: {
    paddingHorizontal: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  separator: {
    height: 8,
  },
});
