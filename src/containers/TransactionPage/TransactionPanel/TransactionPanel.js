import React, { Component } from 'react';
import { array, arrayOf, bool, func, number, shape, string } from 'prop-types';
import classNames from 'classnames';

import config from '../../../config';
import {
  TRANSITION_REQUEST_PAYMENT_AFTER_ENQUIRY,
  txHasBeenReceived,
  txIsRequested,
  txIsCanceled,
  txIsDeclined,
  txIsPrepared,
  txIsDelivered,
  txIsDisputed,
  txIsEnquired,
  txIsPaymentExpired,
  txIsPaymentPending,
  txIsPurchased,
  // txIsReceived,
  // txIsCompleted,
  // txIsInFirstReviewBy,
} from '../../../util/transaction';
import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY, propTypes } from '../../../util/types';
import {
  ensureListing,
  ensureTransaction,
  ensureUser,
  userDisplayNameAsString,
  isRestaurantOpen,
} from '../../../util/data';

import { isMobileSafari } from '../../../util/userAgent';
import { formatMoney } from '../../../util/currency';
import { AvatarLarge, OrderPanel, NamedLink, UserDisplayName } from '../../../components';

import SendMessageForm from '../SendMessageForm/SendMessageForm';

// These are internal components that make this file more readable.
import BreakdownMaybe from './BreakdownMaybe';
import DetailCardHeadingsMaybe from './DetailCardHeadingsMaybe';
import DetailCardImage from './DetailCardImage';
import DeliveryInfoMaybe from './DeliveryInfoMaybe';
import FeedSection from './FeedSection';
import ActionButtonsMaybe from './ActionButtonsMaybe';
import DiminishedActionButtonMaybe from './DiminishedActionButtonMaybe';
import SaleActionButtonsMaybe from './SaleActionButtonsMaybe';
import PanelHeading, {
  HEADING_ENQUIRED,
  HEADING_PAYMENT_PENDING,
  HEADING_PAYMENT_EXPIRED,
  HEADING_REQUESTED,
  HEADING_CANCELED,
  HEADING_DECLINED,
  HEADING_PURCHASED,
  HEADING_PREPARED,
  HEADING_DELIVERED,
  HEADING_DISPUTED,
  HEADING_RECEIVED,
} from './PanelHeading';

import css from './TransactionPanel.module.css';

// Helper function to get display names for different roles
const displayNames = (currentUser, currentProvider, currentCustomer, intl) => {
  const authorDisplayName = <UserDisplayName user={currentProvider} intl={intl} />;
  const customerDisplayName = <UserDisplayName user={currentCustomer} intl={intl} />;

  let otherUserDisplayName = '';
  let otherUserDisplayNameString = '';
  const currentUserIsCustomer =
    currentUser.id && currentCustomer.id && currentUser.id.uuid === currentCustomer.id.uuid;
  const currentUserIsProvider =
    currentUser.id && currentProvider.id && currentUser.id.uuid === currentProvider.id.uuid;

  if (currentUserIsCustomer) {
    otherUserDisplayName = authorDisplayName;
    otherUserDisplayNameString = userDisplayNameAsString(currentProvider, '');
  } else if (currentUserIsProvider) {
    otherUserDisplayName = customerDisplayName;
    otherUserDisplayNameString = userDisplayNameAsString(currentCustomer, '');
  }

  // Getting restaurantName requires a check on publiData first otherwise throws error
  const restaurantName = currentProvider.attributes.profile.publicData
    ? currentProvider.attributes.profile.publicData.restaurantName
    : null;

  return {
    authorDisplayName,
    customerDisplayName,
    otherUserDisplayName,
    otherUserDisplayNameString,
    restaurantName,
  };
};

export class TransactionPanelComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sendMessageFormFocused: false,
    };
    this.isMobSaf = false;
    this.sendMessageFormName = 'TransactionPanel.SendMessageForm';

    this.onSendMessageFormFocus = this.onSendMessageFormFocus.bind(this);
    this.onSendMessageFormBlur = this.onSendMessageFormBlur.bind(this);
    this.onMessageSubmit = this.onMessageSubmit.bind(this);
    this.scrollToMessage = this.scrollToMessage.bind(this);
  }

  componentDidMount() {
    this.isMobSaf = isMobileSafari();
  }

  onSendMessageFormFocus() {
    this.setState({ sendMessageFormFocused: true });
    if (this.isMobSaf) {
      // Scroll to bottom
      window.scroll({ top: document.body.scrollHeight, left: 0, behavior: 'smooth' });
    }
  }

  onSendMessageFormBlur() {
    this.setState({ sendMessageFormFocused: false });
  }

  onMessageSubmit(values, form) {
    const message = values.message ? values.message.trim() : null;
    const { transaction, onSendMessage } = this.props;
    const ensuredTransaction = ensureTransaction(transaction);

    if (!message) {
      return;
    }
    onSendMessage(ensuredTransaction.id, message)
      .then(messageId => {
        form.reset();
        this.scrollToMessage(messageId);
      })
      .catch(e => {
        // Ignore, Redux handles the error
      });
  }

  scrollToMessage(messageId) {
    const selector = `#msg-${messageId.uuid}`;
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
  }

  render() {
    const {
      rootClassName,
      className,
      currentUser,
      transaction,
      totalMessagePages,
      oldestMessagePageFetched,
      messages,
      initialMessageFailed,
      savePaymentMethodFailed,
      fetchMessagesInProgress,
      fetchMessagesError,
      sendMessageInProgress,
      sendMessageError,
      onManageDisableScrolling,
      onOpenDisputeModal,
      onOpenReviewModal,
      onShowMoreMessages,
      transactionRole,
      intl,
      onAcceptSale,
      onDeclineSale,
      acceptInProgress,
      declineInProgress,
      acceptSaleError,
      declineSaleError,
      markReceivedProps,
      markReceivedFromPurchasedProps,
      markPreparedProps,
      markDeliveredFromPurchasedProps,
      markDeliveredProps,
      // leaveReviewProps,
      onSubmitOrderRequest,
      timeSlots,
      fetchTimeSlotsError,
      nextTransitions,
      onFetchTransactionLineItems,
      lineItems,
      fetchLineItemsInProgress,
      fetchLineItemsError,
    } = this.props;

    // TODO
    // DEV steps to disable the Send Message feature after transition/mark-received
    // 1. Copy in pastTransitions all transitions from
    // process/process.edn,
    // before transition/mark-received,
    // 2. disableSendMessage = true if transaction.attributes.lastTransition is not included in the array
    //
    // console.log("currentUser", currentUser)
    // console.log("transaction", transaction)
    // const pastTransitions = ["transition/enquire", "transition/request-payment",]
    //

    /* DEV
    // Conditional rendering of the provider/customer UI elements
    // Our isProvider is computed differenty than the one of the template, based on the transaction object,
    // so we just confirm that everthing went normal validating with our isProviderCustom
    const isProviderCustom = currentUser ? !!currentUser.attributes.profile.metadata.isProvider : false
   */

    const currentTransaction = ensureTransaction(transaction);
    const currentListing = ensureListing(currentTransaction.listing);
    const currentProvider = ensureUser(currentTransaction.provider);
    const currentCustomer = ensureUser(currentTransaction.customer);
    const isCustomer = transactionRole === 'customer';
    const isProvider = transactionRole === 'provider';

    const listingLoaded = !!currentListing.id;
    const listingDeleted = listingLoaded && currentListing.attributes.deleted;
    const iscustomerLoaded = !!currentCustomer.id;
    const isCustomerBanned = iscustomerLoaded && currentCustomer.attributes.banned;
    const isCustomerDeleted = iscustomerLoaded && currentCustomer.attributes.deleted;
    const isProviderLoaded = !!currentProvider.id;
    const isProviderBanned = isProviderLoaded && currentProvider.attributes.banned;
    const isProviderDeleted = isProviderLoaded && currentProvider.attributes.deleted;

    // eslint-disable-next-line no-unused-vars
    const restaurantStatus = isRestaurantOpen(
      currentListing?.author?.attributes.profile.publicData
    );

    const stateDataFn = tx => {
      if (txIsEnquired(tx)) {
        const transitions = Array.isArray(nextTransitions)
          ? nextTransitions.map(transition => {
              return transition.attributes.name;
            })
          : [];
        const hasCorrectNextTransition =
          transitions.length > 0 && transitions.includes(TRANSITION_REQUEST_PAYMENT_AFTER_ENQUIRY);
        return {
          headingState: HEADING_ENQUIRED,
          showOrderPanel: isCustomer && !isProviderBanned && hasCorrectNextTransition,
        };
      } else if (txIsPaymentPending(tx)) {
        return {
          headingState: HEADING_PAYMENT_PENDING,
          showDetailCardHeadings: isCustomer,
        };
      } else if (txIsPaymentExpired(tx)) {
        return {
          headingState: HEADING_PAYMENT_EXPIRED,
          showDetailCardHeadings: isCustomer,
        };
      } else if (txIsRequested(tx)) {
        return {
          headingState: HEADING_REQUESTED,
          showDetailCardHeadings: isCustomer,
          showSaleButtons: isProvider && !isCustomerBanned,
        };
      } else if (txIsPurchased(tx)) {
        return {
          headingState: HEADING_PURCHASED,
          showDetailCardHeadings: isCustomer,
          showActionButtons: true,
          primaryButtonProps: isCustomer ? markReceivedFromPurchasedProps : markPreparedProps,
          secondaryButtonProps: isProvider ? markDeliveredFromPurchasedProps : null,
        };
      } else if (txIsDeclined(tx)) {
        return {
          headingState: HEADING_DECLINED,
          showDetailCardHeadings: isCustomer,
        };
      } else if (txIsCanceled(tx)) {
        return {
          headingState: HEADING_CANCELED,
          showDetailCardHeadings: isCustomer,
        };
      } else if (txIsPrepared(tx)) {
        const primaryButtonProps = isProvider ? { primaryButtonProps: markDeliveredProps } : {};
        return {
          headingState: HEADING_PREPARED,
          showDetailCardHeadings: isCustomer,
          showActionButtons: isProvider,
          ...primaryButtonProps,
        };
      } else if (txIsDelivered(tx)) {
        const primaryButtonPropsMaybe = isCustomer ? { primaryButtonProps: markReceivedProps } : {};
        return {
          headingState: HEADING_DELIVERED,
          showDetailCardHeadings: isCustomer,
          showActionButtons: isCustomer,
          ...primaryButtonPropsMaybe,
          showDispute: isCustomer,
        };
      } else if (txIsDisputed(tx)) {
        return {
          headingState: HEADING_DISPUTED,
          showDetailCardHeadings: isCustomer,
        };
      }
      // else if (txIsReceived(tx) || txIsCompleted(tx) || txIsInFirstReviewBy(tx, !isCustomer)) {
      //   return {
      //     headingState: HEADING_RECEIVED,
      //     showDetailCardHeadings: isCustomer,
      //     showActionButtons: true,
      //     primaryButtonProps: leaveReviewProps,
      //   };
      // }
      else if (txHasBeenReceived(tx)) {
        return {
          headingState: HEADING_RECEIVED,
          showDetailCardHeadings: isCustomer,
        };
      } else {
        return { headingState: 'unknown' };
      }
    };
    const stateData = stateDataFn(currentTransaction);

    const deletedListingTitle = intl.formatMessage({
      id: 'TransactionPanel.deletedListingTitle',
    });

    const { authorDisplayName, customerDisplayName, restaurantName } = displayNames(
      currentUser,
      currentProvider,
      currentCustomer,
      intl
    );

    const { publicData, geolocation } = currentListing.attributes;
    const location = publicData && publicData.location ? publicData.location : {};
    const listingTitle = currentListing.attributes.deleted
      ? deletedListingTitle
      : currentListing.attributes.title;

    const unitType = config.lineItemUnitType;
    const isNightly = unitType === LINE_ITEM_NIGHT;
    const isDaily = unitType === LINE_ITEM_DAY;

    const unitTranslationKey = isNightly
      ? 'TransactionPanel.perNight'
      : isDaily
      ? 'TransactionPanel.perDay'
      : 'TransactionPanel.perUnit';

    const price = currentListing.attributes.price;
    const bookingSubTitle = price
      ? `${formatMoney(intl, price)} ${intl.formatMessage({ id: unitTranslationKey })}`
      : '';

    const firstImage =
      currentListing.images && currentListing.images.length > 0 ? currentListing.images[0] : null;

    const saleButtons = (
      <SaleActionButtonsMaybe
        showButtons={stateData.showSaleButtons}
        acceptInProgress={acceptInProgress}
        declineInProgress={declineInProgress}
        acceptSaleError={acceptSaleError}
        declineSaleError={declineSaleError}
        onAcceptSale={() => onAcceptSale(currentTransaction.id)}
        onDeclineSale={() => onDeclineSale(currentTransaction.id)}
      />
    );

    const actionButtons = (
      <ActionButtonsMaybe
        showButtons={stateData.showActionButtons}
        primaryButtonProps={stateData?.primaryButtonProps}
        secondaryButtonProps={stateData?.secondaryButtonProps}
      />
    );

    const showSendMessageForm =
      !isCustomerBanned && !isCustomerDeleted && !isProviderBanned && !isProviderDeleted;

    const sendMessagePlaceholder = intl.formatMessage(
      { id: 'TransactionPanel.sendMessagePlaceholder' },
      { restaurantName }
    );

    const sendingMessageNotAllowed = intl.formatMessage({
      id: 'TransactionPanel.sendingMessageNotAllowed',
    });

    const paymentMethodsPageLink = (
      <NamedLink name="PaymentMethodsPage">
        <FormattedMessage id="TransactionPanel.paymentMethodsPageLink" />
      </NamedLink>
    );

    const classes = classNames(rootClassName || css.root, className);

    const restOfShoppingCartItems = currentTransaction?.attributes.metadata.restOfShoppingCartItems
      ? currentTransaction?.attributes.metadata.restOfShoppingCartItems.map(item => {
          return JSON.parse(item);
        })
      : false;

    const isAnyItemWithShipping = restOfShoppingCartItems
      ? restOfShoppingCartItems.find(item => {
          return item.checkoutValues.deliveryMethod === 'pickup';
        })
      : false || currentTransaction.attributes.protectedData.deliveryMethod === 'pickup';

    return (
      <div className={classes}>
        <div className={css.container}>
          <div className={css.txInfo}>
            <DetailCardImage
              rootClassName={css.imageWrapperMobile}
              avatarWrapperClassName={css.avatarWrapperMobile}
              listingTitle={listingTitle}
              image={firstImage}
              provider={currentProvider}
              isCustomer={isCustomer}
            />
            {isProvider ? (
              <div className={css.avatarWrapperProviderDesktop}>
                <AvatarLarge user={currentCustomer} className={css.avatarDesktop} />
              </div>
            ) : null}

            <PanelHeading
              panelHeadingState={stateData.headingState}
              transactionRole={transactionRole}
              providerName={authorDisplayName}
              customerName={customerDisplayName}
              isCustomerBanned={isCustomerBanned}
              listingId={currentListing.id && currentListing.id.uuid}
              listingTitle={listingTitle}
              listingDeleted={listingDeleted}
            />

            <div className={css.orderDetails}>
              <div className={css.orderDetailsMobileSection}>
                <BreakdownMaybe
                  transaction={currentTransaction}
                  transactionRole={transactionRole}
                  restOfShoppingCartItems={restOfShoppingCartItems}
                />
                {isAnyItemWithShipping ? (
                  <p className={css.shippingWarningMobile}>
                    <FormattedMessage
                      id="TransactionPanel.warningPickupItems"
                      values={{ restaurantName }}
                    />
                  </p>
                ) : null}
                <DiminishedActionButtonMaybe
                  showDispute={stateData.showDispute}
                  onOpenDisputeModal={onOpenDisputeModal}
                />
              </div>

              {savePaymentMethodFailed ? (
                <p className={css.genericError}>
                  <FormattedMessage
                    id="TransactionPanel.savePaymentMethodFailed"
                    values={{ paymentMethodsPageLink }}
                  />
                </p>
              ) : null}
              <DeliveryInfoMaybe
                className={css.deliveryInfoSection}
                transaction={currentTransaction}
                listing={currentListing}
              />
            </div>

            <FeedSection
              rootClassName={css.feedContainer}
              currentTransaction={currentTransaction}
              currentUser={currentUser}
              fetchMessagesError={fetchMessagesError}
              fetchMessagesInProgress={fetchMessagesInProgress}
              initialMessageFailed={initialMessageFailed}
              messages={messages}
              oldestMessagePageFetched={oldestMessagePageFetched}
              onOpenReviewModal={onOpenReviewModal}
              onShowMoreMessages={() => onShowMoreMessages(currentTransaction.id)}
              totalMessagePages={totalMessagePages}
            />
            {showSendMessageForm ? (
              <SendMessageForm
                formId={this.sendMessageFormName}
                rootClassName={css.sendMessageForm}
                messagePlaceholder={sendMessagePlaceholder}
                inProgress={sendMessageInProgress}
                sendMessageError={sendMessageError}
                onFocus={this.onSendMessageFormFocus}
                onBlur={this.onSendMessageFormBlur}
                onSubmit={this.onMessageSubmit}
              />
            ) : (
              <div className={css.sendingMessageNotAllowed}>{sendingMessageNotAllowed}</div>
            )}

            {stateData.showSaleButtons ? (
              <div className={css.mobileActionButtons}>{saleButtons}</div>
            ) : null}

            {stateData.showActionButtons ? (
              <div className={css.mobileActionButtons}>{actionButtons}</div>
            ) : null}
          </div>

          <div className={css.asideDesktop}>
            <div className={css.stickySection}>
              <div className={css.detailCard}>
                {restOfShoppingCartItems ? null : (
                  <DetailCardImage
                    avatarWrapperClassName={css.avatarWrapperDesktop}
                    listingTitle={listingTitle}
                    image={firstImage}
                    provider={currentProvider}
                    isCustomer={isCustomer}
                  />
                )}
                {restOfShoppingCartItems ? null : (
                  <DetailCardHeadingsMaybe
                    showDetailCardHeadings={stateData.showDetailCardHeadings}
                    listingTitle={listingTitle}
                    subTitle={bookingSubTitle}
                    location={location}
                    geolocation={geolocation}
                    showAddress={stateData.showAddress}
                  />
                )}
                {stateData.showOrderPanel ? (
                  <OrderPanel
                    className={css.orderPanel}
                    titleClassName={css.orderTitle}
                    isOwnListing={false}
                    unitType={unitType}
                    listing={currentListing}
                    title={listingTitle}
                    author={currentProvider}
                    onSubmit={onSubmitOrderRequest}
                    onManageDisableScrolling={onManageDisableScrolling}
                    timeSlots={timeSlots}
                    fetchTimeSlotsError={fetchTimeSlotsError}
                    onFetchTransactionLineItems={onFetchTransactionLineItems}
                    lineItems={lineItems}
                    fetchLineItemsInProgress={fetchLineItemsInProgress}
                    fetchLineItemsError={fetchLineItemsError}
                  />
                ) : null}
                <BreakdownMaybe
                  className={css.breakdownContainer}
                  transaction={currentTransaction}
                  transactionRole={transactionRole}
                  restOfShoppingCartItems={restOfShoppingCartItems}
                />

                {isAnyItemWithShipping ? (
                  <p className={css.shippingWarning}>
                    Caution! Some items need to be picked up at the restaurant
                  </p>
                ) : null}

                {stateData.showSaleButtons ? (
                  <div className={css.desktopActionButtons}>{saleButtons}</div>
                ) : null}

                {stateData.showActionButtons ? (
                  <div className={css.desktopActionButtons}>{actionButtons}</div>
                ) : null}
              </div>
              <DiminishedActionButtonMaybe
                showDispute={stateData.showDispute}
                onOpenDisputeModal={onOpenDisputeModal}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TransactionPanelComponent.defaultProps = {
  rootClassName: null,
  className: null,
  currentUser: null,
  fetchMessagesError: null,
  initialMessageFailed: false,
  savePaymentMethodFailed: false,
  sendMessageError: null,
  sendReviewError: null,
  timeSlots: null,
  fetchTimeSlotsError: null,
  nextTransitions: null,
  lineItems: null,
  fetchLineItemsError: null,
};

const actionButtonShape = shape({
  inProgress: bool.isRequired,
  error: propTypes.error,
  onTransition: func.isRequired,
  buttonText: string.isRequired,
  errorText: string.isRequired,
});

TransactionPanelComponent.propTypes = {
  rootClassName: string,
  className: string,

  currentUser: propTypes.currentUser,
  transaction: propTypes.transaction.isRequired,
  totalMessagePages: number.isRequired,
  oldestMessagePageFetched: number.isRequired,
  messages: arrayOf(propTypes.message).isRequired,
  initialMessageFailed: bool,
  savePaymentMethodFailed: bool,
  fetchMessagesInProgress: bool.isRequired,
  fetchMessagesError: propTypes.error,
  sendMessageInProgress: bool.isRequired,
  sendMessageError: propTypes.error,
  onManageDisableScrolling: func.isRequired,
  onOpenDisputeModal: func.isRequired,
  onOpenReviewModal: func.isRequired,
  onShowMoreMessages: func.isRequired,
  onSendMessage: func.isRequired,
  onSubmitOrderRequest: func.isRequired,
  timeSlots: arrayOf(propTypes.timeSlot),
  fetchTimeSlotsError: propTypes.error,
  nextTransitions: array,

  // Tx process transition related props
  markReceivedProps: actionButtonShape.isRequired,
  markReceivedFromPurchasedProps: actionButtonShape.isRequired,
  markPreparedProps: actionButtonShape.isRequired,
  markDeliveredFromPurchasedProps: actionButtonShape.isRequired,
  markDeliveredProps: actionButtonShape.isRequired,
  leaveReviewProps: actionButtonShape.isRequired,

  // line items
  onFetchTransactionLineItems: func.isRequired,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // from injectIntl
  intl: intlShape,
};

const TransactionPanel = injectIntl(TransactionPanelComponent);

export default TransactionPanel;
