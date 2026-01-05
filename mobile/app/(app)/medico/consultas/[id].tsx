import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function MedicoConsultasId() {
    const { id } = useLocalSearchParams();
    return (
        <View style={styles.container}>
            <Text>Medico: Consulta {id}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
