import React from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { arrayOf, array, bool, func, node, oneOfType, shape, string } from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';
import Chip from '@mui/material/Chip';
import config from '../../config';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import {
  propTypes,
  LISTING_STATE_CLOSED,
  LINE_ITEM_NIGHT,
  LINE_ITEM_DAY,
  LINE_ITEM_UNITS,
} from '../../util/types';
import { formatMoney } from '../../util/currency';
import { parse, stringify } from '../../util/urlHelpers';
import { userDisplayNameAsString } from '../../util/data';
import { ModalInMobile, Button, AvatarSmall } from '../../components';

import BookingDatesForm from './BookingDatesForm/BookingDatesForm';
import ProductOrderForm from './ProductOrderForm/ProductOrderForm';
import css from './OrderPanel.module.css';

// This defines when ModalInMobile shows content as Modal
const MODAL_BREAKPOINT = 1023;

const priceData = (price, intl) => {
  if (price && price.currency === config.currency) {
    const formattedPrice = formatMoney(intl, price);
    return { formattedPrice, priceTitle: formattedPrice };
  } else if (price) {
    return {
      formattedPrice: `(${price.currency})`,
      priceTitle: `Unsupported currency (${price.currency})`,
    };
  }
  return {};
};

const openOrderModal = (isOwnListing, isClosed, history, location) => {
  if (isOwnListing || isClosed) {
    window.scrollTo(0, 0);
  } else {
    const { pathname, search, state } = location;
    const searchString = `?${stringify({ ...parse(search), orderOpen: true })}`;
    history.push(`${pathname}${searchString}`, state);
  }
};

const closeOrderModal = (history, location) => {
  const { pathname, search, state } = location;
  const searchParams = omit(parse(search), 'orderOpen');
  const searchString = `?${stringify(searchParams)}`;
  history.push(`${pathname}${searchString}`, state);
};

const OrderPanel = props => {
  const {
    rootClassName,
    className,
    titleClassName,
    listing,
    isOwnListing,
    unitType,
    onSubmit,
    title,
    author,
    onManageDisableScrolling,
    timeSlots,
    fetchTimeSlotsError,
    history,
    location,
    intl,
    onFetchTransactionLineItems,
    onContactUser,
    lineItems,
    fetchLineItemsInProgress,
    fetchLineItemsError,
    currentUser,
    isRestaurantOnHold,
    restaurantStatus,
  } = props;

  // FIXME Solving issue on contact colleague button on OrderPanel => becomes undefined when clickin send message
  const restaurantStatusLocal = restaurantStatus ? restaurantStatus : false

  const isNightly = unitType === LINE_ITEM_NIGHT;
  const isDaily = unitType === LINE_ITEM_DAY;
  const isUnits = unitType === LINE_ITEM_UNITS;
  const shouldHaveBooking = isNightly || isDaily;

  const price = listing.attributes.price;
  const hasListingState = !!listing.attributes.state;
  const isClosed = hasListingState && listing.attributes.state === LISTING_STATE_CLOSED;
  const showBookingDatesForm = shouldHaveBooking && hasListingState && !isClosed;
  const showClosedListingHelpText = listing.id && isClosed;
  const { formattedPrice, priceTitle } = priceData(price, intl);
  const isOrderOpen = !!parse(location.search).orderOpen;

  // The listing resource has a relationship: `currentStock`,
  // which you should include when making API calls.
  const currentStock = listing.currentStock?.attributes?.quantity;
  const isOutOfStock = config.listingManagementType === 'stock' && currentStock === 0;

  // Show form only when stock is fully loaded. This avoids "Out of stock" UI by
  // default before all data has been downloaded.
  const showProductOrderForm =
    config.listingManagementType === 'stock' && typeof currentStock === 'number';

  const { pickupEnabled, shippingEnabled } = listing?.attributes?.publicData || {};

  const subTitleText = showClosedListingHelpText
    ? intl.formatMessage({ id: 'OrderPanel.subTitleClosedListing' })
    : null;

  const unitTranslationKey = isNightly
    ? 'OrderPanel.perNight'
    : isDaily
      ? 'OrderPanel.perDay'
      : 'OrderPanel.perUnit';

  // const authorDisplayName = userDisplayNameAsString(author, '');
  const restaurantName = author.attributes.profile.publicData.restaurantName ? author.attributes.profile.publicData.restaurantName : null;

  const classes = classNames(rootClassName || css.root, className);
  const titleClasses = classNames(titleClassName || css.orderTitle);
  const restaurantDot = <p className={restaurantStatusLocal?.status === 'open' ? css.openDot : css.closedDot}>•</p>;
  const restaurantScheduleMessageKey = restaurantStatusLocal?.message ? restaurantStatusLocal.message.key : null
  let restaurantScheduleMessageValues = restaurantStatusLocal?.message ? restaurantStatusLocal.message.values : null
  if (restaurantScheduleMessageValues !== null) {
    for (const k of Object.keys(restaurantScheduleMessageValues)) {
      if (restaurantScheduleMessageValues[k] === null) {
        delete restaurantScheduleMessageValues[k]
      } else if (JSON.stringify(restaurantScheduleMessageValues[k]).length === 1) {
        restaurantScheduleMessageValues[k] = '0' + JSON.stringify(restaurantScheduleMessageValues[k])
      }
    }
  }


  return (
    <div className={classes}>
      <ModalInMobile
        containerClassName={css.modalContainer}
        id="BookingDatesFormInModal"
        isModalOpenOnMobile={isOrderOpen}
        onClose={() => closeOrderModal(history, location)}
        showAsModalMaxWidth={MODAL_BREAKPOINT}
        onManageDisableScrolling={onManageDisableScrolling}
      >
        <div className={css.modalHeading}>
          <h1 className={css.title}>{title}</h1>
        </div>

        <div className={css.orderHeading}>
          <h2 className={titleClasses}>{title} {restaurantDot}</h2>
          <p className={restaurantStatusLocal.status === 'open' ? css.scheduleInfoTextOpen : css.scheduleInfoTextClosed}>
            {
              restaurantStatusLocal && (restaurantScheduleMessageValues ?
                <FormattedMessage id={restaurantScheduleMessageKey} values={restaurantScheduleMessageValues} /> :
                <FormattedMessage id={restaurantScheduleMessageKey} />)
            }

          </p>
          {subTitleText ? <div className={css.orderHelp}>{subTitleText}</div> : null}

          <div className={css.deliveryOptions}>
            {
              !shippingEnabled ?
                <Chip className={css.shipChip} label="No shipping" variant="outlined" />
                :
                null
            }

            {
              !pickupEnabled ?
                <Chip className={css.pickupChip} label="No pickup" variant="outlined" />
                :
                null
            }
          </div>

        </div>
        <p className={css.price}>{formatMoney(intl, price)}</p>
        <div className={css.author}>
          <AvatarSmall user={author} className={css.providerAvatar} />
          <FormattedMessage id="OrderPanel.soldBy" values={{ name: restaurantName }} />
        </div>

        {showBookingDatesForm ? (
          <BookingDatesForm
            className={css.bookingForm}
            formId="OrderPanelBookingDatesForm"
            submitButtonWrapperClassName={css.bookingDatesSubmitButtonWrapper}
            unitType={unitType}
            onSubmit={onSubmit}
            price={price}
            listingId={listing.id}
            isOwnListing={isOwnListing}
            timeSlots={timeSlots}
            fetchTimeSlotsError={fetchTimeSlotsError}
            onFetchTransactionLineItems={onFetchTransactionLineItems}
            lineItems={lineItems}
            fetchLineItemsInProgress={fetchLineItemsInProgress}
            fetchLineItemsError={fetchLineItemsError}
          />
        ) : showProductOrderForm ? (
          <ProductOrderForm
            formId="OrderPanelProductOrderForm"
            onSubmit={onSubmit}
            price={price}
            currentStock={currentStock}
            pickupEnabled={pickupEnabled}
            shippingEnabled={shippingEnabled}
            listingId={listing.id}
            isOwnListing={isOwnListing}
            onFetchTransactionLineItems={onFetchTransactionLineItems}
            onContactUser={onContactUser}
            lineItems={lineItems}
            fetchLineItemsInProgress={fetchLineItemsInProgress}
            fetchLineItemsError={fetchLineItemsError}
            listing={listing}
            currentUser={currentUser}
            history={history}
            isRestaurantOnHold={isRestaurantOnHold}
          />
        ) : null}
      </ModalInMobile>
      <div className={css.openOrderForm}>
        <div className={css.priceContainer}>
          <div className={css.priceValue} title={priceTitle}>
            {formattedPrice}
          </div>
          <div className={css.perUnit}>
            <FormattedMessage id={unitTranslationKey} />
          </div>
        </div>

        {isClosed ? (
          <div className={css.closedListingButton}>
            <FormattedMessage id="OrderPanel.closedListingButtonText" />
          </div>
        ) : (
          <Button
            rootClassName={css.orderButton}
            onClick={() => openOrderModal(isOwnListing, isClosed, history, location)}
            disabled={isOutOfStock || isRestaurantOnHold}
          >
            {isOutOfStock ? (
              <FormattedMessage id="OrderPanel.ctaButtonMessageNoStock" />
            ) : (
              <FormattedMessage id="OrderPanel.ctaButtonMessage" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

OrderPanel.defaultProps = {
  rootClassName: null,
  className: null,
  titleClassName: null,
  isOwnListing: false,
  subTitle: null,
  unitType: config.lineItemUnitType,
  timeSlots: null,
  fetchTimeSlotsError: null,
  lineItems: null,
  fetchLineItemsError: null,
};

OrderPanel.propTypes = {
  rootClassName: string,
  className: string,
  titleClassName: string,
  listing: oneOfType([propTypes.listing, propTypes.ownListing]),
  isOwnListing: bool,
  unitType: propTypes.lineItemUnitType,
  onSubmit: func.isRequired,
  title: oneOfType([node, string]).isRequired,
  subTitle: oneOfType([node, string]),
  onManageDisableScrolling: func.isRequired,
  timeSlots: arrayOf(propTypes.timeSlot),
  fetchTimeSlotsError: propTypes.error,
  onFetchTransactionLineItems: func.isRequired,
  onContactUser: func,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    search: string,
  }).isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

export default compose(
  withRouter,
  injectIntl
)(OrderPanel);
