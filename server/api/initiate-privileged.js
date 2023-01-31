const { transactionLineItems } = require('../api-util/lineItems');
const { getSdk, getTrustedSdk, handleError, serialize } = require('../api-util/sdk');
const {
  getAdditionalListings,
  getCartListingLineItems,
  adjustCartStock,
} = require('../api-util/cart');

module.exports = (req, res) => {
  const { isSpeculative, orderData, bodyParams, queryParams } = req.body;

  const listingId = bodyParams && bodyParams.params ? bodyParams.params.listingId : null;
  const restOfShoppingCartItems = orderData.restOfShoppingCartItems || [];
  const cartAdditionalListingIds = restOfShoppingCartItems.map(item => item.listingId);

  const sdk = getSdk(req, res);
  let listing = null;
  let additionalListings = null;
  let transactionInitiateResponse = null;

  sdk.listings
    .show({ id: listingId })
    .then(listingResponse => {
      listing = listingResponse.data.data;
      return getAdditionalListings({ sdk, cartAdditionalListingIds });
    })
    .then(additionalListingsResponse => {
      additionalListings = additionalListingsResponse;
      return getTrustedSdk(req);
    })
    .then(trustedSdk => {
      const { params } = bodyParams;
      let protectedData = params.protectedData || {};

      // email compatible
      const cartListingLineItems = getCartListingLineItems({
        orderData: { ...orderData, ...bodyParams.params },
        listing,
        additionalListings,
      });
      const cartListingLineItemNames = cartListingLineItems.map(i => i.title).join(', ');

      protectedData = {
        ...protectedData,
        restOfShoppingCartItems,
        cartListingLineItems,
        cartListingLineItemNames,
      };

      // console.log('protectedData=', JSON.stringify(protectedData, null, 2));

      const lineItems = transactionLineItems(
        listing,
        { ...orderData, ...bodyParams.params },
        cartListingLineItems
      );

      // Add lineItems to the body params
      const body = {
        ...bodyParams,
        params: {
          ...params,
          lineItems,
          protectedData,
        },
      };

      if (isSpeculative) {
        return trustedSdk.transactions.initiateSpeculative(body, queryParams);
      }
      return trustedSdk.transactions.initiate(body, queryParams);
    })
    .then(apiResponse => {
      transactionInitiateResponse = apiResponse;

      if (isSpeculative) {
        return Promise.resolve(true);
      }
      return adjustCartStock({ restOfShoppingCartItems, additionalListings });
    })
    .then(adjustCartStockResponse => {
      const { status, statusText, data } = transactionInitiateResponse;
      res
        .status(status)
        .set('Content-Type', 'application/transit+json')
        .send(
          serialize({
            status,
            statusText,
            data,
          })
        )
        .end();
    })
    .catch(e => {
      handleError(res, e);
    });
};
