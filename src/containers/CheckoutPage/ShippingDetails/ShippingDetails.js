import React from 'react';
import { bool, object, string } from 'prop-types';
import classNames from 'classnames';
// import mapValues from 'lodash/mapValues';
// import config from '../../../config';
import { FormattedMessage, intlShape } from '../../../util/reactIntl';
import * as validators from '../../../util/validators';
// import getCountryCodes from '../../../translations/countryCodes';
import { FieldSelect, FieldTextInput } from '../../../components';

import RecipientPhoneNumber from './RecipientPhoneNumber';
import css from './ShippingDetails.module.css';

// Import static data
import resortsData from '../../../assets/data/resorts';
import residencesData from '../../../assets/data/residences';

const ShippingDetails = props => {
  const { rootClassName, className, intl, disabled, form, fieldId, resortKey } = props;

  const classes = classNames(rootClassName || css.root, className);

  const optionalText = intl.formatMessage({
    id: 'ShippingDetails.optionalText',
  });

  // Use the language set in config.locale to get the correct translations of the country names
  // const countryCodes = getCountryCodes(config.locale);

  // Filter the resort list to display only the one from the resort
  // resortKey froms from the props
  const resortName = resortsData.find(e => e.key == resortKey).name;
  form.change('recipientCity', resortName);

  const residencesFiltered = residencesData
    ? residencesData.find(e => e.resort == resortKey).residences.filter(e => e[2])
    : {};

  return (
    <div className={classes}>
      <h3 className={css.heading}>
        <FormattedMessage id="ShippingDetails.title" />
      </h3>
      <FieldTextInput
        id={`${fieldId}.recipientName`}
        name="recipientName"
        disabled={disabled}
        className={css.fieldFullWidth}
        type="text"
        autoComplete="shipping name"
        label={intl.formatMessage({ id: 'ShippingDetails.recipientNameLabel' })}
        placeholder={intl.formatMessage({
          id: 'ShippingDetails.recipientNamePlaceholder',
        })}
        validate={validators.required(
          intl.formatMessage({ id: 'ShippingDetails.recipientNameRequired' })
        )}
        onUnmount={() => form.change('recipientName', undefined)}
      />
      <RecipientPhoneNumber
        form={form}
        intl={intl}
        fieldId={fieldId}
        disabled={disabled}
        css={css}
      />
      {/* <div className={css.formRow}>
        <FieldTextInput
          id={`${fieldId}.recipientAddressLine1`}
          name="recipientAddressLine1"
          disabled={disabled}
          className={css.field}
          type="text"
          autoComplete="shipping address-line1"
          label={intl.formatMessage({ id: 'ShippingDetails.addressLine1Label' })}
          placeholder={intl.formatMessage({
            id: 'ShippingDetails.addressLine1Placeholder',
          })}
          validate={validators.required(
            intl.formatMessage({ id: 'ShippingDetails.addressLine1Required' })
          )}
          onUnmount={() => form.change('recipientAddressLine1', undefined)}
        />
        <FieldTextInput
          id={`${fieldId}.recipientAddressLine2`}
          name="recipientAddressLine2"
          disabled={disabled}
          className={css.field}
          type="text"
          autoComplete="shipping address-line2"
          label={intl.formatMessage(
            { id: 'ShippingDetails.addressLine2Label' },
            { optionalText: optionalText }
          )}
          placeholder={intl.formatMessage({
            id: 'ShippingDetails.addressLine2Placeholder',
          })}
          validate={validators.required(
            intl.formatMessage({ id: 'ShippingDetails.addressLine2Required' })
          )}
          onUnmount={() => form.change('recipientAddressLine2', undefined)}
        />
      </div>       */}
      <FieldSelect
        id={`${fieldId}.recipientAddressLine1`}
        name="recipientAddressLine1"
        disabled={disabled}
        className={css.fieldFullWidth}
        label={intl.formatMessage({ id: 'ShippingDetails.addressLine1Label' })}
        validate={validators.required(
          intl.formatMessage({ id: 'ShippingDetails.addressLine1Required' })
        )}
      >
        <option disabled value="">
          {intl.formatMessage({ id: 'ShippingDetails.addressLine1Placeholder' })}
        </option>
        {residencesFiltered.map((e, i) => {
          return (
            <option key={i} value={`${e[1]} - Ref #${e[0]} ${resortName}`}>
              {`${e[1]} - Ref #${e[0]} ${resortName}`}
            </option>
          );
        })}
      </FieldSelect>
      <FieldTextInput
        id={`${fieldId}.recipientAddressLine2`}
        name="recipientAddressLine2"
        disabled={disabled}
        className={css.fieldFullWidth}
        type="text"
        autoComplete="shipping address-line2"
        label={intl.formatMessage(
          { id: 'ShippingDetails.addressLine2Label' },
          { optionalText: optionalText }
        )}
        placeholder={intl.formatMessage({
          id: 'ShippingDetails.addressLine2Placeholder',
        })}
        validate={validators.required(
          intl.formatMessage({ id: 'ShippingDetails.addressLine2Required' })
        )}
        onUnmount={() => form.change('recipientAddressLine2', undefined)}
      />
      <div className={css.formRow}>
        <FieldTextInput
          id={`${fieldId}.recipientPostalCode`}
          name="recipientPostal"
          disabled={true}
          className={css.field}
          type="text"
          autoComplete="shipping postal-code"
          label={intl.formatMessage({ id: 'ShippingDetails.postalCodeLabel' })}
          placeholder={intl.formatMessage({
            id: 'ShippingDetails.postalCodePlaceholder',
          })}
          // validate={validators.required(
          //   intl.formatMessage({ id: 'ShippingDetails.postalCodeRequired' })
          // )}
          onUnmount={() => form.change('recipientPostal', undefined)}
        />

        <FieldTextInput
          id={`${fieldId}.recipientCity`}
          name="recipientCity"
          disabled={true}
          className={css.field}
          type="text"
          autoComplete="shipping address-level2"
          label={intl.formatMessage({ id: 'ShippingDetails.cityLabel' })}
          placeholder={intl.formatMessage({ id: 'ShippingDetails.cityPlaceholder' })}
          // validate={validators.required(intl.formatMessage({ id: 'ShippingDetails.cityRequired' }))}
          onUnmount={() => form.change('recipientCity', undefined)}
        />
      </div>
      <div className={css.formRow}>
        <FieldTextInput
          id={`${fieldId}.recipientState`}
          name="recipientState"
          disabled={true}
          className={css.field}
          type="text"
          autoComplete="shipping address-level1"
          label={intl.formatMessage({ id: 'ShippingDetails.stateLabel' })}
          placeholder={intl.formatMessage({ id: 'ShippingDetails.statePlaceholder' })}
          onUnmount={() => form.change('recipientState', undefined)}
        />

        <FieldTextInput
          id={`${fieldId}.recipientCountry`}
          name="recipientCountry"
          disabled={true}
          className={css.field}
          type="text"
          autoComplete="shipping country"
          label={intl.formatMessage({ id: 'ShippingDetails.countryLabel' })}
          placeholder={intl.formatMessage({ id: 'ShippingDetails.countryPlaceholder' })}
          onUnmount={() => form.change('recipientCountry', undefined)}
        />
        {/* <FieldSelect
          id={`${fieldId}.recipientCountry`}
          name="recipientCountry"
          disabled={disabled}
          className={css.field}
          label={intl.formatMessage({ id: 'ShippingDetails.countryLabel' })}
          validate={validators.required(
            intl.formatMessage({ id: 'ShippingDetails.countryRequired' })
          )}
        >
          <option disabled value="">
            {intl.formatMessage({ id: 'ShippingDetails.countryPlaceholder' })}
          </option>
          {countryCodes.map(country => {
            return (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            );
          })}
        </FieldSelect> */}
      </div>
    </div>
  );
};

ShippingDetails.defaultProps = {
  rootClassName: null,
  className: null,
  disabled: false,
  fieldId: null,
  resortKey: null,
};

ShippingDetails.propTypes = {
  rootClassName: string,
  className: string,
  disabled: bool,
  form: object.isRequired,
  fieldId: string,
  resortKey: string,

  // from injectIntl
  intl: intlShape.isRequired,
};

export default ShippingDetails;
