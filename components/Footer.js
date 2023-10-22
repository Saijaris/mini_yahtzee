import React from 'react'
import { Text, View } from 'react-native'
import styles from '../style/Styles'

export default function Footer() {
    return (
        <View style={styles.footer}>
            <Text style={styles.author}>
                Author: Saija Ristolainen
            </Text>
        </View>
    )
}