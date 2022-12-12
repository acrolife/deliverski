import React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from '../../../util/reactIntl';
import { FieldSelect, FieldTextInput } from '../../../components';

const preparationTimeOptions = [null, 10, 20, 30, 45];
const mealIsReadyTimeOptions = [null, 10, 15, 20];
const deliveryTimeOptions = [null, 10, 20, 30, 40, 50, 60];

const DelayTimes = props => {
  const { intl, css } = props;
  const t = intl.formatMessage;

  return (
    <div className={classNames(css.sectionContainer, css.lastSection)}>
      <h3 className={css.sectionTitle}>
        <FormattedMessage id="ProfileSettingsForm.timesTitle" />
      </h3>

      <FieldSelect
        className={css.selectField}
        id="preparationTime"
        name="preparationTime"
        label={t({ id: 'ProfileSettingsForm.preparationTime' })}
      >
        {preparationTimeOptions.map(o => (
          <option value={o} key={o}>
            {o}
          </option>
        ))}
      </FieldSelect>

      <FieldSelect
        className={css.selectField}
        id="mealIsReadyTime"
        name="mealIsReadyTime"
        label={t({ id: 'ProfileSettingsForm.mealIsReadyTime' })}
      >
        {mealIsReadyTimeOptions.map(o => (
          <option value={o} key={o}>
            {o}
          </option>
        ))}
      </FieldSelect>

      <FieldSelect
        className={css.selectField}
        id="deliveryTime"
        name="deliveryTime"
        label={t({ id: 'ProfileSettingsForm.deliveryTime' })}
      >
        {deliveryTimeOptions.map(o => (
          <option value={o} key={o}>
            {o}
          </option>
        ))}
      </FieldSelect>

      <FieldTextInput
        className={css.selectField}
        id="deliveryFromAddress"
        name="deliveryFromAddress"
        label={t({ id: 'ProfileSettingsForm.deliveryFromAddress' })}
      />
    </div>
  );
};

export default DelayTimes;
