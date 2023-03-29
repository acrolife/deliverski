import React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from '../../../util/reactIntl';
import { FieldSelect } from '../../../components';

const preparationTimeOptions = [10, 20, 30, 45];
const mealIsReadyTimeOptions = [5, 10, 15, 20];
const deliveryTimeOptions = [10, 20, 30];

const DelayTimes = props => {
  const { intl, css } = props;
  const t = intl.formatMessage;

  return (
    <div className={css.sectionContainer}>
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
    </div>
  );
};

export default DelayTimes;
