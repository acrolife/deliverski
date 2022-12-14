import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage } from '../../../util/reactIntl';

import { NamedLink } from '../../../components';

import css from './SectionHowItWorks.module.css';

const SectionHowItWorks = props => {
  const { rootClassName, className, isLoggedIn } = props;

  const classes = classNames(rootClassName || css.root, className);
  return (
    <div className={classes}>
      <div className={css.title}>
        <FormattedMessage id="SectionHowItWorks.titleLineOne" />
      </div>

      <div className={css.steps}>
        <div className={css.step}>
          <h2 className={css.stepTitle}>
            <FormattedMessage id="SectionHowItWorks.part1Title" />
          </h2>
          <p className={css.textHowItWorks}>
            <FormattedMessage id="SectionHowItWorks.part1Text" />
          </p>
        </div>

        <div className={css.step}>
          <h2 className={css.stepTitle}>
            <FormattedMessage id="SectionHowItWorks.part2Title" />
          </h2>
          <p className={css.textHowItWorks}>
            <FormattedMessage id="SectionHowItWorks.part2Text" />
          </p>
        </div>

        <div className={css.step}>
          <h2 className={css.stepTitle}>
            <FormattedMessage id="SectionHowItWorks.part3Title" />
          </h2>
          <p className={css.textHowItWorks}>
            <FormattedMessage id="SectionHowItWorks.part3Text" />
          </p>
        </div>
      </div>

      {!isLoggedIn && (
        <div className={css.createListingLink}>
          <NamedLink name="LoginPage" className={css.loginLink}>
            <FormattedMessage id="SectionHowItWorks.login" />
          </NamedLink>
        </div>
      )}
    </div>
  );
};

SectionHowItWorks.defaultProps = { rootClassName: null, className: null };

const { string, bool } = PropTypes;

SectionHowItWorks.propTypes = {
  rootClassName: string,
  className: string,
  isLoggedIn: bool,
};

export default SectionHowItWorks;
