import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { firebase } from '../config';

const Detail = ({ route }) => {
    const todoRef = firebase.firestore().collection('todos');
    const [textHeading, onChangeHeadingText] = useState(route.params.item.heading);
    const [created, setCreated] = useState('');
    const [description, setDescription] = useState(''); // Assuming there's a description field
    const navigation = useNavigation();

    // Fetch the complete details of the todo item
    useEffect(() => {
        todoRef
            .doc(route.params.item.id)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    const todo = documentSnapshot.data();
                    setCreated(todo.created?.toDate().toString() || 'N/A');
                    setDescription(todo.description || 'No description available');
                }
            });
    }, []);

    const updateTodo = () => {
        if (textHeading && textHeading.length > 0) {
            todoRef
                .doc(route.params.item.id)
                .update({
                    heading: textHeading,
                }).then(() => {
                    navigation.navigate('Home');
                }).catch((error) => {
                    alert(error.message);
                });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Heading:</Text>
            <TextInput
                style={styles.textField}
                onChangeText={onChangeHeadingText}
                value={textHeading}
                placeholder="Update Todo"
            />

            <Text style={styles.label}>Created:</Text>
            <Text style={styles.detailText}>{created}</Text>

            <Text style={styles.label}>Description:</Text>
            <Text style={styles.detailText}>{description}</Text>

            <Pressable
                style={styles.buttonUpdate}
                onPress={updateTodo}
            >
                <Text>UPDATE TODO</Text>
            </Pressable>
        </View>
    );
}

export default Detail;

const styles = StyleSheet.create({
    container: {
        marginTop: 80,
        marginLeft: 15,
        marginRight: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    textField: {
        marginBottom: 10,
        padding: 10,
        fontSize: 15,
        color: '#000000',
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
    },
    detailText: {
        fontSize: 14,
        color: '#555555',
        marginBottom: 20,
    },
    buttonUpdate: {
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        elevation: 10,
        backgroundColor: '#0de065',
    },
});
