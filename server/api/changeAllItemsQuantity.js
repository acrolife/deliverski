const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');
const { getSdk } = require('../api-util/sdk');
const { getAdditionalListings } = require('../api-util/cart');

const integrationSdk = sharetribeIntegrationSdk.createInstance({
  clientId: process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_ID,
  clientSecret: process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_SECRET,
});

module.exports = (req, response) => {
  const restOfShoppingCartItems = req.body.restOfShoppingCartItems;
  const cartAdditionalListingIds = restOfShoppingCartItems.map(item => item.listingId);
  let additionalListings = null;

  const sdk = getSdk(req, response);

  return getAdditionalListings({ sdk, cartAdditionalListingIds })
    .then(additionalListingsResponse => {
      additionalListings = additionalListingsResponse;

      const promises = restOfShoppingCartItems.map(item => {
        const { quantity, listingId } = item;
        const listing = additionalListings.find(l => l.id.uuid === listingId);
        const currentQuantity = listing.currentStock.attributes.quantity;
        const newQuantity = Number(currentQuantity) - Number(quantity);
        console.log(
          'set quantity listing=',
          listing.id.uuid,
          ' cart quantity=',
          quantity,
          ' currentQuantity=',
          currentQuantity,
          ' newQuantity=',
          newQuantity
        );
        return integrationSdk.stockAdjustments
          .create({
            listingId: listingId,
            quantity: newQuantity,
          })
          .catch(e => console.log(e));
      });

      return Promise.all(promises);
    })
    .then(resp => {
      return response.sendStatus(200);
    })
    .catch(e => {
      return response.sendStatus(200);
    });
};
