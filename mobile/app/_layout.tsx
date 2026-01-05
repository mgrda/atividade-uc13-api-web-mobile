import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(public)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen name="loading" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
