import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../../../components';
import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import { pushToPath } from '../../../util/urlHelpers';
import { formatMoney } from '../../../util/currency';
import css from './TopbarDesktop.module.css';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { types as sdkTypes } from '../../../util/sdkLoader';
import config from '../../../config';


const sharetribeSdk = require('sharetribe-flex-sdk');
const sdk = sharetribeSdk.createInstance({
  clientId: process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID
});

const { Money } = sdkTypes;
function ShoppingCart(props) {

    const { mobile, intl } = props;
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
                     <Button><FormattedMessage id="ShoppingCart.checkout" /></Button>  
                
                </div>  
                }
            </Modal>
      </>
  )
}

export default ShoppingCart


