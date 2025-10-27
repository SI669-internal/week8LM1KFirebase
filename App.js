import { useState, useEffect } from 'react';
import { Button, Overlay, Icon, Input } from '@rneui/base';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query,
  doc, getDocs, updateDoc, addDoc, deleteDoc
} from "firebase/firestore";
import { firebaseConfig } from './Secrets';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function ListMaker1000 () {


  // STATE VARIABLES AND THEIR UPDATERS
  const [todos, setTodos] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedItem, setSelectedItem] = useState(undefined);


  async function loadInitList() {
    const initList = [];
    const collRef = collection(db, 'todos');
    const q = query(collRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.forEach((docSnapshot)=>{
      const todo = docSnapshot.data();
      todo.key = docSnapshot.id;
      initList.push(todo);
    });
    setTodos(initList);
  }

  useEffect(()=>{ // don't forget to import me!
    loadInitList();
  }, []);

  // DATA MODEL FUNCTIONS (CRUD)

  const createTodo = async (todoText) => {
    const newTodo = {
      text: todoText,
    }
    const todoCollRef = collection(db, 'todos');
    const todoSnap = await addDoc(todoCollRef, newTodo);  
    newTodo.key = todoSnap.id;
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
  }

  const updateTodo = async (todo, newText) => { 
    let newTodo = {...todo}; // or Object.assign({}, todo);
    newTodo.text = newText;
    delete newTodo.key;
    const docToUpdate = doc(db, 'todos', todo.key);
    await updateDoc(docToUpdate, newTodo);


    let newTodos = todos.map(item=>item.key===todo.key ? newTodo : item );
    setTodos(newTodos);
  }


  const deleteTodo = async (todo) => {    
    // delete from Firestore
    const docToDelete = doc(db, 'todos', todo.key);
    await deleteDoc(docToDelete);

    // delete from component state
    const newTodos = todos.filter((item)=>item.key != todo.key);
    setTodos(newTodos);
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
