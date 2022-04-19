import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import classNames from 'classnames';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

// Import configs and util modules
import config from '../../../../config';
import { intlShape, injectIntl, FormattedMessage } from '../../../../util/reactIntl';
import { findOptionsForSelectFilter, findConfigForSelectFilter } from '../../../../util/search';
import { maxLength, required, composeValidators } from '../../../../util/validators';
import { propTypes } from '../../../../util/types';

// Import shared components
import { Button, FieldCheckboxGroup, FieldSelect, Form } from '../../../../components';

// Import modules from this directory
import CustomFieldEnum from '../CustomFieldEnum';
import css from './EditListingFeaturesForm.module.css';

const EditListingFeaturesFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        disabled,
        ready,
        rootClassName,
        className,
        name,
        handleSubmit,
        intl,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        filterConfig,
      } = formRenderProps;

      const classes = classNames(rootClassName || css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = disabled || submitInProgress;

      const { updateListingError, showListingsError } = fetchErrors || {};
      const errorMessage = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingFeaturesForm.updateFailed" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingFeaturesForm.showListingFailed" />
        </p>
      ) : null;

      // Size section
      const sizesKey = 'sizes';
      const sizesOptions = findOptionsForSelectFilter(sizesKey, filterConfig);
      const sizesObject = filterConfig.filter(e => e.id === sizesKey)
      const sizesLabel = sizesObject.length ? sizesObject[0].label : null
      /*
      const sizeConfig = findConfigForSelectFilter('size', filterConfig);
      const sizeSchemaType = sizeConfig ? sizeConfig.schemaType : null;
      const sizes = sizeConfig && sizeConfig.options ? sizeConfig.options : [];
      const sizeLabel = intl.formatMessage({
        id: 'EditListingDetailsForm.sizeLabel',
      });
      const sizePlaceholder = intl.formatMessage({
        id: 'EditListingDetailsForm.sizePlaceholder',
      });

      const sizeRequired = required(
        intl.formatMessage({
          id: 'EditListingDetailsForm.sizeRequired',
        })
      );
      */

      // Cuisine section
      const cuisineKey = 'cuisine';
      const cuisineOptions = findOptionsForSelectFilter(cuisineKey, filterConfig);
      const cuisineObject = filterConfig.filter(e => e.id === cuisineKey)
      const cuisineLabel = cuisineObject.length ? cuisineObject[0].label : null
      /*
      const cuisineConfig = findConfigForSelectFilter('cuisine', filterConfig);
      const cuisineSchemaType = cuisineConfig ? cuisineConfig.schemaType : null;
      const cuisines = cuisineConfig && cuisineConfig.options ? cuisineConfig.options : [];
      const cuisineLabel = intl.formatMessage({
        id: 'EditListingDetailsForm.cuisineLabel',
      });
      const cuisinePlaceholder = intl.formatMessage({
        id: 'EditListingDetailsForm.cuisinePlaceholder',
      });

      const cuisineRequired = required(
        intl.formatMessage({
          id: 'EditListingDetailsForm.cuisineRequired',
        })
      );
      */


      // Meal type section
      const mealTypeKey = 'mealType';
      const mealTypeOptions = findOptionsForSelectFilter(mealTypeKey, filterConfig);
      const mealTypeObject = filterConfig.filter(e => e.id === mealTypeKey)
      const mealTypeLabel = mealTypeObject.length ? mealTypeObject[0].label : null
      /*
      const mealTypeConfig = findConfigForSelectFilter('mealType', filterConfig);
      const mealTypeSchemaType = mealTypeConfig ? mealTypeConfig.schemaType : null;
      const mealTypes = mealTypeConfig && mealTypeConfig.options ? mealTypeConfig.options : [];
      const mealTypeLabel = intl.formatMessage({
        id: 'EditListingDetailsForm.mealTypeLabel',
      });
      const mealTypePlaceholder = intl.formatMessage({
        id: 'EditListingDetailsForm.mealTypePlaceholder',
      });
      */
     // FIXME Write translations for mealType, foodType, cuisine
      const mealTypeRequired = required(
        intl.formatMessage({
          id: 'EditListingDetailsForm.productTypeRequired',
        })
      );


      // Food type section
      const foodTypeKey = 'foodType';
      const foodTypeOptions = findOptionsForSelectFilter(foodTypeKey, filterConfig);
      const foodTypeObject = filterConfig.filter(e => e.id === foodTypeKey)
      const foodTypeLabel = foodTypeObject.length ? foodTypeObject[0].label : null
      /*
      const foodTypeConfig = findConfigForSelectFilter('foodType', filterConfig);
      const foodTypeSchemaType = foodTypeConfig ? foodTypeConfig.schemaType : null;
      const foodTypes = foodTypeConfig && foodTypeConfig.options ? foodTypeConfig.options : [];
      const foodTypeLabel = intl.formatMessage({
        id: 'EditListingDetailsForm.foodTypeLabel',
      });
      const foodTypePlaceholder = intl.formatMessage({
        id: 'EditListingDetailsForm.foodTypePlaceholder',
      });

      const foodTypeRequired = required(
        intl.formatMessage({
          id: 'EditListingDetailsForm.foodTypeRequired',
        })
      );
      */

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessage}
          {errorMessageShowListing}

          <div className={css.featuresWrapper}>

            {/* <CustomFieldEnum
              id="category"
              name="category"
              options={categories}
              label={categoryLabel}
              placeholder={categoryPlaceholder}
              validate={categoryRequired}
              schemaType={categorySchemaType}
            /> */}

            {/* TODO https://flaviocopes.com/react-how-to-loop/ */}
            {/* (<FieldCheckboxGroup label={itemLabel} className={css.featuresItems} id={itemKey} name={itemKey} options={itemOptions} /> */}

            <FieldCheckboxGroup label={mealTypeLabel} className={css.featuresItems} id={mealTypeKey} name={mealTypeKey} options={mealTypeOptions}  validate={mealTypeRequired} />

            <FieldCheckboxGroup label={cuisineLabel} className={css.featuresItems} id={cuisineKey} name={cuisineKey} options={cuisineOptions} validate={mealTypeRequired}/>
            
            <FieldCheckboxGroup label={foodTypeLabel} className={css.featuresItems} id={foodTypeKey} name={foodTypeKey} options={foodTypeOptions} validate={mealTypeRequired}/>

            <FieldCheckboxGroup label={sizesLabel} className={css.featuresItems} id={sizesKey} name={sizesKey} options={sizesOptions} />

          </div>

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

EditListingFeaturesFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  fetchErrors: null,
  filterConfig: config.custom.filters,
};

EditListingFeaturesFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  intl: intlShape.isRequired,
  name: string.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  filterConfig: propTypes.filterConfig,
};

const EditListingFeaturesForm = EditListingFeaturesFormComponent;

export default compose(injectIntl)(EditListingFeaturesForm);
