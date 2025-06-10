// components/StepTwo.tsx
import { Key, useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, Modal, FlatList } from 'react-native';
import useLocationSearch, { LocationResult } from '../../../shared/hooks/useLocationSearch';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function StepTwo({ formData, updateForm, onNext, onBack }: any) {
  const [showPlaceModal, setShowPlaceModal] = useState(false);
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
    <View className="flex-1 p-10">
      <View className="mt-20 flex-1 justify-between">
        <View className="mb-2 w-full items-center">
          <View className="mb-2 flex-row gap-2">
            <View className="h-1 w-32 rounded-full bg-[#281109]" />
            <View className="h-1 w-32 rounded-full bg-[#281109]" />
            <View className="h-1 w-32 rounded-full bg-[#281109]/50" />
          </View>
          <Text className="text-aref text-sm text-[#7B635A]">Who are you among the stars?</Text>
        </View>

        <View className="mb-36  items-center justify-between">
          <TextInput
            placeholder="Username"
            placeholderTextColor="#281109"
            value={formData.username}
            onChangeText={(text) => updateForm({ username: text })}
            className="text-aref w-64 rounded-lg border border-[#5B453D] bg-[#91837C] px-5 py-3 text-left"
          />

          {/* Genre */}
          <View className="mt-4 flex-row justify-center gap-4">
            {['Male', 'Female', 'Other'].map((option) => {
              const iconName =
                option === 'Female'
                  ? 'female-sharp'
                  : option === 'Other'
                    ? 'male-female-sharp'
                    : 'male';

              const isSelected = formData.gender === option;
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => updateForm({ gender: option })}
                  className={`rounded-md border px-4 py-2 ${
                    isSelected ? 'bg-[#281109]' : 'bg-[#91837C]'
                  } items-center`}>
                  <Ionicons name={iconName} size={40} color={isSelected ? '#BFB0A7' : 'white'} />
                  <Text
                    className={`text-aref mt-1 font-bold ${isSelected ? 'text-[#BFB0A7]' : 'text-white'}`}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bouton pour ouvrir la modal Birthplace */}
          <TouchableOpacity
            onPress={() => setShowPlaceModal(true)}
            className="mt-8  rounded-lg border border-[#5B453D] bg-[#91837C] px-5 py-3">
            <Text className="text-aref t text-center text-[#281109]">
              {formData.birthplaceQuery || 'Select Birthplace'}
            </Text>
          </TouchableOpacity>

          {/* Boutons Back / Continue */}

          <View className="mt-4 rounded-full border-2  border-stone-600 p-2">
            <TouchableOpacity
              onPress={onNext}
              disabled={!isValid}
              activeOpacity={0.8}
              className={`shadow-opacity-30  elevation-1 w-64  rounded-full py-2  shadow-md shadow-light-text2  ${isValid ? 'bg-[#32221E]' : 'bg-[#32221E]/50'}`}>
              <Text className="text-aref text-center  text-base font-bold tracking-wide text-white">
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Modal pour la recherche de lieu */}
      <Modal
        visible={showPlaceModal}
        animationType="slide"
        onRequestClose={() => setShowPlaceModal(false)}>
        <View className="flex-1 bg-[#F2EAE0] p-6">
          {/* Header + Input */}
          <View>
            <View className="mb-4 mt-14 flex-row items-center justify-between">
              <Text className="text-aref text-xl font-bold text-[#32221E]">Choose Birthplace</Text>
              <TouchableOpacity onPress={() => setShowPlaceModal(false)}>
                <Ionicons name="close" size={32} color="#32221E" />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Type a city..."
              placeholderTextColor="#281109"
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                updateForm({ birthplaceQuery: text, selectedPlace: null });
              }}
              className="text-aref mb-4 w-full rounded-lg border border-[#5B453D] bg-[#91837C] px-4 py-3 text-[#281109]"
            />
          </View>

          {/* Résultats : wrap dans un flex-1 pour qu'ils s'affichent */}
          <View className="flex-1">
            <FlatList
              data={results}
              keyExtractor={(_, idx: Key) => String(idx)}
              style={{ flex: 1 }}
              ItemSeparatorComponent={() => <View className="border-b-[0.3px] border-[#281109]" />}
              renderItem={({ item }: { item: LocationResult }) => (
                <TouchableOpacity
                  onPress={() => {
                    updateForm({
                      selectedPlace: item,
                      birthplaceQuery: item.display_name,
                    });
                    setShowPlaceModal(false);
                  }}
                  className="py-3">
                  <Text className="text-aref text-[#281109]">{item.display_name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
