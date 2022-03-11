import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../../../components';
import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import { array, arrayOf, bool, func, shape, string, oneOf } from 'prop-types';
import { propTypes } from '../../../util/types';
import { pushToPath } from '../../../util/urlHelpers';
import { formatMoney } from '../../../util/currency';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import css from './TopbarDesktop.module.css';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { types as sdkTypes } from '../../../util/sdkLoader';
import config from '../../../config';
import routeConfiguration from '../../../routing/routeConfiguration';
import { createResourceLocatorString, findRouteByRouteName } from '../../../util/routes';
import { sendEnquiry, fetchTransactionLineItems } from './ShoppingCart.duck';
import { setInitialValues } from '../../../containers/CheckoutPage/CheckoutPage.duck';
import { initializeCardPaymentData } from '../../../ducks/stripe.duck.js';
import { manageDisableScrolling, isScrollingDisabled } from '../../../ducks/UI.duck';

import { createSlug } from '../../../util/urlHelpers';
const { UUID } = sdkTypes;
const sharetribeSdk = require('sharetribe-flex-sdk');
const sdk = sharetribeSdk.createInstance({
  clientId: process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID
});

const { Money } = sdkTypes;


const ShoppingCartComponent = (props) => {

    const { 
      mobile, 
      intl,
      callSetInitialValues
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [shoppingCartItems, setShoppingCartItems] = useState([]);

    useEffect(() => {
        sdk.currentUser.show().then(res => {
            const shoppingCart = res.data.data.attributes.profile.publicData.shoppingCart;
            if(shoppingCart && shoppingCart?.length > 0){
                setShoppingCartItems(shoppingCart.map(item => {
                    return({
                        listing: JSON.parse(item.listing),
                        checkoutValues: JSON.parse(item.checkoutValues)
                      })
                }))
            }
          }).catch(e => console.log(e))
    },[isOpen]) 


    const deleteItem = (id) => {
             
                  let newShoppingCart = [...shoppingCartItems]

                  const indexOfRemovingItem = newShoppingCart.findIndex(item => {
                    return item.listing.id.uuid === id
                  })

                  if (indexOfRemovingItem > -1) {
                    newShoppingCart.splice(indexOfRemovingItem, 1); // 2nd parameter means remove one item only
                  }

                  return sdk.currentUser.updateProfile({
                    publicData: {
                      shoppingCart: newShoppingCart.map(item => {
                                        return({
                                          listing: JSON.stringify({...item.listing}),
                                          checkoutValues: JSON.stringify({...item.checkoutValues})
                                        })
                                    })
                    },
                  }).then(res => {
                    setShoppingCartItems(newShoppingCart)
                  }).catch(e => console.log(e))

                
    }

    let totalPrice

    if(shoppingCartItems.length > 0 ){
        const amountsArray = shoppingCartItems.map(i => {return i.listing.attributes.price.amount * Number(i.checkoutValues.quantity)});
        const totalAmount = amountsArray.reduce(
            (previousValue, currentValue) => previousValue + currentValue, 0);
        totalPrice = intl ? formatMoney(intl, new Money(totalAmount, config.currency)) : `${totalAmount / 100} ${config.currency}`;
    }

    // const callSetInitialValues = (setInitialValues, values, saveToSessionStorage) => {
    //         return setInitialValues(values, saveToSessionStorage)
    // }

    const toCheckout = () => {
    
      const {
        history,
      } = props;
      const listingId = new UUID(shoppingCartItems[0].listing.id.uuid);
      const listing = shoppingCartItems[0].listing;
  
      const orderData = shoppingCartItems[0].checkoutValues;
      // const restOfShoppingCartItems = [...shoppingCartItems];
      // restOfShoppingCartItems.shift();
      // bookingData.restOfShoppingCartItems = restOfShoppingCartItems;
   
  
      const initialValues = {
        listing,
        orderData,
        confirmPaymentError: null,
      };
  
      const saveToSessionStorage = true;
  
      const routes = routeConfiguration();
      // Customize checkout page state with current listing and selected bookingDates
      // const { setInitialValues } = findRouteByRouteName('CheckoutPage', routes);
  
      callSetInitialValues(setInitialValues, initialValues, saveToSessionStorage);
  
      // Clear previous Stripe errors from store if there is any
      initializeCardPaymentData();
  
      // Redirect to CheckoutPage
      history.push(
        createResourceLocatorString(
          'CheckoutPage',
          routes,
          { id: listing.id.uuid, slug: createSlug(listing.attributes.title) },
          {}
        )
      );
    }


  return (
      <>
      <div className={css.shoppingCartWrapper} onClick={() => setIsOpen(true)}>
             {
                mobile ? 
                <span className={css.mobileLabel}>
                    <FormattedMessage id="ShoppingCart.mobileLabel" />
                </span> 
                : 
                <ShoppingCartIcon className={css.cartIcon}/>
             }
             {shoppingCartItems.length > 0 ?
                <div className={css.dotInfo}>
                    {shoppingCartItems.length}
                </div> : null
             }
      </div>

            <Modal
                isOpen={isOpen}
                onClose={() => {
                setIsOpen(false);
                }}
                onManageDisableScrolling={() => {}}
                doubleModal={mobile}
            >
                {shoppingCartItems.length === 0 ?
                <>  {mobile ? <br/> : null}
                    <center><h2><FormattedMessage id="ShoppingCart.emptyTitle" /></h2></center>
                    <br/> 
                    <Button onClick={() => pushToPath('/s')}>
                        <FormattedMessage id="ShoppingCart.searchListing" />
                    </Button>
                </>  : 
                <div className={css.cartItemsWrapper}>  
                     {shoppingCartItems.map(item => {
                          
                          const totalItemAmount = item.listing.attributes.price.amount * Number(item.checkoutValues.quantity);
                          const totalPriceOfItem = new Money(totalItemAmount, config.currency);
                          const formattedPrice = intl ? formatMoney(intl, totalPriceOfItem) : `${totalItemAmount / 100} ${totalPriceOfItem.currency}`;

                         return(
                             <div className={css.cartItem}>
                                 <div>
                                 <span>{item.checkoutValues.quantity} x <a onClick={() => pushToPath(`/l/${item.listing.attributes.title.replace(' ','-')}/${item.listing.id.uuid}`)}>{item.listing.attributes.title}</a></span>                                 </div>
                                 <div>
                                    <DeleteOutlineIcon
                                     className={css.deleteIcon}
                                     onClick={() => deleteItem(item.listing.id.uuid)}
                                     />

                                    <span>{formattedPrice}</span>
                                 </div>
                             </div>
                         )
                     })} 


                     <div className={css.total}>    
                        <span> <FormattedMessage id="ShoppingCart.total" /></span>

                        <span>{totalPrice}</span>
                     </div>    

                     <br/>
                     <Button type='button' onClick={toCheckout}><FormattedMessage id="ShoppingCart.checkout" /></Button>  
                
                </div>  
                }
            </Modal>
      </>
  )
}

ShoppingCartComponent.defaultProps = {
  unitType: config.bookingUnitType,
  currentUser: null,
  filterConfig: config.custom.filters,
};

ShoppingCartComponent.propTypes = {
  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    search: string,
  }).isRequired,

  unitType: propTypes.bookingUnitType,
  // from injectIntl
  intl: intlShape.isRequired,
  isAuthenticated: bool.isRequired,
  currentUser: propTypes.currentUser,
  onManageDisableScrolling: func.isRequired,
  scrollingDisabled: bool.isRequired,
  callSetInitialValues: func.isRequired,
  onInitializeCardPaymentData: func.isRequired,
  filterConfig: array,
};

const mapStateToProps = state => {
  const { isAuthenticated } = state.Auth;
  const { currentUser } = state.user;



  return {
    isAuthenticated,
    currentUser,
    scrollingDisabled: isScrollingDisabled(state),
  };
};

const mapDispatchToProps = dispatch => ({
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  callSetInitialValues: (setInitialValues, values, saveToSessionStorage) =>
    dispatch(setInitialValues(values, saveToSessionStorage)),
  onInitializeCardPaymentData: () => dispatch(initializeCardPaymentData()),
});


const ShoppingCart = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(ShoppingCartComponent);

export default ShoppingCart;


