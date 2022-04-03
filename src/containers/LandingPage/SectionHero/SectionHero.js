import React, { Component, useState, useEffect } from 'react';
import { string } from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage } from '../../../util/reactIntl';
import { NamedLink } from '../../../components';

import css from './SectionHero.module.css';
// import css2 from '../../../styles/marketplaceDefaults.css'

// Building the hero images array
import hero01 from '../../../assets/hero-marmott-01.jpeg'
import hero02 from '../../../assets/hero-marmott-02.jpeg'
import hero03 from '../../../assets/hero-marmott-03.jpeg'
import hero04 from '../../../assets/hero-marmott-04.jpeg'
import hero07 from '../../../assets/hero-marmott-07.jpeg'
import hero08 from '../../../assets/hero-marmott-08.jpeg'
import hero09 from '../../../assets/hero-marmott-09.jpeg'
import hero10 from '../../../assets/hero-marmott-10.jpeg'
import hero11 from '../../../assets/hero-marmott-11.jpeg'
import hero12 from '../../../assets/hero-marmott-12.jpeg'
import hero13 from '../../../assets/hero-marmott-13.jpeg'
import hero14 from '../../../assets/hero-marmott-14.jpeg'
import hero15 from '../../../assets/hero-marmott-15.jpeg'
import hero16 from '../../../assets/hero-marmott-16.jpeg'
import { red } from '@mui/material/colors';

const heroImagesArray = [
  hero01,
  hero01,
  hero01,
  hero01,
  hero01,
  hero02,
  hero03,
  hero04,
  hero07,
  hero08,
  hero09,
  hero10,
  hero11,
  hero12,
  hero13,
  hero14,
  hero15,
  hero16
]

  // Apply a new hero (bg) image on refresh
  let heroCurrentImageRnd = heroImagesArray[Math.floor(Math.random() * heroImagesArray.length)]
  // const divStyle = {}
  const divStyle = {
    background: `linear-gradient(-45deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(${heroCurrentImageRnd})`,
    backgroundColor: '#4a4a4a',
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',      
  };

const SectionHero = props => {
  const { rootClassName, className } = props;
  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes} style={divStyle}>
      <div className={css.heroContent}>
        <h1 className={css.heroMainTitle}>
          <FormattedMessage id="SectionHero.title" />
        </h1>
        <h2 className={css.heroSubTitle}>
          <FormattedMessage id="SectionHero.subTitle" />
        </h2>
        <NamedLink name="SearchPage" className={css.heroButton}>
          <FormattedMessage id="SectionHero.browseButton" />
        </NamedLink>
      </div>
    </div>
  );
};

SectionHero.defaultProps = { rootClassName: null, className: null };

SectionHero.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionHero;
