import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import config from '../../config';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
// import { REVIEW_TYPE_OF_PROVIDER, REVIEW_TYPE_OF_CUSTOMER, propTypes } from '../../util/types';
import { propTypes } from '../../util/types';
import { ensureCurrentUser, ensureUser } from '../../util/data';
import { withViewport } from '../../util/contextHelpers';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import {
  Page,
  LayoutSideNavigation,
  LayoutWrapperMain,
  LayoutWrapperSideNav,
  LayoutWrapperTopbar,
  LayoutWrapperFooter,
  Footer,
  AvatarLarge,
  NamedLink,
  ListingCard,
  // Reviews,
  // ButtonTabNavHorizontal,
} from '../../components';
import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';
import NotFoundPage from '../../containers/NotFoundPage/NotFoundPage';

import css from './ProfilePage.module.css';

const MAX_MOBILE_SCREEN_WIDTH = 768;

export class ProfilePageComponent extends Component {
  constructor(props) {
    super(props);

    /* Commenting out reviews */
    /*
 this.state = {
   // keep track of which reviews tab to show in desktop viewport
   showReviewsType: REVIEW_TYPE_OF_PROVIDER,
 };

 this.showOfProviderReviews = this.showOfProviderReviews.bind(this);
 this.showOfCustomerReviews = this.showOfCustomerReviews.bind(this);
 */
  }

  /* Commenting out reviews */
  /*
  showOfProviderReviews() {
    this.setState({
      showReviewsType: REVIEW_TYPE_OF_PROVIDER,
    });
  }

  showOfCustomerReviews() {
    this.setState({
      showReviewsType: REVIEW_TYPE_OF_CUSTOMER,
    });
  }
  */

  render() {
    const {
      scrollingDisabled,
      currentUser,
      user,
      userShowError,
      queryListingsError,
      listings,
      // reviews,
      // queryReviewsError,
      viewport,
      intl,
      userProfileCustom,
    } = this.props;

    const ensuredCurrentUser = ensureCurrentUser(currentUser);
    const profileUser = ensureUser(user);
    const isCurrentUser =
      ensuredCurrentUser.id && profileUser.id && ensuredCurrentUser.id.uuid === profileUser.id.uuid;
    // Conditional rendering of the provider/customer UI elements.
    // XXX CAUTION here the current user's metadata "isProvider" is not what determines the rendering
    // The rendering is conditionned against the user who owns the visited profile, "profileUser" !

    const isProvider = profileUser.attributes.profile.metadata
      ? profileUser.attributes.profile.metadata.isProvider
        ? profileUser.attributes.profile.metadata.isProvider
        : false
      : false;
    const restaurantName = isProvider
      ? profileUser.attributes.profile.publicData
        ? profileUser.attributes.profile.publicData.restaurantName
        : null
      : null;

    const displayName = profileUser.attributes.profile.displayName;
    const bio = profileUser.attributes.profile.bio;
    const hasBio = !!bio;
    const hasListings = listings.length > 0;
    const isMobileLayout = viewport.width < MAX_MOBILE_SCREEN_WIDTH;

    const editLinkMobile = isCurrentUser ? (
      <NamedLink className={css.editLinkMobile} name="ProfileSettingsPage">
        <FormattedMessage id="ProfilePage.editProfileLinkMobile" />
      </NamedLink>
    ) : null;
    const editLinkDesktop = isCurrentUser ? (
      <NamedLink className={css.editLinkDesktop} name="ProfileSettingsPage">
        <FormattedMessage id="ProfilePage.editProfileLinkDesktop" />
      </NamedLink>
    ) : null;

    const asideContent = (
      <div className={css.asideContent}>
        <AvatarLarge className={css.avatar} user={user} disableProfileLink />
        <h1 className={css.mobileHeading}>
          {isProvider ? (
            <FormattedMessage
              id="ProfilePage.mobileHeading"
              values={{ name: restaurantName, linebreak: <br /> }}
            />
          ) : (
            <FormattedMessage
              id="ProfilePage.mobileHeading"
              values={{ name: displayName, linebreak: <br /> }}
            />
          )}
        </h1>
        {editLinkMobile}
        {editLinkDesktop}
      </div>
    );

    const listingsContainerClasses = classNames(css.listingsContainer, {
      [css.withBioMissingAbove]: !hasBio,
    });

    /* Commenting out reviews */
    /*
    const reviewsError = (
      <p className={css.error}>
        <FormattedMessage id="ProfilePage.loadingReviewsFailed" />
      </p>
    );

    const reviewsOfProvider = reviews.filter(r => r.attributes.type === REVIEW_TYPE_OF_PROVIDER);

    const reviewsOfCustomer = reviews.filter(r => r.attributes.type === REVIEW_TYPE_OF_CUSTOMER);

    const mobileReviews = (
      <div className={css.mobileReviews}>
        <h2 className={css.mobileReviewsTitle}>
          <FormattedMessage
            id="ProfilePage.reviewsOfProviderTitle"
            values={{ count: reviewsOfProvider.length }}
          />
        </h2>
        {queryReviewsError ? reviewsError : null}
        <Reviews reviews={reviewsOfProvider} />
        <h2 className={css.mobileReviewsTitle}>
          <FormattedMessage
            id="ProfilePage.reviewsOfCustomerTitle"
            values={{ count: reviewsOfCustomer.length }}
          />
        </h2>
        {queryReviewsError ? reviewsError : null}
        <Reviews reviews={reviewsOfCustomer} />
      </div>
    );

    const desktopReviewTabs = [
      {
        text: (
          <h3 className={css.desktopReviewsTitle}>
            <FormattedMessage
              id="ProfilePage.reviewsOfProviderTitle"
              values={{ count: reviewsOfProvider.length }}
            />
          </h3>
        ),
        selected: this.state.showReviewsType === REVIEW_TYPE_OF_PROVIDER,
        onClick: this.showOfProviderReviews,
      },
      {
        text: (
          <h3 className={css.desktopReviewsTitle}>
            <FormattedMessage
              id="ProfilePage.reviewsOfCustomerTitle"
              values={{ count: reviewsOfCustomer.length }}
            />
          </h3>
        ),
        selected: this.state.showReviewsType === REVIEW_TYPE_OF_CUSTOMER,
        onClick: this.showOfCustomerReviews,
      },
    ];

    const desktopReviews = (
      <div className={css.desktopReviews}>
        <div className={css.desktopReviewsWrapper}>
          <ButtonTabNavHorizontal className={css.desktopReviewsTabNav} tabs={desktopReviewTabs} currentUser={currentUser} />

          {queryReviewsError ? reviewsError : null}

          {this.state.showReviewsType === REVIEW_TYPE_OF_PROVIDER ? (
            <Reviews reviews={reviewsOfProvider} />
          ) : (
            <Reviews reviews={reviewsOfCustomer} />
          )}
        </div>
      </div>
    );
    */

    const mainContent = (
      <div>
        <h1 className={css.desktopHeading}>
          {isProvider ? (
            <FormattedMessage
              id="ProfilePage.desktopHeadingRestaurant"
              values={{ name: restaurantName }}
            />
          ) : (
            <FormattedMessage id="ProfilePage.desktopHeading" values={{ name: displayName }} />
          )}
        </h1>
        {hasBio ? <p className={css.bio}>{bio}</p> : null}
        {hasListings ? (
          <div className={listingsContainerClasses}>
            <h2 className={css.listingsTitle}>
              {isProvider && (
                <FormattedMessage
                  id="ProfilePage.listingsTitle"
                  values={{ count: listings.length, name: restaurantName }}
                />
              )}
            </h2>
            {listings.length && (
              <ul className={css.listings}>
                {listings.map(l => (
                  <li className={css.listing} key={l.id.uuid}>
                    <ListingCard listing={l} showAuthorInfo={false} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
        {/* Commenting out reviews */}
        {/* {isMobileLayout ? mobileReviews : desktopReviews} */}
      </div>
    );

    let content;

    if (userShowError && userShowError.status === 404) {
      return <NotFoundPage />;
    } else if (userShowError || queryListingsError) {
      content = (
        <p className={css.error}>
          <FormattedMessage id="ProfilePage.loadingDataFailed" />
        </p>
      );
    } else {
      content = mainContent;
    }

    const schemaTitle = intl.formatMessage(
      {
        id: 'ProfilePage.schemaTitle',
      },
      {
        restaurantName: restaurantName,
        siteTitle: config.siteTitle,
      }
    );

    return (
      <Page
        scrollingDisabled={scrollingDisabled}
        title={schemaTitle}
        schema={{
          '@context': 'http://schema.org',
          '@type': 'ProfilePage',
          name: schemaTitle,
        }}
      >
        <LayoutSideNavigation>
          <LayoutWrapperTopbar>
            <TopbarContainer currentPage="ProfilePage" />
          </LayoutWrapperTopbar>
          <LayoutWrapperSideNav className={css.aside}>{asideContent}</LayoutWrapperSideNav>
          <LayoutWrapperMain>{content}</LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSideNavigation>
      </Page>
    );
  }
}

ProfilePageComponent.defaultProps = {
  currentUser: null,
  user: null,
  userShowError: null,
  queryListingsError: null,
  // reviews: [],
  // queryReviewsError: null,
  userProfileCustom: {},
  showUserProfileCustomError: null,
};

const { bool, arrayOf, number, shape, object } = PropTypes;

ProfilePageComponent.propTypes = {
  scrollingDisabled: bool.isRequired,
  currentUser: propTypes.currentUser,
  user: propTypes.user,
  userShowError: propTypes.error,
  queryListingsError: propTypes.error,
  listings: arrayOf(propTypes.listing).isRequired,
  // reviews: arrayOf(propTypes.review),
  // queryReviewsError: propTypes.error,

  // form withViewport
  viewport: shape({
    width: number.isRequired,
    height: number.isRequired,
  }).isRequired,

  // from injectIntl
  intl: intlShape.isRequired,

  // from userProvider
  userProfileCustom: object.isRequired,
  showUserProfileCustomError: propTypes.error,
};

const mapStateToProps = state => {
  const { currentUser } = state.user;
  const {
    userId,
    userShowError,
    queryListingsError,
    userListingRefs,
    // reviews,
    // queryReviewsError,
    userProfileCustom,
    showUserProfileCustomError,
  } = state.ProfilePage;

  if (showUserProfileCustomError) {
    console.log(`Error while pulling providers data: ${showUserProfileCustomError}`);
  }

  const userMatches = getMarketplaceEntities(state, [{ type: 'user', id: userId }]);
  const user = userMatches.length === 1 ? userMatches[0] : null;
  const listings = getMarketplaceEntities(state, userListingRefs);
  return {
    scrollingDisabled: isScrollingDisabled(state),
    currentUser,
    user,
    userShowError,
    queryListingsError,
    listings,
    // reviews,
    // queryReviewsError,
    userProfileCustom,
    showUserProfileCustomError,
  };
};

const ProfilePage = compose(
  connect(mapStateToProps),
  withViewport,
  injectIntl
)(ProfilePageComponent);

export default ProfilePage;
