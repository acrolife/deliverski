import React, { useState, useEffect } from 'react';
import { bool, func, object, string } from 'prop-types';
import classNames from 'classnames';

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
      if (res.data.data) {
        setHost(res.data.data)
      }
    }).catch(e => {
      console.log(e)
    })
  }, [])

  const currentListing = ensureOwnListing(listing);
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

  const productType = publicData && publicData.productType;
  const initialValues = {
    title,
    productType,
    description,
  }

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingDetailsForm
        className={css.form}
        initialValues={initialValues}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const { 
            title, 
            description, 
            productType,
          } = values; 
          const hostIdObj = host ? {
            hostId: host.id.uuid
          } : {};

          // CAUTION the data structure should be the right one enum => '', multi-enum => []
          // CHECK src/config/marketplace-custom-config.js
          // Will reinitialize the attributes of featuresData if the productType is modified
          // Avvoid inconsistant data
          let featuresData
          if (initialValues.productType !== productType) {
            featuresData = {
              foodType: '',
              cuisine: '',
              diet: [],
              size: []
            }
          }
          const updateValues = {
            title: title.trim(),
            description, 
            publicData: {
              productType,
              ...featuresData,
              ...hostIdObj
            },
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

export default EditListingDetailsPanel;
