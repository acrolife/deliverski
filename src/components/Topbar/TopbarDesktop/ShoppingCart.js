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
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

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
const minOrderAmount = process.env.REACT_APP_MIN_CHECKOUT_AMOUNT;
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
    const [currentUser, setCurrentUser] = useState(null);
    const [notLoggedInWarning, setNotLoggedInWarning] = useState(false);

    useEffect(() => {
        sdk.currentUser.show().then(res => {
            setCurrentUser(res.data.data)
            const shoppingCart = res.data.data.attributes.profile.publicData.shoppingCart;
            if(shoppingCart && shoppingCart?.length > 0){
                setShoppingCartItems(shoppingCart.map(item => {
                    return({
                        listing: JSON.parse(item.listing),
                        checkoutValues: JSON.parse(item.checkoutValues)
                      })
                }))
            }
          }).catch(e => {
            if(typeof window !== 'undefined'){
              const shoppingCart = JSON.parse(window.sessionStorage.getItem('shoppingCart'));

              if(shoppingCart && shoppingCart?.length > 0){
                setShoppingCartItems(shoppingCart.map(item => {
                    return({
                        listing: JSON.parse(typeof item.listing === 'string' ? item.listing : JSON.stringify(item.listing)),
                        checkoutValues: JSON.parse(typeof item.checkoutValues === 'string' ? item.checkoutValues : JSON.stringify(item.checkoutValues))
                      })
                }))
            }

            }
            return console.log(e)
          })
    },[isOpen]) 


    const deleteItem = (id) => {
             
                  let newShoppingCart = [...shoppingCartItems]

                  const indexOfRemovingItem = newShoppingCart.findIndex(item => {
                    return item.listing.id.uuid === id
                  })

                  if (indexOfRemovingItem > -1) {
                    newShoppingCart.splice(indexOfRemovingItem, 1); // 2nd parameter means remove one item only
                  }

                  if(currentUser){
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
                  }else{
                    window.sessionStorage.setItem('shoppingCart', JSON.stringify(newShoppingCart))
                    setShoppingCartItems(newShoppingCart)
                  }


                
    }


    const add = (id) => {
      let newShoppingCart = [...shoppingCartItems]

      newShoppingCart.map(item => {
        let newItem = {...item}

        if(newItem.listing.id.uuid === id){
          newItem.checkoutValues.quantity = (Number(newItem.checkoutValues.quantity) + 1).toString();
        }

        return newItem
      })

      if(currentUser){
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
      }else{
        window.sessionStorage.setItem('shoppingCart', JSON.stringify(newShoppingCart))
        setShoppingCartItems(newShoppingCart)
      }
    
    }

    const remove = (id) => {
      let newShoppingCart = [...shoppingCartItems];

      const foundItem = newShoppingCart.find(item => {
        return item.listing.id.uuid === id
      });

      const isQuantityOne = Number(foundItem.checkoutValues.quantity) === 1;
      if(isQuantityOne){
          return deleteItem(id)
      }else{
        newShoppingCart.map(item => {
          let newItem = {...item}
  
          if(newItem.listing.id.uuid === id){
            newItem.checkoutValues.quantity = (Number(newItem.checkoutValues.quantity) - 1).toString();
          }
  
          return newItem
        })
  
        if(currentUser){
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
        }else{
          window.sessionStorage.setItem('shoppingCart', JSON.stringify(newShoppingCart))
          setShoppingCartItems(newShoppingCart)
        }

      }
 
    }

    let totalPrice
    let totalOrderAmount = 0

    if(shoppingCartItems.length > 0 ){
        const amountsArray = shoppingCartItems.map(i => {return i.listing.attributes.price.amount * Number(i.checkoutValues.quantity)});
        const totalAmount = amountsArray.reduce(
            (previousValue, currentValue) => previousValue + currentValue, 0);
        totalOrderAmount = totalAmount
        totalPrice = intl ? formatMoney(intl, new Money(totalAmount, config.currency)) : `${totalAmount / 100} ${config.currency}`;
    }


    const isBelowMininumAmount = totalOrderAmount < Number(minOrderAmount) * 100;

    // const callSetInitialValues = (setInitialValues, values, saveToSessionStorage) => {
    //         return setInitialValues(values, saveToSessionStorage)
    // }

    const toCheckout = () => {
    if(currentUser){
      const {
        history,
      } = props;
      const listingId = new UUID(shoppingCartItems[0].listing.id.uuid);
      const listing = shoppingCartItems[0].listing;
  
      const orderData = shoppingCartItems[0].checkoutValues;
      // const restOfShoppingCartItems = [...shoppingCartItems];
      // restOfShoppingCartItems.shift();
      // bookingData.restOfShoppingCartItems = restOfShoppingCartItems;
   
      const restOfShoppingCartItems = [...shoppingCartItems];
      restOfShoppingCartItems.shift();
      orderData.restOfShoppingCartItems = restOfShoppingCartItems;
  
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
    }else{
      setNotLoggedInWarning(true)
    }

    }


    const shippingItem = shoppingCartItems.find(item => {
      return item.checkoutValues.deliveryMethod === "shipping"
    })

    let quantityTotal = 0;

    shoppingCartItems.forEach(item => {
      quantityTotal += Number(item.checkoutValues.quantity)
    })


  return (
      <>
      <div className={css.shoppingCartWrapper} onClick={() => setIsOpen(true)}>
             {
                // mobile ? 
                // <span className={css.mobileLabel}>
                //     <FormattedMessage id="ShoppingCart.mobileLabel" />
                // </span> 
                // : 
                <ShoppingCartIcon className={css.cartIcon}/>
             }
             {shoppingCartItems.length > 0 ?
                <div className={css.dotInfo}>
                    {quantityTotal}
                </div> : null
             }
      </div>

            <Modal
                id='shoppingCartModal'
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
                             <div className={css.cartItem} key={item.listing.id.uuid}>
                                 <div className={css.cartItemLeft}>
                                    <span>
                                      {item.checkoutValues.quantity} x <a onClick={() => pushToPath(`/l/${item.listing.attributes.title.replace(' ','-')}/${item.listing.id.uuid}`)}>{item.listing.attributes.title}</a>
                                    </span>  
                                    <div className={css.buttonsWrapper}>
                                        <RemoveIcon 
                                        className={css.quantityButton}
                                        onClick={() => remove(item.listing.id.uuid)}
                                        />
                                        <AddIcon 
                                        className={css.quantityButton}
                                        onClick={() => add(item.listing.id.uuid)}
                                        />
                                    </div>                      
                                 </div>


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
                     {
                       shippingItem ?
                       <p className={css.infoTextTotal}>Before delivery cost participation</p>
                       :
                       null
                     }                       
   

                     <br/>
                     {
                     isBelowMininumAmount ?
                     <p className={css.infoText}>* The minimum order amount is €{minOrderAmount}</p>
                    :
                    null
                    }

                    {
                      notLoggedInWarning ?
                      
                      <>
                      <p className={css.notLoggedInText1}>You need to <a href='/login'>log in</a> to proceed to checkout</p>
                      <p className={css.notLoggedInText2}>You don't have an account ? Create one in <a href='/signup'>here</a></p>
                      </>
                      :
                      null
                    }

                     <Button type='button' disabled={isBelowMininumAmount} onClick={toCheckout}><FormattedMessage id="ShoppingCart.checkout" /></Button>  
                
                </div>  
                }
            </Modal>
      </>
  )
}

ShoppingCartComponent.defaultProps = {
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


