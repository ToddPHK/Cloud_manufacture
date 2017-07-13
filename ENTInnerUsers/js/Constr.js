var plateForm_state = [18, 22, 6];
function ReadFromUserDB(state) {
    var temp = 1;
    for (var i = 0; i < plateForm_state.length; i++) {
        if (state == plateForm_state[i]) {
            temp = 2;
            break;
        }
    }
    return temp;
}