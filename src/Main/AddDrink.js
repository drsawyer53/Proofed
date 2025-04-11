import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // ✅ import this

const drinkTypes = ['Wine', 'Beer', 'Whiskey', 'Cocktail', 'Vodka', 'Tequila'];

export default function AddDrink() {
  const navigation = useNavigation(); // ✅ use hook for navigation
  const [name, setName] = useState('');
  const [type, setType] = useState(drinkTypes[0]);
  const [initialReaction, setInitialReaction] = useState(null);

  const handleNext = () => {
    if (!name || !type || !initialReaction) {
      alert('Please fill out all fields.');
      return;
    }

    navigation.navigate('CompareDrink', {
      name,
      type,
      reaction: initialReaction,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Add a Drink</Text>

        <TextInput
          style={styles.input}
          placeholder="Drink Name"
          value={name}
          onChangeText={setName}
        />

        <View style={styles.dropdown}>
          <Text style={styles.label}>Type:</Text>
          {drinkTypes.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.typeOption,
                type === item && { backgroundColor: '#b81c1c' },
              ]}
              onPress={() => setType(item)}
            >
              <Text style={[styles.optionText, type === item && { color: '#fff' }]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>How did you feel about it?</Text>
        <View style={styles.reactionRow}>
          <TouchableOpacity
            style={[
              styles.reactionButton,
              initialReaction === 'dislike' && styles.reactionSelected,
            ]}
            onPress={() => setInitialReaction('dislike')}
          >
            <Text style={styles.reactionText}>😖 Didn't Like</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.reactionButton,
              initialReaction === 'fine' && styles.reactionSelected,
            ]}
            onPress={() => setInitialReaction('fine')}
          >
            <Text style={styles.reactionText}>😐 It Was Fine</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.reactionButton,
              initialReaction === 'like' && styles.reactionSelected,
            ]}
            onPress={() => setInitialReaction('like')}
          >
            <Text style={styles.reactionText}>😍 Liked It</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff6f6',
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#b81c1c',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  dropdown: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  typeOption: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginBottom: 6,
  },
  optionText: {
    fontSize: 16,
  },
  reactionRow: {
    flexDirection: 'column',
    gap: 12,
    marginVertical: 16,
  },
  reactionButton: {
    backgroundColor: '#eee',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  reactionSelected: {
    backgroundColor: '#b81c1c',
  },
  reactionText: {
    fontSize: 16,
    color: '#000',
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: '#b81c1c',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

