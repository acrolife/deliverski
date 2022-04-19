import React, { useState, useEffect } from 'react';
import { any, bool, func, object, number, string } from 'prop-types';
import classNames from 'classnames';
import config from '../../../config';

import { FormattedMessage, intlShape } from '../../../util/reactIntl';
import { ACCOUNT_SETTINGS_PAGES } from '../../../routing/routeConfiguration';
import ShoppingCart from './ShoppingCart';
import { propTypes } from '../../../util/types';
import {
  Avatar,
  InlineTextButton,
  Logo,
  Menu,
  MenuLabel,
  MenuContent,
  MenuItem,
  NamedLink,
  ExternalLink,
} from '../../../components';

import LangIconPng from '../../../assets/icons/lang-icon-en-fr.png'
import TopbarSearchForm from '../TopbarSearchForm/TopbarSearchForm';

import css from './TopbarDesktop.module.css';

// Custom implementation of the langage switcher
const urlSwitchLang = config.urlSwitchLang
const langageSwitch = config.locale === 'en' ? 'Français' : 'English'

const TopbarDesktop = props => {
  const {
    className,
    appConfig,
    currentUser,
    currentPage,
    rootClassName,
    currentUserHasListings,
    notificationCount,
    intl,
    isAuthenticated,
    onLogout,
    onSearchSubmit,
    initialSearchFormValues,
    history
  } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const authenticatedOnClientSide = mounted && isAuthenticated;
  const isAuthenticatedOrJustHydrated = isAuthenticated || !mounted;

  // Conditional rendering of the provider/customer UI elements
  const isProvider = currentUser ? !!currentUser.attributes.profile.metadata.isProvider : false

  const classes = classNames(rootClassName || css.root, className);

  const search = (
    <TopbarSearchForm
      className={css.searchLink}
      desktopInputRoot={css.topbarSearchWithLeftPadding}
      onSubmit={onSearchSubmit}
      initialValues={initialSearchFormValues}
      appConfig={appConfig}
    />
  );

  const notificationDot = notificationCount > 0 ? <div className={css.notificationDot} /> : null;

  const inboxLink = authenticatedOnClientSide ? (
    <NamedLink
      className={css.inboxLinkDesktop}
      name="InboxPage"
      params={{ tab: currentUserHasListings ? 'sales' : 'orders' }}
    >
      <span className={css.inboxDesktop}>
        <FormattedMessage id="TopbarDesktop.inbox" />
        {notificationDot}
      </span>
    </NamedLink>
  ) : null;

  // Change profileMenuIsOpen
  const langLink = (<Menu>

    <MenuLabel className={css.langageMenuLabelDesktop} isOpenClassName={css.langageMenuIsOpenDesktop}>
      <img className={css.langIconDesktop} src={LangIconPng} />
    </MenuLabel>

    <MenuContent className={css.langageMenuContentDesktop} >
      {/* CAUTION menuItemLangDesktop is an empty class */}
      <MenuItem key="ChangeLangage" className={css.menuItemLangDesktop}>
        <ExternalLink href={urlSwitchLang} className={css.langLinkDesktop}>
          {langageSwitch}
        </ExternalLink >
      </MenuItem>
    </MenuContent>
  </Menu>);


  const currentPageClass = page => {
    const isAccountSettingsPage =
      page === 'AccountSettingsPage' && ACCOUNT_SETTINGS_PAGES.includes(currentPage);
    return currentPage === page || isAccountSettingsPage ? css.currentPage : null;
  };

  const profileMenu = authenticatedOnClientSide ? (
    <Menu>
      <MenuLabel className={css.profileMenuLabel} isOpenClassName={css.profileMenuIsOpen}>
        <Avatar className={css.avatar} user={currentUser} disableProfileLink />
      </MenuLabel>
      <MenuContent className={css.profileMenuContent}>


        <MenuItem key="ManageListingsPage">
          {isProvider &&
            <NamedLink
              className={classNames(css.yourListingsLink, currentPageClass('ManageListingsPage'))}
              name="ManageListingsPage"
            >
              <span className={css.menuItemBorder} />
              <FormattedMessage id="TopbarDesktop.yourListingsLink" />
            </NamedLink>}
        </MenuItem>

        <MenuItem key="NewListingPage">
          {isProvider &&
            <NamedLink
              className={classNames(css.yourListingsLink, currentPageClass('NewListingPage'))}
              name="NewListingPage"
            >
              <span className={css.menuItemBorder} />
              <FormattedMessage id="TopbarDesktop.newListingLink" />
            </NamedLink>}
        </MenuItem>        

        <MenuItem key="ProfileSettingsPage">
          <NamedLink
            className={classNames(css.profileSettingsLink, currentPageClass('ProfileSettingsPage'))}
            name="ProfileSettingsPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.profileSettingsLink" />
          </NamedLink>
        </MenuItem>
        <MenuItem key="AccountSettingsPage">
          <NamedLink
            className={classNames(css.yourListingsLink, currentPageClass('AccountSettingsPage'))}
            name="AccountSettingsPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.accountSettingsLink" />
          </NamedLink>
        </MenuItem>
        <MenuItem key="logout">
          <InlineTextButton rootClassName={css.logoutButton} onClick={onLogout}>
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.logout" />
          </InlineTextButton>
        </MenuItem>
      </MenuContent>
    </Menu>
  ) : null;

  const signupLink = isAuthenticatedOrJustHydrated ? null : (
    <NamedLink name="SignupPage" className={css.signupLink}>
      <span className={css.signup}>
        <FormattedMessage id="TopbarDesktop.signup" />
      </span>
    </NamedLink>
  );

  const loginLink = isAuthenticatedOrJustHydrated ? null : (
    <NamedLink name="LoginPage" className={css.loginLink}>
      <span className={css.login}>
        <FormattedMessage id="TopbarDesktop.login" />
      </span>
    </NamedLink>
  );

  return (
    <nav className={classes}>

      <NamedLink className={css.logoLink} name="LandingPage">
        <Logo
          format="desktop"
          className={css.logo}
          alt={intl.formatMessage({ id: 'TopbarDesktop.logo' })}
        />
      </NamedLink>

      {search}

      {
        isProvider && <NamedLink className={css.manageListingsLink} name="ManageListingsPage">
          <span className={css.manageListings}>
            <FormattedMessage id="TopbarDesktop.manageListings" />
          </span>
        </NamedLink>
      }

      {inboxLink}

      <ShoppingCart
        intl={intl}
        history={history}
        currentUser={currentUser}
      />

      {langLink}

      {profileMenu}

      {signupLink}

      {loginLink}
    </nav>
  );
};

TopbarDesktop.defaultProps = {
  rootClassName: null,
  className: null,
  currentUser: null,
  currentPage: null,
  notificationCount: 0,
  initialSearchFormValues: {},
  appConfig: null,
};

TopbarDesktop.propTypes = {
  rootClassName: string,
  className: string,
  currentUserHasListings: bool.isRequired,
  currentUser: propTypes.currentUser,
  currentPage: string,
  isAuthenticated: bool.isRequired,
  onLogout: func.isRequired,
  notificationCount: number,
  onSearchSubmit: func.isRequired,
  initialSearchFormValues: object,
  intl: intlShape.isRequired,
  appConfig: object,
};

export default TopbarDesktop;
