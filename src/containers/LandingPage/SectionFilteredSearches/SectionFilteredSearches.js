import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage } from '../../../util/reactIntl';
import { lazyLoadWithDimensions } from '../../../util/contextHelpers';

// import { NamedLink } from '../../../components';
import { NamedLink, Avatar } from '../../../components';

import css from './SectionFilteredSearches.module.css';

// Update images by saving images to src/LandingPage/SeactionFilteredSearches/images directory.
// If those images have been saved with the same name, no need to make changes to these imports.

// import imageForFilter1 from './images/imageForFilter1_648x448.jpg';
// import imageForFilter2 from './images/imageForFilter2_648x448.jpg';
// import imageForFilter3 from './images/imageForFilter3_648x448.jpg';
import placeHolderProfileBg from './images/placeHolderProfileBg_648x448.jpg';

// Thumbnail image for the search "card"
class ThumbnailImage extends Component {
  render() {
    const { alt, ...rest } = this.props;
    return <img alt={alt} {...rest} />;
  }
}
// Load the image only if it's close to viewport (user has scrolled the page enough).
const LazyImage = lazyLoadWithDimensions(ThumbnailImage);

// Create a "card" that contains a link to filtered search on SearchPage.
const FilterLink = props => {
  const { name, image, link } = props;
  const url = typeof window !== 'undefined' ? new window.URL(link) : new global.URL(link);
  const searchQuery = url.search;
  const nameText = <span className={css.searchName}>{name}</span>;
  return (
    <NamedLink name="SearchPage" to={{ search: searchQuery }} className={css.searchLink}>
      <div className={css.imageWrapper}>
        <div className={css.aspectWrapper}>
          <LazyImage src={image} alt={name} className={css.searchImage} />
        </div>
      </div>
      <div className={css.linkText}>
        <FormattedMessage
          id="SectionFilteredSearches.filteredSearch"
          values={{ filter: nameText }}
        />
      </div>
    </NamedLink>
  );
};

// Component that shows full-width section on LandingPage.
// Inside it shows 3 "cards" that link to SearchPage with specific filters applied.
const SectionFilteredSearches = props => {
  const { rootClassName, className, userProviders } = props;
  const classes = classNames(rootClassName || css.root, className);

  // const Test = () => {
  //   return (
  //     userProviders.length > 0 ? userProviders.map(e => <div key={e.id.uuid}>{e.attributes.profile.displayName.toLowerCase().replace(' ', '_')}</div>)
  //       : <div>'Pulling data...'</div>
  //   )
  // }

  const RestaurantTiles = () => {
    // DEV
    // let useProvider2 = JSON.parse('{"id":{"_sdkType":"UUID","uuid":"623332d1-3d73-4770-95cb-6b928cc5426f"},"type":"currentUser","attributes":{"deleted":false,"banned":false,"email":"funkmatch@gmail.com","stripeConnected":true,"stripePayoutsEnabled":false,"createdAt":"2022-03-17T13:08:33.713Z","stripeChargesEnabled":false,"identityProviders":[],"pendingEmail":null,"emailVerified":true,"profile":{"displayName":"Fox G","firstName":"Fox","privateData":{},"protectedData":{},"bio":null,"abbreviatedName":"FG","lastName":"Ginger","publicData":{"shoppingCart":[]},"metadata":{"freeShipping":true,"isProvider":true}}},"profileImage":{"id":{"_sdkType":"UUID","uuid":"623337bf-4fc9-4a78-83bb-2d3102cce914"},"type":"image","attributes":{"variants":{"square-small2x":{"height":480,"width":480,"url":"https://sharetribe.imgix.net/61c4d0a9-0776-4e68-a3eb-a5324ef5592f/623337bf-4fc9-4a78-83bb-2d3102cce914?auto=format&crop=edges&fit=crop&h=480&w=480&s=3fc839a2f0e88a5a51e55c4653ba2d86","name":"square-small2x"},"square-small":{"height":240,"width":240,"url":"https://sharetribe.imgix.net/61c4d0a9-0776-4e68-a3eb-a5324ef5592f/623337bf-4fc9-4a78-83bb-2d3102cce914?auto=format&crop=edges&fit=crop&h=240&w=240&s=2d031299d757eeb2e80b5f15854d572c","name":"square-small"},"square-xsmall":{"height":40,"width":40,"url":"https://sharetribe.imgix.net/61c4d0a9-0776-4e68-a3eb-a5324ef5592f/623337bf-4fc9-4a78-83bb-2d3102cce914?auto=format&crop=edges&fit=crop&h=40&w=40&s=359dc7fcf0a75058abcbc0f933a6c3f0","name":"square-xsmall"},"square-xsmall2x":{"height":80,"width":80,"url":"https://sharetribe.imgix.net/61c4d0a9-0776-4e68-a3eb-a5324ef5592f/623337bf-4fc9-4a78-83bb-2d3102cce914?auto=format&crop=edges&fit=crop&h=80&w=80&s=9edce97c0dfd57c28046a10b89b3b83a","name":"square-xsmall2x"}}}},"stripeAccount":{"id":{"_sdkType":"UUID","uuid":"623334ba-1b6a-4cf5-be47-cb805cefafbf"},"type":"stripeAccount","attributes":{"stripeAccountId":"acct_1KeJC3PZpzxQZ6Ex","stripeAccountData":null}}}')

    console.log(userProviders)

    return (
      userProviders.length > 0 ? [...userProviders ]
      // TODO DEV, here we put three times the array to see the result with more providers
      // userProviders.length > 0 ? [...userProviders, ...userProviders, ...userProviders.reverse() ]
      .map(e =>
        <FilterLink
        className={css.listingCard}
          key={e.id.uuid}
          name={e.attributes.profile.publicData.restaurantName}
          image={e.profileImage ? e.profileImage.attributes.variants['scaled-medium'].url : placeHolderProfileBg}
          link={`http://localhost:3000/s?pub_restaurant=${e.attributes.profile.publicData.restaurant}`}
        />
      )
        // : <div>'Pulling data...'</div>
        : <div></div>
    )
  }

{/*original image={imageForFilter1} */ }

{/* Not needed here, works with initials. We want it to work with the image. This strucutre works with useProvider2.
          <Avatar className={css.avatar} user={useProvider2} disableProfileLink />  */}

// FilterLink props:
// - "name" is a string that defines what kind of search the link is going to make
// - "image" is imported from images directory and you can update it by changing the file
// - "link" should be copy-pasted URL from search page.
//    The domain doesn't matter, but search query does. (I.e. "?pub_brand=nike")
return (
  <div className={classes}>
    <div className={css.title}>
      <FormattedMessage id="SectionFilteredSearches.title" />
    </div>
    {/* <div className={css.filteredSearches} > */}
    <div className={css.listingCards} >

      < RestaurantTiles />

      {/* className={css.box} */}
      {/* <FilterLink
          name="Full meal"
          image={imageForFilter1}
          link="http://localhost:3000/s?pub_size=full_meal"
        />,
        <FilterLink
          name="Sweets"
          image={imageForFilter2}
          link="http://localhost:3000/s?pub_category=sweets"
        />,
        <FilterLink
          name="Breakfast"
          image={imageForFilter3}
          link="http://localhost:3000/s?pub_size=breakfast"
        /> */}

    </div>
  </div>
  //   <div className={classes}>
  //   <div className={css.title}>
  //     <FormattedMessage id="SectionFilteredSearches.title" />
  //   </div>
  //   <div className={css.filteredSearches}>
  //     <FilterLink
  //       name="Asiatic"
  //       image={imageForFilter1}
  //       link="http://localhost:3000/s?pub_brand=asiatic"
  //     />
  //     <FilterLink
  //       name="Burger"
  //       image={imageForFilter2}
  //       link="http://localhost:3000/s?pub_brand=yeezy"
  //     />
  //     <FilterLink
  //       name="Sweets"
  //       image={imageForFilter3}
  //       link="http://localhost:3000/s?pub_brand=converse"
  //     />
  //   </div>
  // </div>
);
};

SectionFilteredSearches.defaultProps = { rootClassName: null, className: null, userProviders: [] };

const { object, arrayOf, string } = PropTypes;

SectionFilteredSearches.propTypes = {
  rootClassName: string,
  className: string,
  userProviders: arrayOf(object.isRequired),
};

export default SectionFilteredSearches;
