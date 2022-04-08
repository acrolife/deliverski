import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NamedLink } from '../../components';

import css from './TabNav.module.css';

const Tab = props => {
  const { className, id, disabled, text, selected, linkProps } = props;
  const linkClasses = classNames(css.link, {
    [css.selectedLink]: selected,
    [css.disabled]: disabled,
  });

  return (
    <div id={id} className={className}>
      <NamedLink className={linkClasses} {...linkProps}>
        {text}
      </NamedLink>
    </div>
  );
};

Tab.defaultProps = { className: null, disabled: false, selected: false };

const { arrayOf, bool, node, object, string } = PropTypes;

Tab.propTypes = {
  id: string.isRequired,
  className: string,
  text: node.isRequired,
  disabled: bool,
  selected: bool,
  linkProps: object.isRequired,
};

const TabNav = props => {
  const { className, rootClassName, tabRootClassName, tabs, isProvider } = props;
  const classes = classNames(rootClassName || css.root, className);
  const tabClasses = tabRootClassName || css.tab;

  // Conditional rendering of the provider/customer UI elements, based on isProvider 
  let filteredTabs = tabs
  if (!isProvider && tabs) {
    filteredTabs = tabs.filter(e => e.linkProps.params.tab !== 'sales')
  }

  return (
    <nav className={classes}>
      {filteredTabs.map((tab, index) => {
        const id = typeof tab.id === 'string' ? tab.id : `${index}`;
        return <Tab key={id} id={id} className={tabClasses} {...tab} />;
      })}
    </nav>
  );
};

TabNav.defaultProps = {
  className: null,
  rootClassName: null,
  tabRootClassName: null,
  tabClassName: null,
};

TabNav.propTypes = {
  className: string,
  rootClassName: string,
  tabRootClassName: string,
  tabs: arrayOf(object).isRequired,
};

export default TabNav;
