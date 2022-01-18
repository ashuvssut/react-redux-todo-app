import {
	configureStore,
	createSlice,
	PayloadAction,
} from "@reduxjs/toolkit";
import logger from "redux-logger";
import { v1 as uid } from "uuid";
import { Todo } from "./type";

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

const todosSlice = createSlice({
	name: "todos",
	initialState: todosInitialState,
	reducers: {
		// create: (state, { payload }: PayloadAction<Todo>) => {
		// 	state.push({ id: uid(), desc: payload.desc, isComplete: false });
		// }, WRONG WAY!! using uid() will make the create reducer impure
		create: {
			prepare: ({ desc }: { desc: string }): { payload: Todo } => {
				//{desc} is the payload that we need
				return {
					payload: {
						id: uid(),
						desc,
						isComplete: false,
					},
				};
			},
			reducer: (state, { payload }: PayloadAction<Todo>) => {
				state.push(payload);
			},
		},
		edit: (state, { payload }: PayloadAction<{ id: string; desc: string }>) => {
			const targetTodo = state.find(todo => todo.id === payload.id);
			if (targetTodo) {
				targetTodo.desc = payload.desc;
			}
		},
		toggle: (
			state,
			{ payload }: PayloadAction<{ id: string; isComplete: boolean }>,
		) => {
			const targetTodo = state.find(todo => todo.id === payload.id);
			if (targetTodo) {
				targetTodo.isComplete = payload.isComplete;
			}
		},
		remove: (state, { payload }: PayloadAction<{ id: string }>) => {
			const targetTodoIndex = state.findIndex(todo => todo.id === payload.id);
			if (targetTodoIndex !== -1) {
				state.splice(targetTodoIndex, 1);
			}
		},
	},
});

const selectedTodoSlice = createSlice({
	name: "selectedTodo",
	initialState: null as string | null,
	reducers: {
		select: (state, { payload }: PayloadAction<{ id: string }>) => {
			return payload.id;
			// we cant do "state = payload.id" because payload.id/state is a string which is a primitive type
		},
	},
});

const counterSlice = createSlice({
	name: "counter",
	initialState: 0,
	reducers: {},
	extraReducers: {
		[todosSlice.actions.create.type]: state => state + 1, // return new state without mutation (bcz state is a string which is a primitive type)
		[todosSlice.actions.edit.type]: state => state + 1,
		[todosSlice.actions.remove.type]: state => state + 1,
		[todosSlice.actions.toggle.type]: state => state + 1,
	},
});

export const {
	create: createTodoActionCreator,
	edit: editTodoActionCreator,
	toggle: toggleTodoActionCreator,
	remove: deleteTodoActionCreator,
} = todosSlice.actions;

export const { select: selectTodoActionCreator } = selectedTodoSlice.actions;

const reducers = {
	todos: todosSlice.reducer,
	selectedTodo: selectedTodoSlice.reducer,
	counter: counterSlice.reducer,
};
const store = configureStore({
	reducer: reducers,
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
});
export default store;
