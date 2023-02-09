import React from 'react';

import config from '../../config';
import { twitterPageURL } from '../../util/urlHelpers';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  ExternalLink,
} from '../../components';
import StaticPage from '../../containers/StaticPage/StaticPage';
import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';

import css from './AboutPage.module.css';
import image from './about-us-1056.jpg';

const AboutPage = () => {
  const { siteTwitterHandle, siteFacebookPage } = config;
  const siteTwitterPage = twitterPageURL(siteTwitterHandle);

  // prettier-ignore
  return (
    <StaticPage
      title="About Us"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'AboutPage',
        description: 'About Marmott',
        name: 'About page',
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className={css.staticPageWrapper}>
          <h1 className={css.pageTitle}>There's no such thing as too many restaurant choices.</h1>
          <img className={css.coverImage} src={image} alt="My first Marmott'." />

          <div className={css.contentWrapper}>
            <div className={css.contentSide}>
              <p>"We've built Marmott' because we didn't trust anonymous sellers online without recommendations."</p>
            </div>

            <div className={css.contentMain}>
              <h2>
                The world of food delivery couldn't be more exciting! Whether you are a casual buyer or an experienced collector, you can find the right pair on Marmott' and trust sellers that your new favorite item will be swiftly and safely sent to you or ready for pickup.
              </h2>

              <p>
                Ordering meals from restaurant can be stressful: you can find many online websites where to buy them but most don't deliver the trust you can legitimately expect. With Marmott', we want to make sure you're transaction will go smoothly: from browsing and checking the stock, to making the order and payment, to the review of the sellers. And we hope you'll be so convinced that you'll soon start selling your least favorite pairs to make new buyers happy!
              </p>

              <h3 className={css.subtitle}>Do you run a restaurant?</h3>

              <p>
                Marmott' offers you a good way to earn some extra cash!
              </p>

              <h3 id="contact" className={css.subtitle}>
                Create your own marketplace like Marmott'
              </h3>
              <p>
                Marmott' is brought to you by the good folks at{' '}
                <ExternalLink href="https://www.sharetribe.com">Sharetribe</ExternalLink>. Would you like
                to create your own marketplace platform a bit like Marmott'? Or perhaps a mobile
                app? With Sharetribe it's really easy. If you have a marketplace idea in mind, do
                get in touch!
              </p>
              <p>
                You can also checkout our{' '}
                <ExternalLink href={siteFacebookPage}>Facebook</ExternalLink> and{' '}
                <ExternalLink href={siteTwitterPage}>Twitter</ExternalLink>.
              </p>
            </div>
          </div>
        </LayoutWrapperMain>

        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </StaticPage>
  );
};

export default AboutPage;
