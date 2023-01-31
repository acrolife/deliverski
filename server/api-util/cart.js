const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');

const integrationSdk = sharetribeIntegrationSdk.createInstance({
  clientId: process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_ID,
  clientSecret: process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_SECRET,
});

const getAdditionalListings = ({ sdk, cartAdditionalListingIds }) => {
  if (cartAdditionalListingIds) {
    const queryParams = {
      ids: cartAdditionalListingIds,
      page: 1,
      perPage: 100,
      include: ['currentStock', 'images'],
      'fields.image': ['variants.square-small'],
      'limit.images': 1,
    };
    return sdk.listings.query(queryParams).then(res => {
      const listings = res.data.data;
      const included = res.data.included;
      listings.forEach(listing => {
        const stockId = listing.relationships.currentStock.data.id.uuid;
        listing.currentStock = included.find(i => i.type === 'stock' && i.id.uuid === stockId);
        const imageId = listing.relationships.images.data[0].id.uuid;
        const image = included.find(i => i.type === 'image' && i.id.uuid === imageId);
        listing.image = image.attributes.variants['square-small'].url;
      });

      return listings;
    });
  }
  return Promise.resolve([]);
};

const formatListing = ({ listing, quantity }) => {
  const amount = listing.attributes.price.amount / 100; // email compatible
  const currency = listing.attributes.price.currency;
  return {
    id: listing.id.uuid,
    image: listing.image,
    title: listing.attributes.title,
    unitPrice: {
      amount,
      currency,
    },
    unit: listing.attributes.publicData.unit,
    quantity: quantity,
    total: {
      amount: amount * quantity,
      currency,
    },
  };
};

const getCartListingLineItems = ({ orderData, listing, additionalListings }) => {
  const { restOfShoppingCartItems } = orderData;
  const quantity = orderData.stockReservationQuantity || orderData.quantity || 1;
  const lineItems = [];
  lineItems.push(formatListing({ listing, quantity }));
  restOfShoppingCartItems.forEach(cartItem => {
    const l = additionalListings.find(listing => listing.id.uuid === cartItem.listingId);
    if (l) {
      lineItems.push(formatListing({ listing: l, quantity: cartItem.quantity }));
    }
  });

  return lineItems;
};

const adjustCartStock = ({ restOfShoppingCartItems, additionalListings }) => {
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
        quantity: -1 * quantity,
      })
      .catch(e => {
        const errors = e.data?.errors;
        if (errors) {
          console.error('Error: adjustCartStock ', JSON.stringify(errors, null, 2));
        } else {
          console.error(e);
        }
      });
  });

  return Promise.all(promises);
};

module.exports = {
  getAdditionalListings,
  getCartListingLineItems,
  adjustCartStock,
};
