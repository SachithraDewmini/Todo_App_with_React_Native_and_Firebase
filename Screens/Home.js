import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { firebase } from '../config';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const todoRef = firebase.firestore().collection('todos');
    const [addData, setAddData] = useState('');
    const navigation = useNavigation();

    // Fetch or read the data from Firestore
    useEffect(() => {
        todoRef
            .orderBy('created', 'desc')
            .onSnapshot(querySnapshot => {
                const todos = [];
                querySnapshot.forEach((doc) => {
                    const { heading } = doc.data();
                    todos.push({
                        id: doc.id,
                        heading,
                    });
                });
                setTodos(todos);
            });
    }, []);

    // Delete a todo from Firestore DB
    const deleteTodo = (todo) => {
        todoRef
            .doc(todo.id)
            .delete()
            .then(() => {
                // Show a successful alert
                alert("Deleted Successfully");
            })
            .catch((error) => {
                alert(error);
            });
    };

    // Add a Todo
    const addTodo = () => {
        // Check if we have a todo
        if (addData && addData.length > 0) {
            // Get the timestamp
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                heading: addData,
                created: timestamp
            };
            todoRef
                .add(data)
                .then(() => {
                    setAddData('');
                    // Release the keyboard
                    Keyboard.dismiss();
                })
                .catch((error) => {
                    alert(error);
                });
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.formcontainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Add a New Todo'
                    placeholderTextColor='#aaaaaa'
                    onChangeText={(heading) => setAddData(heading)}
                    value={addData}
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                />
                <TouchableOpacity style={styles.button} onPress={addTodo}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={todos}
                numColumns={1}
                renderItem={({ item }) => (
                    <View style={styles.todoContainer}>
                        <Pressable
                            style={styles.container}
                            onPress={() => navigation.navigate('Detail', { item })}
                        >
                            <View style={styles.innerContainer}>
                                <Text style={styles.itemHeading}>
                                    {item.heading[0].toUpperCase() + item.heading.slice(1)}
                                </Text>
                            </View>
                        </Pressable>
                        <View style={styles.iconContainer}>
                            <FontAwesome
                                name='edit'
                                color='blue'
                                onPress={() => navigation.navigate('Detail', { item })} // Navigate to update screen
                                style={styles.todoIcon}
                            />
                            <FontAwesome
                                name='trash-o'
                                color='red'
                                onPress={() => deleteTodo(item)}  // Pass `item` to deleteTodo
                                style={styles.todoIcon}
                            />
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e5e5e5',
        padding: 15,
        borderRadius: 15,
        margin: 5,
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    innerContainer: {
        alignItems: 'center',
        flexDirection: 'column',
        marginLeft: 10,
    },
    itemHeading: {
        fontWeight: 'bold',
        fontSize: 18,
        marginRight: 22,
    },
    formcontainer: {
        flexDirection: 'row',
        height: 80,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 100,
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingLeft: 16,
        flex: 1,
        marginRight: 5,
    },
    button: {
        height: 47,
        borderRadius: 5,
        backgroundColor: '#788eec',
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
    todoIcon: {
        fontSize: 20,
        marginLeft: 14,
        marginTop: 5,
    },
    todoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
});
