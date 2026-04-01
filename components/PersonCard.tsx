import { StyleSheet } from 'react-native';
import { View, Text } from '@/components/Themed';
import { AvatarCircle } from '@/components/AvatarCircle';
import { Person, getFullName, getInitials } from '@/models/Person';
import { useCircleStore } from '@/stores/useCircleStore';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface PersonCardProps {
  person: Person;
}

export function PersonCard({ person }: PersonCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const getCircle = useCircleStore((s) => s.getCircle);
  const primaryCircle = person.circleIds.length > 0 ? getCircle(person.circleIds[0]) : undefined;

  return (
    <View
      style={[styles.card, { borderColor: colors.cardBorder }]}
      lightColor={colors.card}
      darkColor={colors.card}
    >
      <AvatarCircle
        photoUri={person.photoUri}
        initials={getInitials(person)}
        size={48}
        backgroundColor={primaryCircle?.color ?? '#2f95dc'}
      />
      <View style={styles.info} lightColor="transparent" darkColor="transparent">
        <Text style={styles.name}>{getFullName(person)}</Text>
        {primaryCircle && (
          <View style={styles.badgeRow} lightColor="transparent" darkColor="transparent">
            <View
              style={[styles.badge, { backgroundColor: primaryCircle.color + '20' }]}
              lightColor={primaryCircle.color + '20'}
              darkColor={primaryCircle.color + '30'}
            >
              <Text
                style={[styles.badgeText, { color: primaryCircle.color }]}
                lightColor={primaryCircle.color}
                darkColor={primaryCircle.color}
              >
                {primaryCircle.name}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
