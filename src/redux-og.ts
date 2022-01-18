// Redundant code. Ffor reference only.
import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";

import { v1 as uid } from "uuid";
import { State, Todo } from "./type";

// constants
const CREATE_TODO = "CREATE_TODO";
const EDIT_TODO = "EDIT_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const DELETE_TODO = "DELETE_TODO";
const SELECT_TODO = "SELECT_TODO";

// Actions & Action Type
interface CreateTodoActionType {
	type: string;
	payload: Todo;
}

// ActionCreators
export const createTodoActionCreator = ({
	desc,
}: {
	desc: string;
}): CreateTodoActionType => {
	return {
		type: CREATE_TODO,
		payload: {
			id: uid(),
			desc,
			isComplete: false,
		},
	};
};

interface EditTodoActionType {
	type: string;
	payload: { id: string; desc: string };
}

export const editTodoActionCreator = ({
	id,
	desc,
}: EditTodoActionType["payload"]): EditTodoActionType => {
	return {
		type: EDIT_TODO,
		payload: {
			id,
			desc,
		},
	};
};

interface ToggleTodoActionType {
	type: string;
	payload: { id: string; isComplete: boolean };
}

export const toggleTodoActionCreator = ({
	id,
	isComplete,
}: ToggleTodoActionType["payload"]): ToggleTodoActionType => {
	return {
		type: TOGGLE_TODO,
		payload: {
			id,
			isComplete,
		},
	};
};

interface DeleteTodoActionType {
	type: string;
	payload: { id: string };
}

export const deleteTodoActionCreator = ({
	id,
}: {
	id: string;
}): DeleteTodoActionType => {
	return {
		type: DELETE_TODO,
		payload: {
			id,
		},
	};
};

interface SelectTodoActionType {
	type: string;
	payload: { id: State["selectedTodo"] };
}

export const selectTodoActionCreator = ({
	id,
}: {
	id: string;
}): SelectTodoActionType => {
	return {
		type: SELECT_TODO,
		payload: {
			id,
		},
	};
};

// Reducers

const todosInitialState: Todo[] = [
	{
		id: uid(),
		desc: "Learn React",
		isComplete: true,
	},
	{
		id: uid(),
		desc: "Learn Redux",
		isComplete: true,
	},
	{
		id: uid(),
		desc: "Learn Redux-ToolKit",
		isComplete: false,
	},
];

type TodoActionTypes =
	| CreateTodoActionType
	| EditTodoActionType
	| ToggleTodoActionType
	| DeleteTodoActionType;
const todosReducer = (
	state: Todo[] = todosInitialState,
	{ type, payload }: TodoActionTypes,
): State["todos"] => {
	switch (type) {
		case CREATE_TODO:
			return [...state, payload as Todo];
		case EDIT_TODO:
		case TOGGLE_TODO:
			return state.map(todo =>
				todo.id === payload.id ? { ...todo, ...payload } : todo,
			);
		case DELETE_TODO:
			return state.filter(todo => todo.id !== payload.id);

		default: {
			console.warn(
				`You might have a unhandled action.type: ${type} in todosReducer`,
			);
			return state;
		}
	}
};

type SelectedTodoActionTypes = SelectTodoActionType;
const selectedTodoReducer = (
	state: string | null = null,
	{ type, payload }: SelectedTodoActionTypes,
): State["selectedTodo"] => {
	switch (type) {
		case SELECT_TODO:
			return payload.id;
		default: {
			console.warn(
				`You might have a unhandled action.type: ${type} in selectedTodosReducer`,
			);
			return state;
		}
	}
};

// type counterActionTypes = counter
const counterReducer = (
	state: number = 0,
	action: TodoActionTypes,
): State["counter"] => {
	switch (action.type) {
		case CREATE_TODO:
		case EDIT_TODO:
		case TOGGLE_TODO:
		case DELETE_TODO:
			return state + 1;

		default: {
			console.warn(
				`You might have a unhandled action.type: ${action.type} in counterReducer`,
			);
			return state;
		}
	}
};

const reducers = combineReducers({
	todos: todosReducer,
	selectedTodo: selectedTodoReducer,
	counter: counterReducer,
});

//Store
const store = createStore(
	reducers,
	composeWithDevTools(applyMiddleware(thunk, logger)),
);
export default store;
