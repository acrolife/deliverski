import pick from 'lodash/pick';
import config from '../../config';
import { types as sdkTypes } from '../../util/sdkLoader';
import {
  LISTING_PAGE_DRAFT_VARIANT,
  LISTING_PAGE_PENDING_APPROVAL_VARIANT,
} from '../../util/urlHelpers';

const { UUID } = sdkTypes;

// ================ Action types ================ //

export const SET_INITIAL_VALUES = 'app/ListingPage/SET_INITIAL_VALUES';

// ================ Action creators ================ //

export const setInitialValues = initialValues => ({
  type: SET_INITIAL_VALUES,
  payload: pick(initialValues, Object.keys(initialState)),
});


export const loadData = (params, search) => dispatch => {
  const listingId = new UUID(params.id);

  const ownListingVariants = [LISTING_PAGE_DRAFT_VARIANT, LISTING_PAGE_PENDING_APPROVAL_VARIANT];
  if (ownListingVariants.includes(params.variant)) {
    return dispatch(showListing(listingId, true));
  }

  if (config.enableAvailability) {
    return Promise.all([
      dispatch(showListing(listingId)),
      dispatch(fetchTimeSlots(listingId)),
      dispatch(fetchReviews(listingId)),
    ]);
  } else {
    return Promise.all([dispatch(showListing(listingId)), dispatch(fetchReviews(listingId))]);
  }
};
