import { StyleSheet, Image } from 'react-native';
import { View, Text } from '@/components/Themed';

interface AvatarCircleProps {
  photoUri?: string;
  initials: string;
  size?: number;
  backgroundColor?: string;
}

export function AvatarCircle({ photoUri, initials, size = 48, backgroundColor = '#2f95dc' }: AvatarCircleProps) {
  const borderRadius = size / 2;
  const fontSize = size * 0.38;

  if (photoUri) {
    return (
      <Image
        source={{ uri: photoUri }}
        style={[styles.image, { width: size, height: size, borderRadius }]}
      />
    );
  }

  return (
    <View
      style={[styles.fallback, { width: size, height: size, borderRadius, backgroundColor }]}
      lightColor={backgroundColor}
      darkColor={backgroundColor}
    >
      <Text style={[styles.initials, { fontSize }]} lightColor="#fff" darkColor="#fff">
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '600',
  },
});
