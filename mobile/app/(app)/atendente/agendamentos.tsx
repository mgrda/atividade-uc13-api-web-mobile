import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AtendenteAgendamentos() {
    return (
        <View style={styles.container}>
            <Text>Atendente: Agendamentos</Text>
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
