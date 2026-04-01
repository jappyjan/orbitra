import { StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
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
  const getPerson = usePersonStore((s) => s.getPerson);
  const getCircle = useCircleStore((s) => s.getCircle);

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
      {person.tags.length > 0 && (
        <View style={[styles.section, { borderColor: colors.separator }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Tags</Text>
          <View style={styles.tagRow} lightColor="transparent" darkColor="transparent">
            {person.tags.map((tag) => (
              <View
                key={tag}
                style={[styles.tag, { backgroundColor: colors.backgroundSecondary }]}
                lightColor={colors.backgroundSecondary}
                darkColor={colors.backgroundSecondary}
              >
                <Text style={[styles.tagText, { color: colors.textSecondary }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Connections */}
      {connections.length > 0 && (
        <View style={[styles.section, { borderColor: colors.separator }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Connections</Text>
          {connections.map((conn) => (
            <Pressable
              key={conn!.id}
              style={styles.connectionRow}
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
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 13,
  },
  connectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  connectionName: {
    flex: 1,
    fontSize: 16,
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
