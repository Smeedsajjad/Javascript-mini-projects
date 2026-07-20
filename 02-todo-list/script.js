const STORAGE_KEY = "todo";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");


const state = {
    todos: [],
    editingId: null
};


// ---------------- STORAGE ----------------

function save() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state.todos)
    );
}


function load() {
    const saved = localStorage.getItem(STORAGE_KEY);

    state.todos = saved ? JSON.parse(saved) : [];
}


// ---------------- CRUD FUNCTIONS ----------------

function addTodo(text) {

    state.todos.push({
        id: Date.now().toString(),
        text,
        checkbox: false
    });

}


function updateTodo(id, text) {

    const todo = state.todos.find(
        todo => todo.id === id
    );

    if (todo) {
        todo.text = text;
    }

}


function deleteTodo(id) {

    state.todos = state.todos.filter(
        todo => todo.id !== id
    );

}


function toggleTodo(id, checked) {

    const todo = state.todos.find(
        todo => todo.id === id
    );

    if(todo){
        todo.checkbox = checked;
    }

}


// ---------------- FORM SUBMIT ----------------

form.addEventListener("submit", (e)=>{

    e.preventDefault();


    const text = input.value.trim();

    if(!text) return;


    if(state.editingId){

        updateTodo(
            state.editingId,
            text
        );

        state.editingId = null;


    } else {

        addTodo(text);

    }


    save();
    render();


    input.value = "";

});



// ---------------- EVENT DELEGATION ----------------

list.addEventListener("click",(e)=>{


    const item = e.target.closest(".todo-item");


    if(!item) return;


    const id = item.dataset.id;



    // EDIT BUTTON

    if(e.target.classList.contains("edit")){


        const todo = state.todos.find(
            todo => todo.id === id
        );


        input.value = todo.text;

        state.editingId = id;


    }



    // DELETE BUTTON

    if(e.target.classList.contains("delete")){


        deleteTodo(id);


        save();
        render();

    }

});




// CHECKBOX EVENT

list.addEventListener("change",(e)=>{


    if(!e.target.classList.contains("todo-checkbox"))
        return;


    const item = e.target.closest(".todo-item");


    const id = item.dataset.id;


    toggleTodo(
        id,
        e.target.checked
    );


    save();


    item.style.textDecoration =
        e.target.checked
        ? "line-through"
        : "none";

});




// ---------------- UI ----------------


function createNode(todo){


    const li = document.createElement("li");

    li.className = "todo-item";


    // connect DOM with data

    li.dataset.id = todo.id;



    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.className = "todo-checkbox";

    checkbox.checked = todo.checkbox;



    const text = document.createElement("span");

    text.textContent = todo.text;



    const actions = document.createElement("div");

    actions.className="todo-actions";



    const editBtn=document.createElement("button");

    editBtn.className="todo-btn edit";

    editBtn.textContent="✎";



    const deleteBtn=document.createElement("button");

    deleteBtn.className="todo-btn delete";

    deleteBtn.textContent="×";



    actions.append(
        editBtn,
        deleteBtn
    );


    li.append(
        checkbox,
        text,
        actions
    );


    if(todo.checkbox){

        li.style.textDecoration="line-through";

    }


    return li;

}




function render(){


    list.innerHTML="";


    const fragment =
        document.createDocumentFragment();



    state.todos.forEach(todo=>{

        fragment.appendChild(
            createNode(todo)
        );

    });



    list.appendChild(fragment);

}



// ---------------- START APP ----------------


load();

render();