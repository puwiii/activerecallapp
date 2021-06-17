export const initialState = {
    myLists: [],
    user: undefined,
};

const reducer = (state, action) => { 
    switch(action.type){
        case 'ADD_TO_MY_LIST':
            return{
                ...state,
                myList: [...state.myList, action.item],  
            };
            
        case 'SET_USER':
            return{
                ...state,
                user: action.user,  
            };

        default:
            return state;
    }
};

export default reducer;