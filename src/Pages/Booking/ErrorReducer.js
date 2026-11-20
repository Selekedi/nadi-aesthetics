export const initialState = {
    slot:null,
    date:null,
    style:null
}

const ErrorMessages = {
    slot:"Timeslot must be selected",
    date:"Date Must be selected",
    style:"Style must be selected"
}

export const ErrorReducer = (state,action) => {
    switch (action.type) {
        case "UPDATE_FIELD":
            return {
                ...state,
                [action.fieldName]:ErrorMessages[action.fieldName]
            }
        case "RESET_FIELD":
            return {
                ...state,
                [action.fieldName]:null
            }
        case "RESET": 
            return {
                ...initialState
            }

        default:
            throw new Error("Action type doesnt exist")
    }
}
