import React from 'react';

import { FormattedMessage } from '../../../util/reactIntl';
import { FieldTextInput } from '../../../components';
import * as validators from '../../../util/validators';

const RecipientPhoneNumber = props => {
  const { css, intl, disabled, form, fieldId } = props;

  /*
  const changePhoneState = (value) => {
    form.change('recipientPhoneNumber', value)
  }
  const recipientPhoneNumberValue = form.getState().values.recipientPhoneNumber
  if (recipientPhoneNumberValue) {
    const testOOIndic = recipientPhoneNumberValue.slice(0, 2) == "00"
    let valueOOIndicReplaced = recipientPhoneNumberValue
    if (testOOIndic) {
      valueOOIndicReplaced = "+" + recipientPhoneNumberValue.slice(2)
      changePhoneState(valueOOIndicReplaced)
    }
  }
  */

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
