import { StyleSheet } from 'react-native';
import { View, Text } from '@/components/Themed';
import { AvatarCircle } from '@/components/AvatarCircle';
import { Circle } from '@/models/Circle';
import { Person, getInitials } from '@/models/Person';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface CircleCardProps {
  circle: Circle;
  memberCount: number;
  members: Person[];
}

export function CircleCard({ circle, memberCount, members }: CircleCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const previewMembers = members.slice(0, 3);

  return (
    <View
      style={[styles.card, { borderColor: colors.cardBorder }]}
      lightColor={colors.card}
      darkColor={colors.card}
    >
      <View
        style={[styles.colorBar, { backgroundColor: circle.color }]}
        lightColor={circle.color}
        darkColor={circle.color}
      />
      <Text style={styles.name}>{circle.name}</Text>
      <Text style={[styles.count, { color: colors.textSecondary }]}>
        {memberCount} {memberCount === 1 ? 'person' : 'people'}
      </Text>
      {previewMembers.length > 0 && (
        <View style={styles.avatarRow} lightColor="transparent" darkColor="transparent">
          {previewMembers.map((member) => (
            <AvatarCircle
              key={member.id}
              photoUri={member.photoUri}
              initials={getInitials(member)}
              size={28}
              backgroundColor={circle.color}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    minHeight: 120,
  },
  colorBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
  },
  count: {
    fontSize: 13,
    marginTop: 2,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
});
