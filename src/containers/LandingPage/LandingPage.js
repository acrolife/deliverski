import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { propTypes } from '../../util/types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import LogoImage from '../../assets/logos/marmott-logo-sansfond.png';

import config from '../../config';
import { injectIntl, intlShape } from '../../util/reactIntl';
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

import facebookImage from '../../assets/marmottFacebook-1200x630.jpg';
import twitterImage from '../../assets/marmottTwitter-600x314.jpg';

import SectionHero from './SectionHero/SectionHero';
import SectionHowItWorks from './SectionHowItWorks/SectionHowItWorks';
import SectionContactUs from './SectionContactUs/SectionContactUs';
import SectionFilteredSearches from './SectionFilteredSearches/SectionFilteredSearches';
import css from './LandingPage.module.css';

const LandingPageComponent = props => {
  const { history, intl, location, scrollingDisabled, currentUser } = props;

  const [userProviders, setUserProviders] = useState([]);
  //
  useEffect(() => {
    if (props.userProviders) {
      setUserProviders(props.userProviders);
    }
  }, [props.userProviders]);

  const isLoggedIn = !!currentUser;  

  // TODO this need to be properly recode in this file and 
  // src/containers/LandingPage/SectionFilteredSearches/SectionFilteredSearches.js
  // src/containers/LandingPage/SectionHero/SectionHero.js
  // isProduction = true was used to set a placeholder on the prod template, now we dont need it anylonger,
  // but the two other components use the var to conditonally render elements (need false as value)
  const isProduction = false;
  /*
  // Logic to hide the message sending to playground on production
  const canonicalRootURL = config.canonicalRootURL ? config.canonicalRootURL : null;
  // This means the elements conditioned on isProduction will not be shown on playground and sandbox
  // Without value for canonicalRootURL, isProduction will be true as well
  let isProduction = canonicalRootURL
    ? !(canonicalRootURL.includes('playground') || canonicalRootURL.includes('sandbox'))
    : true;

  isProduction = true;
  // DEV
  isProduction = false;
  // console.log("canonicalRootURL", canonicalRootURL)
  // console.log("incl playground", anonicalRootURL.includes('playground'))
  // console.log("incl sandbox", anonicalRootURL.includes('sandbox'))
  */
 

  /* Example
  // Thumbnail image for the search "card"
class ThumbnailImage extends Component {
  render() {
    const { alt, ...rest } = this.props;
    return <img alt={alt} {...rest} />;
  }
}
*/

  // Schema for search engines (helps them to understand what this page is about)
  // http://schema.org
  // We are using JSON-LD format
  const siteTitle = config.siteTitle;
  const schemaTitle = intl.formatMessage({ id: 'LandingPage.schemaTitle' }, { siteTitle });
  const schemaDescription = intl.formatMessage({ id: 'LandingPage.schemaDescription' });
  const schemaImage = `${config.canonicalRootURL}${facebookImage}`;

  return (
    <Page
      className={css.root}
      scrollingDisabled={scrollingDisabled}
      contentType="website"
      description={schemaDescription}
      title={schemaTitle}
      facebookImages={[{ url: facebookImage, width: 1200, height: 630 }]}
      twitterImages={[
        { url: `${config.canonicalRootURL}${twitterImage}`, width: 600, height: 314 },
      ]}
      schema={{
        '@context': 'http://schema.org',
        '@type': 'WebPage',
        description: schemaDescription,
        name: schemaTitle,
        image: [schemaImage],
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>
        <LayoutWrapperMain>
          <div className={css.heroContainer}>
            <SectionHero
              rootClassName={css.heroRoot}
              className={css.hero}
              history={history}
              location={location}
              isProduction={isProduction}
            />
          </div>

          {/* <div className={isProduction ? css.sectionContentFirstChildProd : css.sectionContentFirstChild}> */}
          <div className={css.sectionContentFirstChild}>
            <SectionFilteredSearches userProviders={userProviders} isProduction={isProduction} />
          </div>
          <div className={css.imgCenterParentLanding}>
            <img src={LogoImage} width="60%" />
          </div>

          <ul className={css.sections}>
            <li className={css.section}></li>
            <li className={css.section}>
              <div className={css.sectionContent} id={'how-it-works'}>
                <SectionHowItWorks isLoggedIn={isLoggedIn} />
              </div>
              <div className={css.sectionContent} id={'contact-us'}>
                <SectionContactUs isLoggedIn={isLoggedIn} />
              </div>
            </li>
          </ul>
        </LayoutWrapperMain>
        <LayoutWrapperFooter>
          <Footer currentUser={currentUser} />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </Page>
  );
};

LandingPageComponent.defaultProps = {
  currentUser: null,
  userProviders: null,
  showUserProvidersError: null,
};

const { bool, object, arrayOf } = PropTypes;

LandingPageComponent.propTypes = {
  scrollingDisabled: bool.isRequired,

  // from withRouter
  history: object.isRequired,
  location: object.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,

  // from fetchCurrentUser in ducks
  currentUser: propTypes.currentUser,

  // from userProvider
  userProviders: arrayOf(object.isRequired),
  showUserProvidersError: propTypes.error,
};

const mapStateToProps = state => {
  const { currentUser } = state.user;
  const { userProviders, showUserProvidersError } = state.LandingPage;

  if (showUserProvidersError) {
    console.log(`Error while pulling providers data: ${showUserProvidersError}`);
  }

  return {
    scrollingDisabled: isScrollingDisabled(state),
    currentUser,
    userProviders,
    showUserProvidersError,
  };
};

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const LandingPage = compose(withRouter, connect(mapStateToProps), injectIntl)(LandingPageComponent);

export default LandingPage;
