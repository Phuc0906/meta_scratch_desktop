const SET_FULL_SCREEN = 'scratch-gui/mode/SET_FULL_SCREEN';
const SET_PLAYER = 'scratch-gui/mode/SET_PLAYER';
const SET_CAMERA = 'scratch-gui/mode/SET_CAMERA';

const initialState = {
    showBranding: false,
    isFullScreen: false,
    isPlayerOnly: false,
    hasEverEnteredEditor: true,
    isOpenCamera: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_FULL_SCREEN:
        return Object.assign({}, state, {
            isFullScreen: action.isFullScreen
        });
    case SET_CAMERA:
        return Object.assign({}, state, {
            isOpenCamera: action.isOpenCamera
        })
    case SET_PLAYER:
        return Object.assign({}, state, {
            isPlayerOnly: action.isPlayerOnly,
            hasEverEnteredEditor: state.hasEverEnteredEditor || !action.isPlayerOnly
        });
    default:
        return state;
    }
};


const setFullScreen = function (isFullScreen) {
    return {
        type: SET_FULL_SCREEN,
        isFullScreen: isFullScreen
    };
};
const setPlayer = function (isPlayerOnly) {
    return {
        type: SET_PLAYER,
        isPlayerOnly: isPlayerOnly
    };
};

const setCamera = function (isOpenCamera) {
    console.log("On Press Setting Camera: " + isOpenCamera);
    
    return {
        type: SET_CAMERA,
        isOpenCamera: isOpenCamera
    }
}

export {
    reducer as default,
    initialState as modeInitialState,
    setFullScreen,
    setPlayer,
    setCamera
};
