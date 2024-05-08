export const errorSlice = (set, get) => ({
	errorMsg: null,

    clearError: () => set({ errorMsg: null }),
    
    setError: (newError) => set({ errorMsg: newError }),
})