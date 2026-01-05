import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MedicoAgenda() {
    return (
        <View style={styles.container}>
            <Text>Medico: Agenda</Text>
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
