import React, { useState } from 'react';
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
import { Button, FieldCheckboxGroup, FieldSelect, Form, Accordion, IconPlus } from '../../../../components';

// Import modules from this directory
import CustomFieldEnum from '../CustomFieldEnum';
import css from './EditListingFeaturesForm.module.css';
import { red } from '@mui/material/colors';
import { color } from '@mui/system';

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

      // Get productType value to condition the rendering and required property of some select sections
      const { initialValues } = props
      const productType = initialValues?.productType

      const productTypeVisibiliy = {
        foodType: productType === 'eatable',
        drinkType: productType === 'drinkable',
        cuisine: productType !== 'drinkable',
        // mealType:  productType !== 'eatable',
        diet: true,
        size: true,
        dietAccordionOpenAtLoading: productType === 'drinkable',
      }
      const productTypeExcludeKeys = {
        foodType: {
          drinkable: ['halal']
        }
      }

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

      const AccordionHead = (props) => {
        const {
          accordionLabel, isSingleFilter, accordionIsOpen, accordionIsOpenToggle, customMessageSubKey
        } = props;

        return (
          <div className={css.filterHeaderAccordion}>
            <button className={css.labelButtonAccordion} onClick={accordionIsOpenToggle}>
              <span className={css.labelButtonContentAccordion}>
                <span className={css.labelWrapperAccordion}>
                  <span className={css.labelAccordion}>
                    {/* <span className={css.preLabelAccordion} >
                      <FormattedMessage id="EditListingFeaturesForm.preLabel" />
                    </span> */}
                    <span className={css.labelSelectedAccordion}>{accordionLabel}</span>
                  </span>
                </span>
                <span className={css.openSignAccordion}>
                  <IconPlus isOpen={accordionIsOpen} />
                </span>
              </span>
            </button>
            {accordionIsOpen && <span className={css.postLabelAccordion}>
              {
                customMessageSubKey ?
                  <FormattedMessage id={`EditListingFeaturesForm.${customMessageSubKey}`} /> :
                  (isSingleFilter ?
                    <FormattedMessage id="EditListingFeaturesForm.chooseOneValue" /> :
                    <FormattedMessage id="EditListingFeaturesForm.chooseAtLeastOneValue" />)

              }

            </span>}
          </div>
        )
      }

      // Cuisine section
      const cuisineKey = 'cuisine';
      const cuisineOptions = findOptionsForSelectFilter(cuisineKey, filterConfig);
      // const cuisineObject = filterConfig.filter(e => e.id === cuisineKey)
      // const cuisineLabel = cuisineObject.length ? cuisineObject[0].label : null
      const cuisineConfig = findConfigForSelectFilter('cuisine', filterConfig);
      const cuisineSchemaType = cuisineConfig ? cuisineConfig.schemaType : null;
      const cuisineLabel = intl.formatMessage({
        id: 'EditListingFeaturesForm.cuisineLabel',
      });
      const cuisinePlaceholder = intl.formatMessage({
        id: 'EditListingFeaturesForm.cuisinePlaceholder',
      });
      const cuisineRequiredMessage = required(
        intl.formatMessage({
          id: 'EditListingFeaturesForm.cuisineRequired',
        })
      );


      // Meal type section
      const mealTypeKey = 'mealType';
      const mealTypeOptions = findOptionsForSelectFilter(mealTypeKey, filterConfig);
      // const mealTypeObject = filterConfig.filter(e => e.id === mealTypeKey)
      // const mealTypeLabel = mealTypeObject.length ? mealTypeObject[0].label : null      
      const mealTypeConfig = findConfigForSelectFilter('mealType', filterConfig);
      const mealTypeSchemaType = mealTypeConfig ? mealTypeConfig.schemaType : null;
      const mealTypeLabel = intl.formatMessage({
        id: 'EditListingFeaturesForm.mealTypeLabel',
      });
      const mealTypePlaceholder = intl.formatMessage({
        id: 'EditListingFeaturesForm.mealTypePlaceholder',
      });
      const mealTypeRequiredMessage = required(
        intl.formatMessage({
          id: 'EditListingFeaturesForm.mealTypeRequired',
        })
      );

      // Food type section
      const foodTypeKey = 'foodType';
      const foodTypeOptions = findOptionsForSelectFilter(foodTypeKey, filterConfig);
      // const foodTypeObject = filterConfig.filter(e => e.id === foodTypeKey)
      // const foodTypeLabel = foodTypeObject.length ? foodTypeObject[0].label : null      
      const foodTypeConfig = findConfigForSelectFilter('foodType', filterConfig);
      const foodTypeSchemaType = foodTypeConfig ? foodTypeConfig.schemaType : null;
      const foodTypeLabel = intl.formatMessage({
        id: 'EditListingFeaturesForm.foodTypeLabel',
      });
      const foodTypePlaceholder = intl.formatMessage({
        id: 'EditListingFeaturesForm.foodTypePlaceholder',
      });
      const foodTypeRequiredMessage = required(
        intl.formatMessage({
          id: 'EditListingFeaturesForm.foodTypeRequired',
        })
      );

      // DrinkType section
      const drinkTypeKey = 'drinkType';
      const drinkTypeOptions = findOptionsForSelectFilter(drinkTypeKey, filterConfig);
      // const drinkTypeObject = filterConfig.filter(e => e.id === drinkTypeKey)
      // const drinkTypeLabel = drinkTypeObject.length ? drinkTypeObject[0].label : null      
      const drinkTypeConfig = findConfigForSelectFilter('drinkType', filterConfig);
      const drinkTypeSchemaType = drinkTypeConfig ? drinkTypeConfig.schemaType : null;
      const drinkTypeLabel = intl.formatMessage({
        id: 'EditListingFeaturesForm.drinkTypeLabel',
      });
      const drinkTypePlaceholder = intl.formatMessage({
        id: 'EditListingFeaturesForm.drinkTypePlaceholder',
      });
      const drinkTypeRequiredMessage = required(
        intl.formatMessage({
          id: 'EditListingFeaturesForm.drinkTypeRequired',
        })
      );

      // Diet section
      const dietKey = 'diet';
      let dietOptions = findOptionsForSelectFilter(dietKey, filterConfig);
      // const dietObject = filterConfig.filter(e => e.id === dietKey)
      // const dietLabel = dietObject.length ? dietObject[0].label : null      
      const dietConfig = findConfigForSelectFilter('diet', filterConfig);
      const dietschemaType = dietConfig ? dietConfig.schemaType : null;
      const diet = dietConfig && dietConfig.options ? dietConfig.options : [];
      const dietLabel = intl.formatMessage({
        id: 'EditListingFeaturesForm.dietLabel',
      });
      const dietPlaceholder = intl.formatMessage({
        id: 'EditListingFeaturesForm.dietPlaceholder',
      });
      const dietRequiredMessage = required(
        intl.formatMessage({
          id: 'EditListingFeaturesForm.dietRequired',
        })
      );

      // Exclude options, keys and labels in function of productType
      // TODO could build a filter named "excluded" and place there all keys we want to exclude, 
      // build one array and jsut make the test on each option array for each attribute-category
      if (productType === 'drinkable' && productTypeExcludeKeys?.foodType?.drinkable) {
        dietOptions = dietOptions.filter(e => !productTypeExcludeKeys.foodType.drinkable.includes(e.key))
      }

      // Allergen section
      /*
      const allergenKey = 'allergen';
      const allergenOptions = findOptionsForSelectFilter(allergenKey, filterConfig);
      // const allergenObject = filterConfig.filter(e => e.id === allergenKey)
      // const allergenLabel = allergenObject.length ? allergenObject[0].label : null      
      const allergenConfig = findConfigForSelectFilter('allergen', filterConfig);
      const allergenschemaType = allergenConfig ? allergenConfig.schemaType : null;
      const allergen = allergenConfig && allergenConfig.options ? allergenConfig.options : [];
      const allergenLabel = intl.formatMessage({
        id: 'EditListingFeaturesForm.allergenLabel',
      });
      const allergenPlaceholder = intl.formatMessage({
        id: 'EditListingFeaturesForm.allergenPlaceholder',
      });
      const allergenRequiredMessage = required(
        intl.formatMessage({
          id: 'EditListingFeaturesForm.allergenRequired',
        })
      );
      */

      // Size section
      const sizeKey = 'size';
      const sizeOptions = findOptionsForSelectFilter(sizeKey, filterConfig);
      // const sizeObject = filterConfig.filter(e => e.id === sizeKey)
      // const sizeLabel = sizeObject.length ? sizeObject[0].label : null      
      const sizeConfig = findConfigForSelectFilter('size', filterConfig);
      const sizeSchemaType = sizeConfig ? sizeConfig.schemaType : null;
      const sizeLabel = intl.formatMessage({
        id: 'EditListingFeaturesForm.sizeLabel',
      });
      const sizePlaceholder = intl.formatMessage({
        id: 'EditListingFeaturesForm.sizePlaceholder',
      });
      const sizeRequiredMessage = required(
        intl.formatMessage({
          id: 'EditListingFeaturesForm.sizeRequired',
        })
      );


      // Accordions and display single or multi filter message
      // cuisine (this first accordion is opened)
      /*
      const [accordionCuisineIsOpen, setAccordionCuisineIsOpen] = useState(true);;
      const accordionCuisineIsOpenToggle = () => {
        setAccordionCuisineIsOpen(!accordionCuisineIsOpen)
      }
      const cuisineIsSingleFilter = true
      */

      // mealType
      /*
      const [accordionMealTypeIsOpen, setAccordionMealTypeIsOpen] = useState(false);;
      const accordionMealTypeIsOpenToggle = () => {
        setAccordionMealTypeIsOpen(!accordionMealTypeIsOpen)
      }
      const mealTypeIsSingleFilter = true
      */

      // foodType
      /*
      const [accordionfoodTypeIsOpen, setAccordionfoodTypeIsOpen] = useState(false);;
      const accordionfoodTypeIsOpenToggle = () => {
        setAccordionfoodTypeIsOpen(!accordionfoodTypeIsOpen)
      }
      const foodTypeIsSingleFilter = true
      */

      // drinkType
      const [accordionDrinkTypeIsOpen, setAccordionDrinkTypeIsOpen] = useState(true);;
      const accordionDrinkTypeIsOpenToggle = () => {
        setAccordionDrinkTypeIsOpen(!accordionDrinkTypeIsOpen)
      }
      const drinkTypeIsSingleFilter = false
      const drinkTypeCustomMessageSubKey = "drinkTypePlaceholder"


      // diet (this first accordion is opened)
      const [accordionDietIsOpen, setAccordionDietIsOpen] = useState(productTypeVisibiliy.dietAccordionOpenAtLoading);
      const accordionDietIsOpenToggle = () => {
        setAccordionDietIsOpen(!accordionDietIsOpen)
      }
      const dietIsSingleFilter = false
      const dietCustomMessageSubKey = "dietPlaceholder"

      // allergen
      /*
      const [accordionAllergenIsOpen, setAccordionAllergenIsOpen] = useState(false);;
      const accordionAllergenIsOpenToggle = () => {
        setAccordionAllergenIsOpen(!accordionAllergenIsOpen)
      }
      const allergenIsSingleFilter = false
      const allergenCustomMessageSubKey = "allergenPlaceholder"
      */

      // size
      const [accordionSizeIsOpen, setAccordionSizeIsOpen] = useState(false);;
      const accordionSizeIsOpenToggle = () => {
        setAccordionSizeIsOpen(!accordionSizeIsOpen)
      }
      const sizeIsSingleFilter = false
      const sizeCustomMessageSubKey = "sizePlaceholder"

      /*
      // TODO if want to change the select color to marketplace color, just use the CustomFieldEnum css file
      const element = document.getElementById("cuisine");
      // console.log(element.style)
      // element.style.color = "red";
      // style={divStyle}
      // let divStyle = {
      //   background: 'red !important'
      // }
      */

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessage}
          {errorMessageShowListing}

          <div className={css.featuresWrapper}>

            {/* # foodType ------------------------------------------------------ # */}
            {
              productTypeVisibiliy.foodType && <CustomFieldEnum
                id="foodType"
                name="foodType"
                options={foodTypeOptions}
                label={foodTypeLabel}
                placeholder={foodTypePlaceholder}
                validate={foodTypeRequiredMessage}
                schemaType={foodTypeSchemaType}
              />
            }


            {/* <AccordionHead
              accordionLabel={foodTypeLabel}
              isSingleFilter={foodTypeIsSingleFilter}
              accordionIsOpen={accordionfoodTypeIsOpen}
              accordionIsOpenToggle={accordionfoodTypeIsOpenToggle}
            />
            {accordionfoodTypeIsOpen &&
              <FieldCheckboxGroup
                className={css.featuresItems}
                id={foodTypeKey}
                name={foodTypeKey}
                options={foodTypeOptions}
                validate={foodTypeRequiredMessage}
              />} */}

            {/* # drinkType ------------------------------------------------------ # */}
            {
              productTypeVisibiliy.drinkType && <CustomFieldEnum
                id="drinkType"
                name="drinkType"
                options={drinkTypeOptions}
                label={drinkTypeLabel}
                placeholder={drinkTypePlaceholder}
                validate={drinkTypeRequiredMessage}
                schemaType={drinkTypeSchemaType}
              />
            }

            {/* # cuisine ------------------------------------------------------ # */}
            {
              productTypeVisibiliy.cuisine && <CustomFieldEnum
                id="cuisine"
                name="cuisine"
                options={cuisineOptions}
                label={cuisineLabel}
                placeholder={cuisinePlaceholder}
                validate={cuisineRequiredMessage}
                schemaType={cuisineSchemaType}
              />
            }

            {/* <AccordionHead
              accordionLabel={cuisineLabel}
              isSingleFilter={cuisineIsSingleFilter}
              accordionIsOpen={accordionCuisineIsOpen}
              accordionIsOpenToggle={accordionCuisineIsOpenToggle}
            />
            {accordionCuisineIsOpen &&
              <FieldCheckboxGroup
                className={css.featuresItems}
                id={cuisineKey}
                name={cuisineKey}
                options={cuisineOptions}
                validate={cuisineRequiredMessage}
            />} */}

            {/* # mealType ------------------------------------------------------ # */}
            {/* <CustomFieldEnum
              id="mealType"
              name="mealType"
              options={mealTypeOptions}
              label={mealTypeLabel}
              placeholder={mealTypePlaceholder}
              validate={mealTypeRequiredMessage}
              schemaType={mealTypeSchemaType}
            /> */}

            {/* <AccordionHead
              accordionLabel={mealTypeLabel}
              isSingleFilter={mealTypeIsSingleFilter}
              accordionIsOpen={accordionMealTypeIsOpen}
              accordionIsOpenToggle={accordionMealTypeIsOpenToggle}
            />
            {accordionMealTypeIsOpen &&
              <FieldCheckboxGroup
                className={css.featuresItems}
                id={mealTypeKey}
                name={mealTypeKey}
                options={mealTypeOptions}
                validate={mealTypeRequiredMessage}
              />} */}

            {/* # diet ------------------------------------------------------ # */}
            {
              productTypeVisibiliy.diet && <AccordionHead
                accordionLabel={dietLabel}
                isSingleFilter={dietIsSingleFilter}
                accordionIsOpen={accordionDietIsOpen}
                accordionIsOpenToggle={accordionDietIsOpenToggle}
                customMessageSubKey={dietCustomMessageSubKey}
              />
            }
            {productTypeVisibiliy.diet && accordionDietIsOpen &&
              <FieldCheckboxGroup
                className={css.featuresItems}
                id={dietKey}
                name={dietKey}
                options={dietOptions}
              // validate={sizeRequiredMessage}
              />
            }

            {/* # allergen ------------------------------------------------------ # */}
            {/* <AccordionHead
              accordionLabel={allergenLabel}
              isSingleFilter={allergenIsSingleFilter}
              accordionIsOpen={accordionAllergenIsOpen}
              accordionIsOpenToggle={accordionAllergenIsOpenToggle}
              customMessageSubKey={allergenCustomMessageSubKey}
            />
            {accordionAllergenIsOpen &&
              <FieldCheckboxGroup
                className={css.featuresItems}
                id={allergenKey}
                name={allergenKey}
                options={allergenOptions}
              // validate={allergenRequiredMessage}
              />} */}

            {/* # size ------------------------------------------------------ # */}
            {/* {
              productTypeVisibiliy.size && <CustomFieldEnum
                id="size"
                name="size"
                options={sizeOptions}
                label={sizeLabel}
                placeholder={sizePlaceholder}
                validate={sizeRequiredMessage}
                schemaType={sizeSchemaType}
              />
            } */}

            {productTypeVisibiliy.size && <AccordionHead
              accordionLabel={sizeLabel}
              isSingleFilter={sizeIsSingleFilter}
              accordionIsOpen={accordionSizeIsOpen}
              accordionIsOpenToggle={accordionSizeIsOpenToggle}
              customMessageSubKey={sizeCustomMessageSubKey}
            />}
            {productTypeVisibiliy.size && accordionSizeIsOpen &&
              <FieldCheckboxGroup
                className={css.featuresItems}
                id={sizeKey}
                name={sizeKey}
                options={sizeOptions}
              // validate={sizeRequiredMessage}
              />}

          </div>

          {/* TODO https://flaviocopes.com/react-how-to-loop/ */}
          {/* (<FieldCheckboxGroup label={itemLabel} className={css.featuresItems} id={itemKey} name={itemKey} options={itemOptions} /> */}

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
