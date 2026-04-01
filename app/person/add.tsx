import { useState } from 'react';
import { StyleSheet, TextInput, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Text, View } from '@/components/Themed';
import { AvatarCircle } from '@/components/AvatarCircle';
import { usePersonStore } from '@/stores/usePersonStore';
import { useCircleStore } from '@/stores/useCircleStore';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function AddPersonScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const addPerson = usePersonStore((s) => s.addPerson);
  const circles = useCircleStore((s) => s.getAllCircles());

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCircleIds, setSelectedCircleIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || '?';

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const toggleCircle = (circleId: string) => {
    setSelectedCircleIds((prev) =>
      prev.includes(circleId) ? prev.filter((id) => id !== circleId) : [...prev, circleId]
    );
  };

  const handleSave = () => {
    if (!firstName.trim()) {
      Alert.alert('Required', 'First name is required');
      return;
    }
    addPerson({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      photoUri,
      phoneNumbers: phone.trim() ? [phone.trim()] : [],
      emails: email.trim() ? [email.trim()] : [],
      circleIds: selectedCircleIds,
      notes: notes.trim(),
    });
    router.back();
  };

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable style={styles.avatarSection} onPress={pickImage}>
        <AvatarCircle photoUri={photoUri} initials={initials} size={80} />
        <Text style={[styles.photoHint, { color: colors.tint }]}>Tap to add photo</Text>
      </Pressable>

      <Text style={[styles.label, { color: colors.textSecondary }]}>First Name *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.cardBorder }]}
        placeholder="First name"
        placeholderTextColor={colors.placeholder}
        value={firstName}
        onChangeText={setFirstName}
        autoFocus
      />

      <Text style={[styles.label, { color: colors.textSecondary }]}>Last Name</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.cardBorder }]}
        placeholder="Last name"
        placeholderTextColor={colors.placeholder}
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={[styles.label, { color: colors.textSecondary }]}>Phone</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.cardBorder }]}
        placeholder="Phone number"
        placeholderTextColor={colors.placeholder}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.cardBorder }]}
        placeholder="Email address"
        placeholderTextColor={colors.placeholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={[styles.label, { color: colors.textSecondary }]}>Circles</Text>
      <View style={styles.circleRow} lightColor="transparent" darkColor="transparent">
        {circles.map((circle) => {
          const selected = selectedCircleIds.includes(circle.id);
          return (
            <Pressable
              key={circle.id}
              style={[
                styles.circleChip,
                {
                  backgroundColor: selected ? circle.color : colors.backgroundSecondary,
                  borderColor: circle.color,
                },
              ]}
              onPress={() => toggleCircle(circle.id)}
            >
              <Text
                style={[styles.circleChipText, { color: selected ? '#fff' : circle.color }]}
                lightColor={selected ? '#fff' : circle.color}
                darkColor={selected ? '#fff' : circle.color}
              >
                {circle.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.label, { color: colors.textSecondary }]}>Notes</Text>
      <TextInput
        style={[
          styles.input,
          styles.notesInput,
          { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.cardBorder },
        ]}
        placeholder="Personal notes..."
        placeholderTextColor={colors.placeholder}
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <Pressable
        style={({ pressed }) => [styles.saveButton, { backgroundColor: colors.tint }, pressed && styles.pressed]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText} lightColor="#fff" darkColor="#000">Save</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 6,
  },
  photoHint: {
    fontSize: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    paddingTop: 10,
  },
  circleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  circleChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  circleChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});
