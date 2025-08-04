import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    compareList: [], // Array of products to compare
    isCompareMode: false, // Whether compare mode is active
    maxCompareItems: 4, // Maximum items that can be compared
}

const compareSlice = createSlice({
    name: 'compare',
    initialState,
    reducers: {
        addToCompare: (state, action) => {
            const product = action.payload
            
            // Add null check for product and product.id
            if (!product || !product.id) {
                console.warn('Invalid product data provided to addToCompare');
                return;
            }
            
            const exists = state.compareList.find(item => item?.id === product.id)
            
            if (!exists && state.compareList.length < state.maxCompareItems) {
                state.compareList.push(product)
            }
        },
        removeFromCompare: (state, action) => {
            const productId = action.payload
            
            // Add null check for productId
            if (!productId) {
                console.warn('Invalid product ID provided to removeFromCompare');
                return;
            }
            
            state.compareList = state.compareList.filter(item => item?.id !== productId)
        },
        clearCompareList: (state) => {
            state.compareList = []
        },
        toggleCompareMode: (state) => {
            state.isCompareMode = !state.isCompareMode
        },
        setCompareMode: (state, action) => {
            state.isCompareMode = action.payload
        }
    }
})

export const {
    addToCompare,
    removeFromCompare,
    clearCompareList,
    toggleCompareMode,
    setCompareMode
} = compareSlice.actions

// Selectors
export const selectCompareList = (state) => state.compare.compareList
export const selectIsCompareMode = (state) => state.compare.isCompareMode
export const selectCompareCount = (state) => state.compare.compareList.length
export const selectCanAddToCompare = (state) => state.compare.compareList.length < state.compare.maxCompareItems

export default compareSlice.reducer
