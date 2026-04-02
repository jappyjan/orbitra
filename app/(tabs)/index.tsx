import { useState, useMemo, useCallback } from 'react';
import { StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { PersonCard } from '@/components/PersonCard';
import { FloatingAddButton } from '@/components/FloatingAddButton';
import { EmptyState } from '@/components/EmptyState';
import { usePersonStore } from '@/stores/usePersonStore';
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

  const peopleRecord = usePersonStore((s) => s.people);
  const people = useMemo(() => Object.values(peopleRecord), [peopleRecord]);

  const filteredAndSorted = useMemo(() => {
    let result = people;
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
  }, [people, searchQuery, sortMode]);

  const toggleSort = useCallback(() => {
    setSortMode((prev) => (prev === 'alphabetical' ? 'recent' : 'alphabetical'));
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
      <FlatList
        data={filteredAndSorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
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
  list: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  separator: {
    height: 8,
  },
});
