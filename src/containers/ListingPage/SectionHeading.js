import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { InlineTextButton } from '../../components';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY } from '../../util/types';
import config from '../../config';

import css from './ListingPage.module.css';

const SectionHeading = props => {
  const {
    priceTitle,
    formattedPrice,
    richTitle,
    category,
    authorLink,
    showContactUser,
    onContactUser,
    restaurantStatus,
  } = props;

  const unitType = config.lineItemUnitType;
  const isNightly = unitType === LINE_ITEM_NIGHT;
  const isDaily = unitType === LINE_ITEM_DAY;

  const unitTranslationKey = isNightly
    ? 'ListingPage.perNight'
    : isDaily
    ? 'ListingPage.perDay'
    : 'ListingPage.perUnit';

  const restaurantDot = (
    <p className={restaurantStatus.status === 'open' ? css.openDot : css.closedDot}>•</p>
  );
  const restaurantScheduleMessageKey = restaurantStatus.message
    ? restaurantStatus.message.key
    : null;
  const restaurantScheduleMessageValues = restaurantStatus.message
    ? restaurantStatus.message.values
    : null;

  return (
    <div className={css.sectionHeading}>
      <div className={css.desktopPriceContainer}>
        <div className={css.desktopPriceValue} title={priceTitle}>
          {formattedPrice}
        </div>
        <div className={css.desktopPerUnit}>
          <FormattedMessage id={unitTranslationKey} />
        </div>
      </div>
      <div className={css.heading}>
        <h1 className={css.title}>
          {richTitle} {restaurantDot}
        </h1>
        <p
          className={
            restaurantStatus.status === 'open'
              ? css.scheduleInfoTextOpen
              : css.scheduleInfoTextClosed
          }
        >
          <FormattedMessage id={restaurantScheduleMessageKey} />
        </p>

        <div className={css.author}>
          {category}
          <FormattedMessage id="ListingPage.soldBy" values={{ name: authorLink }} />
          {showContactUser ? (
            <span className={css.contactWrapper}>
              <span className={css.separator}>•</span>
              <InlineTextButton
                rootClassName={css.contactLink}
                onClick={onContactUser}
                enforcePagePreloadFor="SignupPage"
              >
                <FormattedMessage id="ListingPage.contactUser" />
              </InlineTextButton>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SectionHeading;
