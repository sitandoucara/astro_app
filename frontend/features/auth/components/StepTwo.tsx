// components/StepTwo.tsx
import { Key, useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import useLocationSearch, { LocationResult } from '../../../shared/hooks/useLocationSearch';

export default function StepTwo({ formData, updateForm, onNext, onBack }: any) {
  const [query, setQuery] = useState(formData.birthplaceQuery);
  const { results, search } = useLocationSearch();

  useEffect(() => {
    if (query) search(query);
  }, [query]);

  // Valide que username, genre et lieu sont sélectionnés
  const isValid =
    formData.username.trim().length > 0 &&
    formData.gender !== null &&
    formData.selectedPlace !== null;

  return (
    <View className="flex-1 items-center justify-center space-y-4">
      <View className="mb-2 w-full items-center">
        <View className="mb-2 flex-row space-x-2">
          <View className="h-2 w-10 rounded-full bg-[#281109]" />
          <View className="h-2 w-10 rounded-full bg-[#281109]" />
          <View className="h-2 w-10 rounded-full bg-[#281109]/50" />
        </View>
        <Text className="text-xl font-bold text-[#32221E]">About you</Text>
        <Text className="text-sm text-[#7B635A]">Who are you among the stars?</Text>
      </View>

      <TextInput
        placeholder="Username"
        placeholderTextColor="#281109"
        value={formData.username}
        onChangeText={(text) => updateForm({ username: text })}
        className="w-64 rounded-full bg-white px-5 py-3 text-center"
      />

      <View className="mt-2 flex-row justify-center space-x-3">
        {['Male', 'Female', 'Other'].map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => updateForm({ gender: option })}
            className={`rounded-full border px-4 py-2 ${
              formData.gender === option ? 'bg-[#7B635A]' : 'bg-white'
            }`}>
            <Text className={formData.gender === option ? 'text-white' : 'text-[#281109]'}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Birthplace (e.g. Paris)"
        placeholderTextColor="#281109"
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          updateForm({ birthplaceQuery: text, selectedPlace: null });
        }}
        className="mt-2 w-64 rounded-full bg-white px-5 py-3 text-center"
      />

      {results.length > 0 && !formData.selectedPlace && (
        <View className="max-h-40 w-64 rounded-xl bg-white p-2">
          {results.map((item: LocationResult, idx: Key) => (
            <TouchableOpacity
              key={idx}
              onPress={() =>
                updateForm({ selectedPlace: item, birthplaceQuery: item.display_name })
              }
              className="py-2">
              <Text className="text-sm text-[#281109]">{item.display_name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        onPress={onNext}
        disabled={!isValid}
        className={`mt-5 w-64 rounded-full py-3 ${isValid ? 'bg-[#32221E]' : 'bg-[#32221E]/50'}`}>
        <Text className="text-center font-bold text-white">Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
