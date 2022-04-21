import React, { Component } from 'react';
import { string, func, bool } from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';
import { LINE_ITEM_DAY, LINE_ITEM_NIGHT, propTypes } from '../../util/types';
import { formatMoney } from '../../util/currency';
import { ensureListing, ensureUser } from '../../util/data';
import { richText } from '../../util/richText';
import { createSlug } from '../../util/urlHelpers';
import config from '../../config';
import { isRestaurantOpen } from '../../util/data';
import { AspectRatioWrapper, NamedLink, ResponsiveImage } from '../../components';

import css from './ListingCard.module.css';

const MIN_LENGTH_FOR_LONG_WORDS = 10;

const priceData = (price, intl) => {
  if (price && price.currency === config.currency) {
    const formattedPrice = formatMoney(intl, price);
    return { formattedPrice, priceTitle: formattedPrice };
  } else if (price) {
    return {
      formattedPrice: intl.formatMessage(
        { id: 'ListingCard.unsupportedPrice' },
        { currency: price.currency }
      ),
      priceTitle: intl.formatMessage(
        { id: 'ListingCard.unsupportedPriceTitle' },
        { currency: price.currency }
      ),
    };
  }
  return {};
};

class ListingImage extends Component {
  render() {
    return <ResponsiveImage {...this.props} />;
  }
}

const LazyImage = lazyLoadWithDimensions(ListingImage, { loadAfterInitialRendering: 3000 });

export const ListingCardComponent = props => {
  const {
    className,
    rootClassName,
    intl,
    listing,
    renderSizes,
    setActiveListing,
    showAuthorInfo,
  } = props;
  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const id = currentListing.id.uuid;
  const { title = '', price } = currentListing.attributes;
  const slug = createSlug(title);
  const author = ensureUser(listing.author);
  const authorName = author.attributes.profile.publicData.restaurantName ? author.attributes.profile.publicData.restaurantName : null;
  // const authorName = author.attributes.profile.displayName;  
  const firstImage =
    currentListing.images && currentListing.images.length > 0 ? currentListing.images[0] : null;

  const { aspectWidth = 1, aspectHeight = 1, variantPrefix = 'listing-card' } = config.listing;
  const variants = firstImage
    ? Object.keys(firstImage?.attributes?.variants).filter(k => k.startsWith(variantPrefix))
    : [];

  const { formattedPrice, priceTitle } = priceData(price, intl);
  const unitType = config.lineItemUnitType;
  const isNightly = unitType === LINE_ITEM_NIGHT;
  const isDaily = unitType === LINE_ITEM_DAY;

  const unitTranslationKey = isNightly
    ? 'ListingCard.perNight'
    : isDaily
      ? 'ListingCard.perDay'
      : 'ListingCard.perUnit';

  const setActivePropsMaybe = setActiveListing
    ? {
      onMouseEnter: () => setActiveListing(currentListing.id),
      onMouseLeave: () => setActiveListing(null),
    }
    : null;

  const restaurantStatus = isRestaurantOpen(listing?.author?.attributes.profile?.publicData);

  const ContentDiv = () => {
    return (<div>
      <AspectRatioWrapper
        className={css.aspectRatioWrapper}
        width={aspectWidth}
        height={aspectHeight}
        {...setActivePropsMaybe}
      >
        <div className={css.bulletWrapper}>
          {/* <img src={badge} className={css.reviewsBadge} /> */}
          <p className={restaurantStatus.status === "open" ? css.openedRestaurant : css.closedRestaurant} >•</p>
        </div>

        <div className={css.messageWrapper}>
          {/* <img src={badge} className={css.reviewsBadge} /> */}
          <p className={css.scheduleMessage} >{restaurantStatus.message}</p>
        </div>

        <LazyImage
          rootClassName={css.rootForImage}
          alt={title}
          image={firstImage}
          variants={variants}
          sizes={renderSizes}
        />
      </AspectRatioWrapper>
      <div className={css.info}>
        <div className={css.price}>
          <div className={css.priceValue} title={priceTitle}>
            {formattedPrice}
          </div>
          {config.listing.showUnitTypeTranslations ? (
            <div className={css.perUnit}>
              <FormattedMessage id={unitTranslationKey} />
            </div>
          ) : null}
        </div>
        <div className={css.mainInfo}>
          <div className={css.title}>
            {richText(title, {
              longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
              longWordClass: css.longWord,
            })}
          </div>
          {showAuthorInfo ? (
            <div className={css.authorInfo}>
              <FormattedMessage id="ListingCard.author" values={{ authorName }} />
            </div>
          ) : null}
        </div>
      </div>
    </div>)
  }


  const hasSearchParams = location?.search?.length > 0;
  // Build conditional UI for search listing as Restaurant's page
  let restaurantName = ''
  // TODO Write a more striaghtforwadr way to get those data
  // Check src/containers/LandingPage/LandingPage.duck.js
  const restaurantSearchParam = 'pub_restaurant='
  // DEV
  // console.log("listings", listings)
  const hasRestaurantSearchParam = hasSearchParams && location.search.includes(restaurantSearchParam)

  const NamedLinkRestaurant = () => {
    return (
      <NamedLink to={{ search: `?pub_restaurant=${listing.attributes.publicData?.restaurant}` }}
        name="SearchPage">
        < ContentDiv />
      </NamedLink>
    )
  }

  const NamedLinkListing = () => {
    return (
      <NamedLink
        className={classes} name="ListingPage" params={{ id, slug }}>
        < ContentDiv />
      </NamedLink>
    )
  }

  return (
    hasRestaurantSearchParam ? <NamedLinkListing /> : <NamedLinkRestaurant />
  );
};

ListingCardComponent.defaultProps = {
  className: null,
  rootClassName: null,
  renderSizes: null,
  setActiveListing: null,
  showAuthorInfo: true,
};

ListingCardComponent.propTypes = {
  className: string,
  rootClassName: string,
  intl: intlShape.isRequired,
  listing: propTypes.listing.isRequired,
  showAuthorInfo: bool,

  // Responsive image sizes hint
  renderSizes: string,

  setActiveListing: func,
};

export default injectIntl(ListingCardComponent);
