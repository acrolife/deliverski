import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import config from '../../config';

import routeConfiguration from '../../routing/routeConfiguration';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { createResourceLocatorString } from '../../util/routes';
import { isScrollingDisabled } from '../../ducks/UI.duck';

import {
  Page,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
} from '../../components';
import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';

// import LocationSearchForm from './LocationSearchForm/LocationSearchForm';
// import TopbarSearchForm from './TopbarSearchForm/TopbarSearchForm';
// TODO if implement this serachbar, should reuse same component, not duplicate

import css from './NotFoundPage.module.css';
import LogoImage from '../../assets/logos/marmott-logo-sansfond.png';

import { NamedLink, NotFoundComponent } from '../../components';

export class NotFoundPageComponent extends Component {
  constructor(props) {
    super(props);
    // The StaticRouter component used in server side rendering
    // provides the context object. We attach a `notfound` flag to
    // the context to tell the server to change the response status
    // code into a 404.
    this.props.staticContext.notfound = true;
  }

  render() {
    const { history, intl, scrollingDisabled } = this.props;

    const title = intl.formatMessage({
      id: 'NotFoundPage.title',
    });

    const handleSearchSubmit = values => {
      const { search, selectedPlace } = values.location;
      const { origin, bounds } = selectedPlace;
      const searchParams = { address: search, origin, bounds };
      history.push(
        createResourceLocatorString('SearchPage', routeConfiguration(), {}, searchParams)
      );

    };

    // const initialSearchFormValues = []
    // const appConfig = config

    return (
      <Page title={title} scrollingDisabled={scrollingDisabled}>
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer />
          </LayoutWrapperTopbar>
          <LayoutWrapperMain>
            <NotFoundComponent />
          </LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </Page>
    );
  }
}

NotFoundPageComponent.defaultProps = {
  staticContext: {},
};

const { bool, func, object, shape } = PropTypes;

NotFoundPageComponent.propTypes = {
  scrollingDisabled: bool.isRequired,

  // context object from StaticRouter, injected by the withRouter wrapper
  staticContext: object,

  // from injectIntl
  intl: intlShape.isRequired,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,
};

const mapStateToProps = state => {
  return {
    scrollingDisabled: isScrollingDisabled(state),
  };
};

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const NotFoundPage = compose(
  withRouter,
  connect(mapStateToProps),
  injectIntl
)(NotFoundPageComponent);

export default NotFoundPage;
