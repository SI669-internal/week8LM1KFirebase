import React, { useState } from 'react';
import { Button, Overlay, Icon, Input } from '@rneui/base';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

function ListMaker1000 () {

  // INITIAL VALUES FOR TESTING
  const initTodos = [
    { text: 'Get milk', key: 1},
    { text: 'Drop off dry cleaning', key: 2},
    { text: 'Finish 669 homework', key: 3}
  ];

  // STATE VARIABLES AND THEIR UPDATERS
  const [todos, setTodos] = useState(initTodos);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedItem, setSelectedItem] = useState(undefined);

  // DATA MODEL FUNCTIONS (CRUD)
  const createTodo = (todoText) => {
    setTodos([...todos, {text: todoText, key: new Date().getTime()}])
  }

  const updateTodo = (todo, newText) => { 
    let newTodo = {...todo}; // or Object.assign({}, todo);
    newTodo.text = newText;
    let newTodos = todos.map(item=>item.key===todo.key ? newTodo : item );
    setTodos(newTodos);
  }

  const deleteTodo = (todo) => {
    setTodos(todos.filter(t => t.key !== todo.key));
  }
  // END DATA MODEL

  // CUSTOM COMPONENT FOR DISPLAYING A SINGLE LIST ITEM
  function TodoListItem({item}) {
    return (
      <View style={styles.listItemView}>
        <View style={styles.li1}>
          <Text style={styles.listItemText}>{item.text}</Text>
        </View>
        <TouchableOpacity 
          style={styles.li2}
          onPress={()=>{
            setSelectedItem(item);
            setInputText(item.text);
            setOverlayVisible(true);
          }}  
        >
          <MaterialIcons name="edit" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.li3}
          onPress={() => deleteTodo(item)}
        >
          <MaterialIcons name="delete" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  }

  // MAIN UI
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          ListMaker 1000
        </Text>
      </View>
      <View style={styles.body}>
        <FlatList
          data={todos}
          renderItem={({item})=>{
            return (
              <TodoListItem item={item}/>
            );
          }}
        />
      </View>
      <View style={styles.footer}>
        <Button 
          size='lg' 
          color='#AAAACC'
          onPress={()=>{setOverlayVisible(true)}}
        >
          <MaterialIcons name="add" size={36} color="black" />
        </Button>
      </View>

      {/* OVERLAY COMPONENT: SHOWN ON TOP WHEN visible==true */}
      <Overlay 
        isVisible={overlayVisible} 
        onBackdropPress={()=>setOverlayVisible(false)}
        overlayStyle={styles.overlayView}  
      >
        <Input
          placeholder='New Todo Item'
          value={inputText}
          onChangeText={(newText)=>setInputText(newText)}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-around', width:'80%'}}>
          <Button
            title="Cancel"
            onPress={()=>{
              setSelectedItem(undefined);
              setInputText('');
              setOverlayVisible(false)
            }}  
          />
          <Button
            title={selectedItem ? "Update Todo" : "Add Todo"}
            onPress={()=>{
              if (selectedItem) {
                updateTodo(selectedItem, inputText);
              } else {
                createTodo(inputText);
              }
              setSelectedItem(undefined);
              setInputText('');
              setOverlayVisible(false);
            }}
          />
        </View>
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flex: 0.1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: '20%',
    paddingBottom: '5%',
    backgroundColor: '#AAAACC'
  },
  headerText: {
    fontSize: 44,
    color: '#444477'
  },
  body: {
    flex: 0.5,
    width: '100%',
    paddingLeft: '5%',
    paddingTop: '5%'
  },
  listItemView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '1%',
  },
  li1: {
    flex: 0.8, 
    paddingRight: '3%'
  },
  li2: {
    flex: 0.1,
    backgroundColor: 'white'
  },
  li3: {
    flex: 0.1,
    backgroundColor: 'white'
  },
  listItemText: {
    fontSize: 24
  },
  footer: {
    flex: 0.2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  overlayView: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    backgroundColor: 'white'
  }
});

export default ListMaker1000;
