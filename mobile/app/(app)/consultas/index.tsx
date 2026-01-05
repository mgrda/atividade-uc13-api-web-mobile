import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ConsultasIndex() {
    return (
        <View style={styles.container}>
            <Text>Consultas Index</Text>
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
