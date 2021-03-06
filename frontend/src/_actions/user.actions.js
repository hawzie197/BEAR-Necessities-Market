import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const userActions = {
    login,
    logout,
    getAllUsers,
    resetPassword
};


/**
 *  Create a session token bound to the user.
 *  On success, transfer user to the dashboard.
 *
 *  reference url = '/auth/login/'
 */
function login(username, password) {

    return dispatch => {

        // Initialize logging in dependencies
        // - Progress bar
        dispatch({type: userConstants.LOGIN_REQUEST});

        // Request token and log user in on
        // successful response.
        userService.login(username, password)
            .then(
                user => {
                    dispatch({
                      type: userConstants.LOGIN_SUCCESS,
                      user
                    });
                    history.push('/');
                },
                error => {
                    dispatch({
                      type: userConstants.LOGIN_FAILURE,
                      error
                    });
                    dispatch(alertActions.error(error));
                }
            );
    };

}

function resetPassword(email) {

  return dispatch => {
    // send user reset password link
    userService.resetPassword(email)
      .then(
        res => {
          dispatch({
            type: userConstants.RESET_LINK_SUCCESS,
          });
        },
        error => {
          dispatch({
            type: userConstants.RESET_LINK_FAILURE,
            error
          });
          dispatch(alertActions.error(error));
        }
      );
  }
}

/**
 *  Logout a user and return them to /signin
 */
function logout() {

  // Destroy access token and refresh token
  userService.logout();

  return dispatch => {
    dispatch({type: userConstants.LOGOUT})
  };
}


/**
 *  Get all users from the database.
 *  reference url = '/users/'
 */
function getAllUsers() {
  return dispatch => {
    dispatch({
      type: userConstants.GETALL_REQUEST
    });

    userService.getAll()
      .then(
        users => dispatch({
          type: userConstants.GETALL_SUCCESS,
          users
        }),
        error => dispatch({
          type: userConstants.GETALL_FAILURE,
          error
        })
      );
  };
}
