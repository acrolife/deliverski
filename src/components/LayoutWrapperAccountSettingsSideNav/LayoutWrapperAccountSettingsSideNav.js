/**
 * This is a wrapper component for different Layouts.
 * Navigational 'aside' content should be added to this wrapper.
 */
import React from 'react';
import { node, number, string, shape, bool } from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage } from '../../util/reactIntl';
import { withViewport } from '../../util/contextHelpers';
import { LayoutWrapperSideNav } from '../../components';

const MAX_HORIZONTAL_NAV_SCREEN_WIDTH = 1023;

const scrollToTab = currentTab => {
  const el = document.querySelector(`#${currentTab}Tab`);

  if (el) {
    el.scrollIntoView({
      block: 'end',
      inline: 'end',
      behavior: 'smooth',
    });
  }
};

const LayoutWrapperAccountSettingsSideNavComponent = props => {
  const { currentTab, viewport, isProvider } = props;

  let hasScrolledToTab = false;

  const { width } = viewport;
  const hasViewport = width > 0;
  const hasHorizontalTabLayout = hasViewport && width <= MAX_HORIZONTAL_NAV_SCREEN_WIDTH;
  const hasVerticalTabLayout = hasViewport && width > MAX_HORIZONTAL_NAV_SCREEN_WIDTH;
  const hasFontsLoaded = hasViewport && document.documentElement.classList.contains('fontsLoaded');

  // Check if scrollToTab call is needed (tab is not visible on mobile)
  if (hasVerticalTabLayout) {
    hasScrolledToTab = true;
  } else if (hasHorizontalTabLayout && !hasScrolledToTab && hasFontsLoaded) {
    scrollToTab(currentTab);
    hasScrolledToTab = true;
  }

  let tabs = [
    {
      text: <FormattedMessage id="LayoutWrapperAccountSettingsSideNav.contactDetailsTabTitle" />,
      selected: currentTab === 'ContactDetailsPage',
      id: 'ContactDetailsPageTab',
      linkProps: {
        name: 'ContactDetailsPage',
      },
    },
    {
      text: <FormattedMessage id="LayoutWrapperAccountSettingsSideNav.passwordTabTitle" />,
      selected: currentTab === 'PasswordChangePage',
      id: 'PasswordChangePageTab',
      linkProps: {
        name: 'PasswordChangePage',
      },
    },
    {
      text: <FormattedMessage id="LayoutWrapperAccountSettingsSideNav.paymentsTabTitle" />,
      selected: currentTab === 'StripePayoutPage',
      id: 'StripePayoutPageTab',
      linkProps: {
        name: 'StripePayoutPage',
      },
    },
    {
      text: <FormattedMessage id="LayoutWrapperAccountSettingsSideNav.paymentMethodsTabTitle" />,
      selected: currentTab === 'PaymentMethodsPage',
      id: 'PaymentMethodsPageTab',
      linkProps: {
        name: 'PaymentMethodsPage',
      },
    },
  ];

  if (!isProvider) {
    tabs = tabs.filter(e => e.id !== 'StripePayoutPageTab')
  }

  return <LayoutWrapperSideNav tabs={tabs} />;
};

LayoutWrapperAccountSettingsSideNavComponent.defaultProps = {
  className: null,
  rootClassName: null,
  children: null,
  currentTab: null,
  isProvider: null,
};

LayoutWrapperAccountSettingsSideNavComponent.propTypes = {
  children: node,
  className: string,
  rootClassName: string,
  currentTab: string,

  // from withViewport
  viewport: shape({
    width: number.isRequired,
    height: number.isRequired,
  }).isRequired,

  // from ContactDetailsPage
  isProvider: bool,
};

const LayoutWrapperAccountSettingsSideNav = compose(withViewport)(
  LayoutWrapperAccountSettingsSideNavComponent
);

export default LayoutWrapperAccountSettingsSideNav;
