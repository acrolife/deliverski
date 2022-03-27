import React, { useRef, useEffect, useState } from 'react';
import { bool, func, number, string } from 'prop-types';
import { Form as FinalForm, FormSpy } from 'react-final-form';

import config from '../../../config';
import { FormattedMessage, useIntl } from '../../../util/reactIntl';
import { propTypes } from '../../../util/types';
import { numberAtLeast, required } from '../../../util/validators';

import {
  Form,
  FieldSelect,
  FieldTextInput,
  InlineTextButton,
  PrimaryButton,
  Modal,
  Button
} from '../../../components';
import { pushToPath } from '../../../util/urlHelpers';

import EstimatedCustomerBreakdownMaybe from '../EstimatedCustomerBreakdownMaybe';

import css from './ProductOrderForm.module.css';

const sharetribeSdk = require('sharetribe-flex-sdk');
const sdk = sharetribeSdk.createInstance({
  clientId: process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID
});


const renderForm = formRenderProps => {
  const {
    // FormRenderProps from final-form
    handleSubmit,
    form: formApi,

    // Custom props passed to the form component
    intl,
    formId,
    currentStock,
    hasMultipleDeliveryMethods,
    listingId,
    isOwnListing,
    onFetchTransactionLineItems,
    onContactUser,
    lineItems,
    fetchLineItemsInProgress,
    fetchLineItemsError,
    values,
    listing,
    currentUser,
    history
  } = formRenderProps;

  const [sameVendorWarningModalOpen, setSameVendorWarningModalOpen] = useState(false);

  const handleOnChange = formValues => {
    const { quantity: quantityRaw, deliveryMethod } = formValues.values;
    const quantity = Number.parseInt(quantityRaw, 10);
    if (quantity && deliveryMethod && !fetchLineItemsInProgress) {
      onFetchTransactionLineItems({
        orderData: { quantity, deliveryMethod },
        listingId,
        isOwnListing,
      });
    }
  };

  // In case quantity and deliveryMethod are missing focus on that select-input.
  // Otherwise continue with the default handleSubmit function.
  const handleFormSubmit = e => {
    const { quantity, deliveryMethod } = values || {};
    if (!quantity || quantity < 1) {
      e.preventDefault();
      // Blur event will show validator message
      formApi.blur('quantity');
      formApi.focus('quantity');
    } else if (!deliveryMethod) {
      e.preventDefault();
      // Blur event will show validator message
      formApi.blur('deliveryMethod');
      formApi.focus('deliveryMethod');
    } else {
      e.preventDefault();
      const currentListing = listing;
      return sdk.currentUser.show().then(res => {
        const currentShoppingCart = res.data.data.attributes.profile.publicData.shoppingCart ? 
                                    res.data.data.attributes.profile.publicData.shoppingCart 
                                    : [];
                              
        const currentShoppingCartUnwrapped = currentShoppingCart.map(item => {
                                    return({
                                        listing: JSON.parse(item.listing),
                                        checkoutValues: JSON.parse(item.checkoutValues)
                                      })
                                })
        const isFromSameVendor = currentShoppingCartUnwrapped.length === 0 || currentShoppingCartUnwrapped.find(item => {
          return item.listing.author.id.uuid === currentListing.author.id.uuid
        })

              if(isFromSameVendor){

                  const isAlreadyInTheBasket = currentShoppingCartUnwrapped.find(i => {
                    return i.listing.id.uuid === currentListing.id.uuid
                  })

                  if(isAlreadyInTheBasket){
                    // UPDATE EXISTING ITEM QUANTITY
                    const updatedShoppingCard = currentShoppingCartUnwrapped.map(i => {
                        if(i.listing.id.uuid === currentListing.id.uuid){
                            i.checkoutValues.quantity = (Number(i.checkoutValues.quantity) + Number(quantity)).toString()
                            return i
                        }else{
                          return i
                        }

                    })

                    const stringifyUpdatedShoppingCart = updatedShoppingCard.map(item => {
                      return({
                        listing: JSON.stringify(item.listing),
                        checkoutValues: JSON.stringify(item.checkoutValues)
                      })
                    })

                    return sdk.currentUser.updateProfile({
                      publicData: {
                        shoppingCart: [...stringifyUpdatedShoppingCart]
                      },
                    }).then(res => {
                        history.push('/s')
                    }).catch(e => console.log(e))

                  }else{
                      //ADD NEW ITEM TO CART

                      const shoppingCartItem = {
                        listing: JSON.stringify({...currentListing}),
                        checkoutValues: JSON.stringify({...values})
                      }

                      return sdk.currentUser.updateProfile({
                        publicData: {
                          shoppingCart: [...currentShoppingCart, shoppingCartItem]
                        },
                      }).then(res => {
                          history.push('/s')
                      }).catch(e => console.log(e))
                  }

              

              }else{
                  setSameVendorWarningModalOpen(true)
              }
                                  
    }).catch(e => console.log(e))
    
      // handleSubmit(e);
    }
  };


  const clearBasket = () => {
    return sdk.currentUser.updateProfile({
      publicData: {
        shoppingCart: []
      },
    }).then(res => {
        window.location.reload()
    }).catch(e => console.log(e))
  }


  const breakdownData = {};
  const showBreakdown =
    breakdownData && lineItems && !fetchLineItemsInProgress && !fetchLineItemsError;
  const breakdown = showBreakdown ? (
    <div className={css.breakdownWrapper}>
      <h3>
        <FormattedMessage id="ProductOrderForm.breakdownTitle" />
      </h3>
      <EstimatedCustomerBreakdownMaybe
        unitType={config.lineItemUnitType}
        breakdownData={breakdownData}
        lineItems={lineItems}
      />
    </div>
  ) : null;

  const showContactUser = typeof onContactUser === 'function';

  const onClickContactUser = e => {
    e.preventDefault();
    onContactUser();
  };

  const contactSellerLink = (
    <InlineTextButton onClick={onClickContactUser}>
      <FormattedMessage id="ProductOrderForm.finePrintNoStockLinkText" />
    </InlineTextButton>
  );
  const quantityRequiredMsg = intl.formatMessage({ id: 'ProductOrderForm.quantityRequired' });

  const hasStock = currentStock && currentStock > 0;
  const quantities = hasStock ? [...Array(currentStock).keys()].map(i => i + 1) : [];
  const hasNoStockLeft = typeof currentStock != null && currentStock === 0;
  const hasOneItemLeft = typeof currentStock != null && currentStock === 1;

  const submitInProgress = fetchLineItemsInProgress;
  const submitDisabled = !hasStock;


  const currentShopCart = currentUser ? currentUser.attributes.profile.publicData.shoppingCart ? 
  currentUser.attributes.profile.publicData.shoppingCart 
  : []: [];

  const currentShopCartUnwrapped = currentShopCart.map(item => {
        return({
            listing: JSON.parse(item.listing),
            checkoutValues: JSON.parse(item.checkoutValues)
          })
    });


  const hostIdOfFirstItem = currentShopCartUnwrapped.length > 0 ? currentShopCartUnwrapped[0].listing.author.id.uuid  : false;


  return (
    <Form onSubmit={handleFormSubmit}>
      <FormSpy subscription={{ values: true }} onChange={handleOnChange} />
      {hasNoStockLeft ? null : hasOneItemLeft ? (
        <FieldTextInput
          id={`${formId}.quantity`}
          className={css.quantityField}
          name="quantity"
          type="hidden"
          validate={numberAtLeast(quantityRequiredMsg, 1)}
        />
      ) : (
        <FieldSelect
          id={`${formId}.quantity`}
          className={css.quantityField}
          name="quantity"
          disabled={!hasStock}
          label={intl.formatMessage({ id: 'ProductOrderForm.quantityLabel' })}
          validate={numberAtLeast(quantityRequiredMsg, 1)}
        >
          <option disabled value="">
            {intl.formatMessage({ id: 'ProductOrderForm.selectQuantityOption' })}
          </option>
          {quantities.map(quantity => (
            <option key={quantity} value={quantity}>
              {intl.formatMessage({ id: 'ProductOrderForm.quantityOption' }, { quantity })}
            </option>
          ))}
        </FieldSelect>
      )}

      {hasNoStockLeft ? null : hasMultipleDeliveryMethods ? (
        <FieldSelect
          id={`${formId}.deliveryMethod`}
          className={css.deliveryField}
          name="deliveryMethod"
          disabled={!hasStock}
          label={intl.formatMessage({ id: 'ProductOrderForm.deliveryMethodLabel' })}
          validate={required(intl.formatMessage({ id: 'ProductOrderForm.deliveryMethodRequired' }))}
        >
          {/* <option disabled value="">
            {intl.formatMessage({ id: 'ProductOrderForm.selectDeliveryMethodOption' })}
          </option> */}
          <option value={'pickup'}>
            {intl.formatMessage({ id: 'ProductOrderForm.pickupOption' })}
          </option>
          <option value={'shipping'}>
            {intl.formatMessage({ id: 'ProductOrderForm.shippingOption' })}
          </option>
        </FieldSelect>
      ) : (
        <div className={css.deliveryField}>
          <label>{intl.formatMessage({ id: 'ProductOrderForm.deliveryMethodLabel' })}</label>
          <p className={css.singleDeliveryMethodSelected}>
            {values.deliveryMethod === 'shipping'
              ? intl.formatMessage({ id: 'ProductOrderForm.shippingOption' })
              : intl.formatMessage({ id: 'ProductOrderForm.pickupOption' })}
          </p>
          <FieldTextInput
            id={`${formId}.deliveryMethod`}
            className={css.deliveryField}
            name="deliveryMethod"
            type="hidden"
          />
        </div>
      )}
      {breakdown}
      <div className={css.submitButton}>
        <PrimaryButton type="submit" inProgress={submitInProgress} disabled={submitDisabled}>
          {hasStock ? (
            <FormattedMessage id="BookingDatesForm.addToCart" />
          ) : (
            <FormattedMessage id="ProductOrderForm.ctaButtonNoStock" />
          )}
        </PrimaryButton>
      </div>
      <p className={css.finePrint}>
        {hasStock ? (
          <FormattedMessage id="ProductOrderForm.finePrint" />
        ) : showContactUser ? (
          <FormattedMessage id="ProductOrderForm.finePrintNoStock" values={{ contactSellerLink }} />
        ) : null}
      </p>

              {/* not same vendor warning */}

              <Modal
                id='sameVendorModal'
                isOpen={sameVendorWarningModalOpen}
                onClose={() => {
                  setSameVendorWarningModalOpen(false);
                }}
                onManageDisableScrolling={() => {}}
              >
                <center><h2><FormattedMessage id="ListingPage.sameVendorModalTitle" /></h2></center>


                <div className={css.modalButtonsWrapper}>

                  <Button type='button' className={css.modalButton} onClick={clearBasket}>
                    <FormattedMessage id="ListingPage.clearBasket" />
                  </Button>

                  <Button type='button' className={css.modalButton} onClick={() => pushToPath(`/s?pub_hostId=${hostIdOfFirstItem}`)}>
                      <FormattedMessage id="ListingPage.seeSameVendorListings" />
                  </Button>

                </div>
              </Modal>
    </Form>
  );
};

const ProductOrderForm = props => {
  const intl = useIntl();
  const { price, currentStock, pickupEnabled, shippingEnabled } = props;

  // Should not happen for listings that go through EditListingWizard.
  // However, this might happen for imported listings.
  if (!pickupEnabled && !shippingEnabled) {
    <p className={css.error}>
      <FormattedMessage id="ProductOrderForm.noDeliveryMethodSet" />
    </p>;
  }

  if (!price) {
    return (
      <p className={css.error}>
        <FormattedMessage id="ProductOrderForm.listingPriceMissing" />
      </p>
    );
  }
  if (price.currency !== config.currency) {
    return (
      <p className={css.error}>
        <FormattedMessage id="ProductOrderForm.listingCurrencyInvalid" />
      </p>
    );
  }
  const hasOneItemLeft = currentStock && currentStock === 1;
  const quantityMaybe = hasOneItemLeft ? { quantity: '1' } : {};
  const singleDeliveryMethodAvailableMaybe =
  shippingEnabled ?
  { deliveryMethod: 'shipping' }
  :
    (shippingEnabled && !pickupEnabled
      ? { deliveryMethod: 'shipping' }
      : !shippingEnabled && pickupEnabled
      ? { deliveryMethod: 'pickup' }
      : {});
  const hasMultipleDeliveryMethods = pickupEnabled && shippingEnabled;
  const initialValues = { ...quantityMaybe, ...singleDeliveryMethodAvailableMaybe };

  return (
    <FinalForm
      initialValues={initialValues}
      hasMultipleDeliveryMethods={hasMultipleDeliveryMethods}
      {...props}
      intl={intl}
      render={renderForm}
    />
  );
};

ProductOrderForm.defaultProps = {
  rootClassName: null,
  className: null,
  price: null,
  currentStock: null,
  listingId: null,
  isOwnListing: false,
  lineItems: null,
  fetchLineItemsError: null,
};

ProductOrderForm.propTypes = {
  rootClassName: string,
  className: string,

  // form
  formId: string.isRequired,
  onSubmit: func.isRequired,

  // listing
  listingId: propTypes.uuid,
  price: propTypes.money,
  currentStock: number,
  isOwnListing: bool,

  // line items
  lineItems: propTypes.lineItems,
  onFetchTransactionLineItems: func.isRequired,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // other
  onContactUser: func,
};

export default ProductOrderForm;
