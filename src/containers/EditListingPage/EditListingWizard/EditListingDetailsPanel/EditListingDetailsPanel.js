import { React, useState, useEffect } from 'react';
import { bool, func, object, string } from 'prop-types';
import classNames from 'classnames';

import { getValuesFromQueryString } from '../../../../util/urlHelpers';

// Import configs and util modules
import { FormattedMessage } from '../../../../util/reactIntl';
import { ensureOwnListing } from '../../../../util/data';
import { LISTING_STATE_DRAFT } from '../../../../util/types';

// Import shared components
import { ListingLink } from '../../../../components';

// Import modules from this directory
import EditListingDetailsForm from './EditListingDetailsForm';
import css from './EditListingDetailsPanel.module.css';

const sharetribeSdk = require('sharetribe-flex-sdk');
const sdk = sharetribeSdk.createInstance({
  clientId: process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID
});

const EditListingDetailsPanel = props => {


//const EditListingDescriptionPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const [host, setHost] = useState(false);

  useEffect(() => {
    sdk.currentUser.show().then(res => {
      if(res.data.data){
        setHost(res.data.data)
      }
    }).catch(e => {
      console.log(e)
    })
  }, [])
 
  const currentListing = ensureOwnListing(listing);

  const queryStringValues = getValuesFromQueryString();

  const isProduct = queryStringValues.isProductForSale === 'true' || currentListing?.attributes?.publicData?.isProductForSale === 'true';
  const isProductForSale = isProduct ? {isProductForSale: 'true'} : {isProductForSale: 'false'};


  const classes = classNames(rootClassName || css.root, className);
  const { description, title, publicData } = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingDetailsPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingDetailsPanel.createListingTitle" />
  );

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingDetailsForm
        className={css.form}
        initialValues={{
          title,
          description,
          category: publicData.category,
          size: publicData.size,
          brand: publicData.brand,
        }}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const { title, description, category, size, brand } = values;
          //const updateValues = {
          //  title: title.trim(),
          //  description,
          //  publicData: { category, size, brand },
          //const { title, description } = values;

          const hostIdObj = host ? {
            hostId: host.id.uuid
          } : {};

          const updateValues = {
            title: title.trim(),
            description,
            publicData: {
              category, size, brand,
              ...isProductForSale,
              ...hostIdObj
            }
          };

          onSubmit(updateValues);
        }}
        onChange={onChange}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
        autoFocus
      />
    </div>
  );
};

EditListingDetailsPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  listing: null,
};

EditListingDetailsPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};
//}
export default EditListingDetailsPanel;
