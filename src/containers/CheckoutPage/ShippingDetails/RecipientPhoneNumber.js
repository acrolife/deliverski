import React from 'react';

import { FormattedMessage } from '../../../util/reactIntl';
import { FieldTextInput } from '../../../components';
import * as validators from '../../../util/validators';

const RecipientPhoneNumber = props => {
  const { css, intl, disabled, form, fieldId } = props;
  return (
    <>
      <FieldTextInput
        id={`${fieldId}.recipientPhoneNumber`}
        name="recipientPhoneNumber"
        disabled={disabled}
        className={css.recipientPhoneNumber}
        type="text"
        autoComplete="shipping phoneNumber"
        label={intl.formatMessage({ id: 'ShippingDetails.recipientPhoneNumberLabel' })}
        placeholder={intl.formatMessage({
          id: 'ShippingDetails.recipientPhoneNumberPlaceholder',
        })}
        validate={validators.composeValidators(
          validators.required(
            intl.formatMessage({ id: 'ShippingDetails.recipientPhoneNumberRequired' })
          ),
          validators.validPhoneNumber(
            intl.formatMessage({ id: 'ShippingDetails.recipientPhoneNumberInvalid' }),
            intl.formatMessage({ id: 'ShippingDetails.phoneNumberInternationalInvalid' })
          )
        )}
        onUnmount={() => form.change('recipientPhoneNumber', undefined)}
      />
      <p className={css.recipientPhoneNumberInfo}>
        <FormattedMessage id="ShippingDetails.recipientPhoneNumberInfo" />
      </p>
    </>
  );
};

export default RecipientPhoneNumber;
