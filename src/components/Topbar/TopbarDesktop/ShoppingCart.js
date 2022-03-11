import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../../../components';
import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import { pushToPath } from '../../../util/urlHelpers';
import css from './TopbarDesktop.module.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const sharetribeSdk = require('sharetribe-flex-sdk');
const sdk = sharetribeSdk.createInstance({
  clientId: process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID
});

function ShoppingCart(props) {

    const { mobile } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [shoppingCartItems, setShoppingCartItems] = useState([]);

    useEffect(() => {
        sdk.currentUser.show().then(res => {
            const shoppingCart = res.data.data.attributes.publicData.shoppingCart;
            if(shoppingCart && shoppingCart?.length > 0){
                setShoppingCartItems(shoppingCart)
            }
          }).catch(e => console.log(e))
    },[isOpen]) 


  return (
      <>
      <div className={css.shoppingCartWrapper} onClick={() => setIsOpen(true)}>
             {
                mobile ? 
                <span className={css.mobileLabel}>
                    <FormattedMessage id="ShoppingCart.mobileLabel" />
                </span> 
                : <ShoppingCartIcon className={css.cartIcon}/>
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
                </>  : null  
                }
            </Modal>
      </>
  )
}

export default ShoppingCart