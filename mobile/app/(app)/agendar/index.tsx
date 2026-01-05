import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AgendarIndex() {
    return (
        <View style={styles.container}>
            <Text>Agendar Index</Text>
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
