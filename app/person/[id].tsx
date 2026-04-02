import { useState } from 'react';
import { StyleSheet, ScrollView, Pressable, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View } from '@/components/Themed';
import { AvatarCircle } from '@/components/AvatarCircle';
import { usePersonStore } from '@/stores/usePersonStore';
import { useCircleStore } from '@/stores/useCircleStore';
import { getFullName, getInitials } from '@/models/Person';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const person = usePersonStore((s) => s.getPerson(id));
  const deletePerson = usePersonStore((s) => s.deletePerson);
  const updatePerson = usePersonStore((s) => s.updatePerson);
  const removeConnection = usePersonStore((s) => s.removeConnection);
  const getPerson = usePersonStore((s) => s.getPerson);
  const getCircle = useCircleStore((s) => s.getCircle);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  if (!person) {
    return (
      <View style={styles.notFound}>
        <Text>Person not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Person',
      `Are you sure you want to delete ${getFullName(person)}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deletePerson(id);
            router.back();
          },
        },
      ]
    );
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (!tag) return;
    if (person.tags.includes(tag)) {
      setNewTag('');
      setShowTagInput(false);
      return;
    }
    updatePerson(id, { tags: [...person.tags, tag] });
    setNewTag('');
    setShowTagInput(false);
  };

  const handleRemoveTag = (tag: string) => {
    updatePerson(id, { tags: person.tags.filter((t) => t !== tag) });
  };

  const handleRemoveConnection = (connId: string) => {
    const conn = getPerson(connId);
    if (!conn) return;
    Alert.alert(
      'Remove Connection',
      `Remove connection with ${getFullName(conn)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeConnection(id, connId),
        },
      ]
    );
  };

  const personCircles = person.circleIds
    .map((cid) => getCircle(cid))
    .filter(Boolean);

  const connections = person.connectionIds
    .map((cid) => getPerson(cid))
    .filter(Boolean);

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Stack.Screen
        options={{
          title: getFullName(person),
          headerRight: () => (
            <Pressable onPress={() => router.push(`/person/edit/${id}`)}>
              <FontAwesome name="pencil" size={20} color={colors.tint} />
            </Pressable>
          ),
        }}
      />

      {/* Header Section */}
      <View style={styles.headerSection} lightColor="transparent" darkColor="transparent">
        <AvatarCircle
          photoUri={person.photoUri}
          initials={getInitials(person)}
          size={96}
          backgroundColor={personCircles[0]?.color ?? '#2f95dc'}
        />
        <Text style={styles.name}>{getFullName(person)}</Text>
        {personCircles.length > 0 && (
          <View style={styles.badgeRow} lightColor="transparent" darkColor="transparent">
            {personCircles.map((circle) => (
              <View
                key={circle!.id}
                style={[styles.badge, { backgroundColor: circle!.color + '20' }]}
                lightColor={circle!.color + '20'}
                darkColor={circle!.color + '30'}
              >
                <Text
                  style={[styles.badgeText, { color: circle!.color }]}
                  lightColor={circle!.color}
                  darkColor={circle!.color}
                >
                  {circle!.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Contact Info */}
      {(person.phoneNumbers.length > 0 || person.emails.length > 0) && (
        <View style={[styles.section, { borderColor: colors.separator }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Contact</Text>
          {person.phoneNumbers.map((phone, i) => (
            <View key={`phone-${i}`} style={styles.infoRow} lightColor="transparent" darkColor="transparent">
              <FontAwesome name="phone" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{phone}</Text>
            </View>
          ))}
          {person.emails.map((email, i) => (
            <View key={`email-${i}`} style={styles.infoRow} lightColor="transparent" darkColor="transparent">
              <FontAwesome name="envelope-o" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{email}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Notes */}
      {person.notes ? (
        <View style={[styles.section, { borderColor: colors.separator }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Notes</Text>
          <Text style={styles.notes}>{person.notes}</Text>
        </View>
      ) : null}

      {/* Tags */}
      <View style={[styles.section, { borderColor: colors.separator }]}>
        <View style={styles.sectionHeader} lightColor="transparent" darkColor="transparent">
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Tags</Text>
          <Pressable onPress={() => setShowTagInput(!showTagInput)}>
            <FontAwesome name={showTagInput ? 'times' : 'plus'} size={14} color={colors.tint} />
          </Pressable>
        </View>
        <View style={styles.tagRow} lightColor="transparent" darkColor="transparent">
          {person.tags.map((tag) => (
            <Pressable
              key={tag}
              onPress={() => handleRemoveTag(tag)}
              style={[styles.tag, { backgroundColor: colors.backgroundSecondary }]}
            >
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>{tag}</Text>
              <FontAwesome name="times" size={10} color={colors.textSecondary} style={styles.tagRemove} />
            </Pressable>
          ))}
        </View>
        {showTagInput && (
          <View style={styles.tagInputRow} lightColor="transparent" darkColor="transparent">
            <TextInput
              style={[
                styles.tagInput,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                  borderColor: colors.cardBorder,
                },
              ]}
              placeholder="Enter tag..."
              placeholderTextColor={colors.placeholder}
              value={newTag}
              onChangeText={setNewTag}
              onSubmitEditing={handleAddTag}
              autoCapitalize="none"
              autoFocus
              returnKeyType="done"
            />
            <Pressable onPress={handleAddTag} style={[styles.tagAddButton, { backgroundColor: colors.tint }]}>
              <Text style={styles.tagAddText}>Add</Text>
            </Pressable>
          </View>
        )}
        {person.tags.length === 0 && !showTagInput && (
          <Text style={[styles.emptyHint, { color: colors.placeholder }]}>
            Tap + to add tags
          </Text>
        )}
      </View>

      {/* Connections */}
      {connections.length > 0 && (
        <View style={[styles.section, { borderColor: colors.separator }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Connections</Text>
          {connections.map((conn) => (
            <View key={conn!.id} style={styles.connectionRow} lightColor="transparent" darkColor="transparent">
              <Pressable
                style={styles.connectionInfo}
                onPress={() => router.push(`/person/${conn!.id}`)}
              >
                <AvatarCircle
                  photoUri={conn!.photoUri}
                  initials={getInitials(conn!)}
                  size={36}
                />
                <Text style={styles.connectionName}>{getFullName(conn!)}</Text>
                <FontAwesome name="chevron-right" size={12} color={colors.textSecondary} />
              </Pressable>
              <Pressable
                onPress={() => handleRemoveConnection(conn!.id)}
                style={styles.removeConnectionButton}
                hitSlop={8}
              >
                <FontAwesome name="unlink" size={14} color={colors.danger} />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {/* Delete Button */}
      <Pressable
        style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
        onPress={handleDelete}
      >
        <Text style={[styles.deleteText, { color: colors.danger }]}>Delete Person</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  infoText: {
    fontSize: 16,
  },
  notes: {
    fontSize: 16,
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 13,
  },
  tagRemove: {
    marginLeft: 6,
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  tagInput: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  tagAddButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tagAddText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  connectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  connectionInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  connectionName: {
    flex: 1,
    fontSize: 16,
  },
  removeConnectionButton: {
    paddingLeft: 12,
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 20,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.6,
  },
});
