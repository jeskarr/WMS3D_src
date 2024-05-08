import { create } from 'zustand'
import { whsSlice } from './whsSlice'
import { shelvesSlice } from './shelvesSlice'
import { productsSlice } from './productsSlice'
import { interactionsSlice } from './interactionsSlice'
import { errorSlice } from './errorSlice'
import { fileManagementSlice } from './fileManagementSlice'


export const boundStore = create((...a) => ({
	...whsSlice(...a),
	...shelvesSlice(...a),
	...productsSlice(...a),
	...interactionsSlice(...a),
	...errorSlice(...a),
	...fileManagementSlice(...a),
}))