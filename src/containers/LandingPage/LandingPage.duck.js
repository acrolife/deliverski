
import { storableError } from '../../util/errors';

// ================ Action types ================ //

export const SET_INITIAL_STATE = 'app/LandingPage/SET_INITIAL_STATE';
export const SHOW_USER_PROVIDER_DATA = 'app/LandingPage/SHOW_USER_PROVIDER_DATA';
export const SHOW_USER_PROVIDER_DATA_ERROR = 'app/LandingPage/SHOW_USER_PROVIDER_DATA_ERROR';

// ================ Reducer ================ //

const initialState = {
  userProviders: [],
  showUserProvidersError: null,
};

export default function landingPageReducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case SET_INITIAL_STATE:
      return { ...initialState };
    case SHOW_USER_PROVIDER_DATA:
      return { ...state,  userProviders: [... state.userProviders, payload], showUserProvidersError: null};
    case SHOW_USER_PROVIDER_DATA_ERROR:
      return { ...state, userProviders: [], showUserProvidersError: payload };
    default:
      return state;
  }
}

// ================ Action creators ================ //

export const setInitialState = () => ({
  type: SET_INITIAL_STATE,
});

export const showUserProvidersData = userProviders => ({
  type: SHOW_USER_PROVIDER_DATA,
  payload: userProviders,
});

export const showUserProvidersError = e => ({
  type: SHOW_USER_PROVIDER_DATA_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

export const queryUserProviders = () => (dispatch, getState, sdk) => {

  return sdk.listings.query(
    { include: ["author"] }
  ).then(res => {
    const listingsObject = res.data.data    
    return listingsObject
  }).then(
    res => {

      const userProvidersId = res.map((e) => e.relationships.author.data.id.uuid)
      // Removes duplicates : https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates 
      const userProvidersIdUniques = userProvidersId.filter((v, i, a) => a.indexOf(v) === i);
      return userProvidersIdUniques
    }
  ).then(
    res => {
      Promise.all(res.map(async (e) => {
        res = await sdk.users.show({ id: e })
        const useProvider = res.data.data
        dispatch(showUserProvidersData(useProvider))
      }))
    }
  ).catch(e => dispatch(showUserProvidersError(storableError(e))));

}


export const loadData = () => (dispatch, getState, sdk) => {

  // Clear state so that previously loaded data is not visible
  // in case this page load fails.
  dispatch(setInitialState());

  return Promise.all([    
    dispatch(queryUserProviders()),
  ]);
}
