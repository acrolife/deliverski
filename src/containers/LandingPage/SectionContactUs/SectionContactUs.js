import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage } from '../../../util/reactIntl';

import { NamedLink } from '../../../components';

import css from './SectionContactUs.module.css';

const SectionContactUs = props => {
  const { rootClassName, className, isLoggedIn } = props;
console.log("isLoggedIn", isLoggedIn)
  const classes = classNames(rootClassName || css.root, className);
  return (
    <div className={classes}>
      <div className={css.title}>
        <FormattedMessage id="SectionContactUs.titleLineOne" />
      </div>

      <div className={css.steps}>
        <div className={css.stepContact}>
          <h2 className={css.stepTitle}>
            <FormattedMessage id="SectionContactUs.part1Title" />
          </h2>
          <p className={css.textContact}>
            <FormattedMessage id="SectionContactUs.part1Text" />
          </p>
          {isLoggedIn && 
          <p>
             <FormattedMessage id="SectionContactUs.emailCustomer" />
          </p>}
        </div>

        <div className={css.stepContact}>
          <h2 className={css.stepTitle}>
            <FormattedMessage id="SectionContactUs.part2Title" />
          </h2>
          <p className={css.textContact}>
            <FormattedMessage id="SectionContactUs.part2Text" />
          </p>
          {isLoggedIn && 
          <p>
             <FormattedMessage id="SectionContactUs.emailProvider" />
          </p>}          
        </div>

        <div className={css.stepContact}>
          <h2 className={css.stepTitle}>
            <FormattedMessage id="SectionContactUs.part3Title" />
          </h2>
          <p className={css.textContact}>
            <FormattedMessage id="SectionContactUs.part3Text" />
          </p>
          {isLoggedIn && 
          <p>
             <FormattedMessage id="SectionContactUs.emailCourier" />
          </p>}           
        </div>
      </div>

      {!isLoggedIn && <div className={css.createListingLink}>
        <NamedLink name="LoginPage" className={css.loginLink}>
          <FormattedMessage id="SectionContactUs.contact" />
        </NamedLink>
      </div>}

    </div>
  );
};

SectionContactUs.defaultProps = { rootClassName: null, className: null };

const { string, bool } = PropTypes;

SectionContactUs.propTypes = {
  rootClassName: string,
  className: string,
  isLoggedIn: bool
};

export default SectionContactUs;
