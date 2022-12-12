import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage } from '../../util/reactIntl';
import { NamedLink, LayoutWrapperMain } from '../../components';

import css from './NotFoundComponent.module.css';
import LogoImage from '../../assets/logos/marmott-logo-sansfond.png';

// Related the the geolocalion search feature
// import config from '../../config';
// import routeConfiguration from '../../routing/routeConfiguration';
// import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
// import { createResourceLocatorString } from '../../util/routes';
// import LocationSearchForm from './LocationSearchForm/LocationSearchForm';
// import TopbarSearchForm from './TopbarSearchForm/TopbarSearchForm';
// TODO if implement this serachbar, should reuse same component, not duplicate

const NotFoundComponent = props => {
  const { rootClassName, className } = props;
  const classes = classNames(rootClassName || css.root, className);

  const handleSearchSubmit = values => {
    const { search, selectedPlace } = values.location;
    const { origin, bounds } = selectedPlace;
    const searchParams = { address: search, origin, bounds };
    /*history.push(
            createResourceLocatorString('SearchPage', routeConfiguration(), {}, searchParams)
        );*/
  };

  // const initialSearchFormValues = []
  // const appConfig = config

  // prettier-ignore
  return (
        <div className={classes}>
            <LayoutWrapperMain>
                <div className={css.root}>
                    <div className={css.content}>
                        <div className={css.imgCenterParent}>
                            <img src={LogoImage} width="100%"
                            /></div>
                        <div className={css.number}>404</div>
                        <h1 className={css.heading}>
                            <FormattedMessage id="NotFoundComponent.heading" />
                        </h1>
                        <p className={css.description}>
                            <FormattedMessage id="NotFoundComponent.description" />
                        </p>
                        <div className={css.searchCenterParent}>
                            <NamedLink name="SearchPage" className={css.searchButton}>
                                <FormattedMessage id="NotFoundComponent.searchButton" />
                            </NamedLink>
                        </div>

                        {/* <LocationSearchForm className={css.searchForm} onSubmit={handleSearchSubmit} /> */}
                        {/* Trying to implement meal search here => will go for a shortcut riht now, MVP
                        <TopbarSearchForm
                        className={css.searchForm}
                        desktopInputRoot={css.topbarSearchWithLeftPadding}
                        onSubmit={handleSearchSubmit}
                        initialValues={initialSearchFormValues}
                        appConfig={appConfig}
                        /> */}
                    </div>
                </div>
            </LayoutWrapperMain>
        </div>
    );
};

NotFoundComponent.defaultProps = {
  rootClassName: null,
  className: null,
};

const { string } = PropTypes;

NotFoundComponent.propTypes = {
  rootClassName: string,
  className: string,
};

export default NotFoundComponent;
