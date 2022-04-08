
import { JoinFull } from '@mui/icons-material';
import { storableError } from '../../util/errors';
import { fetchCurrentUser } from '../../ducks/user.duck';
// import config from '../../config';
// import { types as sdkTypes, util as sdkUtil, createImageVariantConfig } from '../../util/sdkLoader';
// const { UUID } = sdkTypes;

// ================ Action types ================ //

export const SET_INITIAL_STATE = 'app/LandingPage/SET_INITIAL_STATE';
export const SHOW_USER_PROVIDER_DATA = 'app/LandingPage/SHOW_USER_PROVIDER_DATA';
export const SHOW_USER_PROVIDER_DATA_ERROR = 'app/LandingPage/SHOW_USER_PROVIDER_DATA_ERROR';
export const SHOW_LISTING_ERROR = 'app/LandingPage/SHOW_LISTING_ERROR';

// ================ Reducer ================ //

const initialState = {
  userProviders: [],
  showUserProvidersError: null,
  showListingError: null,
};

export default function landingPageReducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case SET_INITIAL_STATE:
      return { ...initialState };
    case SHOW_USER_PROVIDER_DATA:
      return { ...state, userProviders: [...state.userProviders, payload], showUserProvidersError: null };
    case SHOW_USER_PROVIDER_DATA_ERROR:
      return { ...state, userProviders: [], showUserProvidersError: payload };
    case SHOW_LISTING_ERROR:
      return { ...state, showListingError: payload };
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

export const showListingError = e => ({
  type: SHOW_LISTING_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

/*

// First way, querying all listings authorId, then filter out the duplicates, and finally call the /users api to get the imageProfile data
// There is an issue with users.show and 'fields.image'

export const queryUserProviders = () => (dispatch, getState, sdk) => {

  return sdk.listings.query(
    { include: ["author"] }
    // Issue, see Slack msg. https://sharetribe-flex.slack.com/archives/CCWFD4NMA/p1648999265589879?thread_ts=1638377708.010600&cid=CCWFD4NMA
    // {
    //   include: ['author', 'author.profileImage', 'images'],
    //   'fields.image': ['variants.square-small', 'variants.square-small2x'],
    // }
  )
    .then(res => {
      const listingsObject = res.data.data      
      // Removes duplicates : https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates 
      // .filter((value, index, self) => self.indexOf(value) == index)
      const listingsObjectAuthorsUniques = listingsObject.filter((v, i, a) => a.indexOf(v) === i);
      console.log("listingsObjectAuthorsUniques", listingsObjectAuthorsUniques)

      // DEV
      // const listingsObject = res.data.data.map(e => ({ authorId: e.relationships.author.data.id.uuid, listingId: e.id.uuid }))
      // const listingsObjectAuthorsUniques = myarray.filter((v, i, a) => a.map(e => e.authorId).indexOf(v.authorId) === i);
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
          res = await sdk.users.show({
            id: e,
            include: ["profileImage"],
            "fields.image": ["variants.square-small", "variants.square-small2x"],
          })
          // CAUTION, issue. https://sharetribe-flex.slack.com/archives/CCWFD4NMA/p1638538380014400?thread_ts=1638377708.010600&cid=CCWFD4NMA
          let useProvider = res.data.data
          // console.log("useProvider", useProvider)
          useProvider.profileImage = useProvider.relationships.profileImage.data
          // useProvider = [JSON.parse('{"id":{"_sdkType":"UUID","uuid":"623332d1-3d73-4770-95cb-6b928cc5426f"},"type":"currentUser","attributes":{"deleted":false,"banned":false,"email":"funkmatch@gmail.com","stripeConnected":true,"stripePayoutsEnabled":false,"createdAt":"2022-03-17T13:08:33.713Z","stripeChargesEnabled":false,"identityProviders":[],"pendingEmail":null,"emailVerified":true,"profile":{"displayName":"Fox G","firstName":"Fox","privateData":{},"protectedData":{},"bio":null,"abbreviatedName":"FG","lastName":"Ginger","publicData":{"shoppingCart":[]},"metadata":{"freeShipping":true,"isProvider":true}}},"profileImage":{"id":{"_sdkType":"UUID","uuid":"623337bf-4fc9-4a78-83bb-2d3102cce914"},"type":"image","attributes":{"variants":{"square-small2x":{"height":480,"width":480,"url":"https://sharetribe.imgix.net/61c4d0a9-0776-4e68-a3eb-a5324ef5592f/623337bf-4fc9-4a78-83bb-2d3102cce914?auto=format&crop=edges&fit=crop&h=480&w=480&s=3fc839a2f0e88a5a51e55c4653ba2d86","name":"square-small2x"},"square-small":{"height":240,"width":240,"url":"https://sharetribe.imgix.net/61c4d0a9-0776-4e68-a3eb-a5324ef5592f/623337bf-4fc9-4a78-83bb-2d3102cce914?auto=format&crop=edges&fit=crop&h=240&w=240&s=2d031299d757eeb2e80b5f15854d572c","name":"square-small"},"square-xsmall":{"height":40,"width":40,"url":"https://sharetribe.imgix.net/61c4d0a9-0776-4e68-a3eb-a5324ef5592f/623337bf-4fc9-4a78-83bb-2d3102cce914?auto=format&crop=edges&fit=crop&h=40&w=40&s=359dc7fcf0a75058abcbc0f933a6c3f0","name":"square-xsmall"},"square-xsmall2x":{"height":80,"width":80,"url":"https://sharetribe.imgix.net/61c4d0a9-0776-4e68-a3eb-a5324ef5592f/623337bf-4fc9-4a78-83bb-2d3102cce914?auto=format&crop=edges&fit=crop&h=80&w=80&s=9edce97c0dfd57c28046a10b89b3b83a","name":"square-xsmall2x"}}}},"stripeAccount":{"id":{"_sdkType":"UUID","uuid":"623334ba-1b6a-4cf5-be47-cb805cefafbf"},"type":"stripeAccount","attributes":{"stripeAccountId":"acct_1KeJC3PZpzxQZ6Ex","stripeAccountData":null}}}')
          // ]
          console.log("useProvider from ducks", useProvider)
          dispatch(showUserProvidersData(useProvider))
        }))
      }
    ).catch(e => dispatch(showUserProvidersError(storableError(e))));
}
*/


// Second way to get the listings author profile data and profileImage
// Code taken from src/containers/ListingPage/ListingPage.duck.js, 
// because the listing page shows a component where the author imageProfile is displayed

export const queryListingsAuthorData = () => (dispatch, getState, sdk) => {
  // export const showListing = (listingId) => (dispatch, getState, sdk) => {

  // Can create custom size images with the following code
  // const { aspectWidth = 1, aspectHeight = 1, variantPrefix = 'listing-card' } = config.listing;
  // const aspectRatio = aspectHeight / aspectWidth;

  const params = {
    // id: listingId,
    include: ['author', 'author.profileImage'],
    'fields.image': [
      // Scaled variants for large images
      'variants.scaled-small',
      'variants.scaled-medium',
      'variants.scaled-large',
      // 'variants.scaled-xlarge',

      // Avatars
      // 'variants.square-small',
      // 'variants.square-small2x',
    ],
    // ...createImageVariantConfig(`${variantPrefix}`, 400, aspectRatio),
  };

  // return sdk.listings.show(params)
  return sdk.listings.query(params)
    .then(data => {
      // DEV DEBUG
      // console.log("From LandingPage.ducks.js")
      // console.log("data", data)

      // CAUTION, the id attribute is part of the e.relationships.profileImage.data object, no need to use .id.uuid
      // Same for profile image
      let userProviders = data.data.included
        .filter(e => e.type === 'user')
        .map(e => ({
          id: { uuid: e.id.uuid },
          attributes: {
            deleted: false,
            banned: false,
            profile: e.attributes.profile
          },
          profileImage: e.relationships.profileImage.data ? e.relationships.profileImage.data : null,
          type: 'currentUser',
        }))


      const profileImages = data.data.included.filter(e => e.type === 'image')

      let restaurantNameToFilter = []
      data.data.data.map(e => e.attributes.publicData.restaurant ? restaurantNameToFilter.push([e.attributes.publicData.restaurantName, e.attributes.publicData.restaurant]) : null)
      // Filtering out the element (from listings) where restaurant or restaurantName is undefined (data from incomplete/not updated listings wrt the provider's profile)
      restaurantNameToFilter = restaurantNameToFilter.filter(e => (e[0] !== undefined))

      // Filtering duplicates won't work the classical way for an array of arrays
      // https://www.kirupa.com/javascript/removing_duplicate_arrays_from_array.htm
      const restaurantNameToFilterString = restaurantNameToFilter.map(JSON.stringify)
      // .filter((value, index, self) => self.indexOf(value) == index)
      const restaurantNameToFilterUniquesString = restaurantNameToFilterString.filter((v, i, a) => a.indexOf(v) === i);
      const restaurantNameToFilterUniques = restaurantNameToFilterUniquesString.map(JSON.parse)
      const restaurantNameUniques = restaurantNameToFilterUniques.map(e => e[0])
      const restaurantUniques = restaurantNameToFilterUniques.map(e => e[1])
     

      // Prevent error if provider's profile's restaurant name is not sync with the listings related data
      const userProvidersRestaurantName = userProviders.map(e => e.attributes.profile.publicData.restaurantName ? e.attributes.profile.publicData.restaurantName : null) 
      const zeroValueAtPositionToFilterout = userProvidersRestaurantName.map(e => restaurantNameUniques.indexOf(e) + 1)
      const indexToFilerOut = zeroValueAtPositionToFilterout.map((e,i) => !e ? i : null)
      // Removing user from userProviders array if there's inconsistency in restaurant name/path data to prevent the home page to bug
      // The restaurant will still display in home page, but only the updated listings will show in the restaurant X page
      indexToFilerOut.forEach(e => e !== null ? userProviders.splice(e,1) : null)

      // For each user of the above list, we try to assign a profileImage variant from a matching on the profileImage id
      // If the user doesn't have a profileImage, we set it to null
      for (const user of userProviders) {
        // CAUTION: Remember this special kind of for loop can only output one console log, because it is assigning it to the item
        // restaurant to restaurantName mapping (the provider's public data contains only the restaurantName, 
        // the restaurant property (path part) is computed in only one place; at listing creation)       
        if (user.attributes.profile.publicData.restaurantName) {
          const restaurantName = user.attributes.profile.publicData.restaurantName
          const indexOfrestaurantName = restaurantNameToFilterUniques.map(e => e[0]).indexOf(restaurantName)
          user.attributes.profile.publicData.restaurant = restaurantNameToFilterUniques[indexOfrestaurantName][1]
        }        

        // Profile image mapping
        const profileImageMaybe = user.profileImage ? profileImages.filter(e => e.id.uuid === (user.profileImage.id.uuid)) : null
        user.profileImage = profileImageMaybe ? ({
          id: profileImageMaybe[0].id,
          type: 'image',
          attributes: {
            variants: profileImageMaybe[0].attributes.variants
          }
        }) : null
      }

      // Ordering userProviders array, user without ProfileImage at the end
      const userProvidersWithoutProfileImage = userProviders.filter(e => !e.profileImage)
      const userProvidersWithProfileImage = userProviders.filter(e => e.profileImage)
      userProviders = [...userProvidersWithProfileImage, ...userProvidersWithoutProfileImage]

      // const urlScaledMedium = data.data.included[0].attributes.variants['scaled-medium'].url
      // return userProviders;
      // DEV DEBUG
      // console.log("userProviders, from LandingPage.duck.js", userProviders)
      // dispatch(showUserProvidersData(userProviders))
      userProviders.map(e => dispatch(showUserProvidersData(e)))

    })
    .catch(e => {
      dispatch(showListingError(storableError(e)));
    });
};


export const loadData = () => (dispatch, getState, sdk) => {

  // Clear state so that previously loaded data is not visible
  // in case this page load fails.
  dispatch(setInitialState());

  return Promise.all([
    // First way
    // dispatch(queryUserProviders()),

    // Second way
    // testing
    // dispatch(showListing("62473d1e-0291-43a2-82e0-998c285c08c9")),
    // dispatch(showListing("62332a96-5866-423e-b119-e86796312535")),
    dispatch(queryListingsAuthorData()),
    dispatch(fetchCurrentUser()),
  ]);
}
