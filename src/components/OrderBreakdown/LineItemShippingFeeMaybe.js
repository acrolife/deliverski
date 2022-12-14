import React from 'react';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import { formatMoney } from '../../util/currency';
import { LINE_ITEM_SHIPPING_FEE, propTypes } from '../../util/types';

import css from './OrderBreakdown.module.css';

const LineItemShippingFeeMaybe = props => {
  const { intl, userRole } = props;

  const isProvider = userRole === 'provider';

  const lineItems = isProvider
    ? props.lineItems.filter(l => {
        return l.includeFor.includes('provider');
      })
    : props.lineItems;

  const shippingFeeLineItem = lineItems.find(
    item => item.code === LINE_ITEM_SHIPPING_FEE && !item.reversal
  );

  return shippingFeeLineItem ? (
    <div className={css.lineItem}>
      <span className={css.itemLabel}>
        <FormattedMessage id="OrderBreakdown.shippingFee" />
      </span>
      <span className={css.itemValue}>{formatMoney(intl, shippingFeeLineItem.lineTotal)}</span>
    </div>
  ) : null;
};

LineItemShippingFeeMaybe.propTypes = {
  lineItems: propTypes.lineItems.isRequired,
  intl: intlShape.isRequired,
};

export default LineItemShippingFeeMaybe;
