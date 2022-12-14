import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { ensureCurrentUser } from '../../util/data';
import { isScrollingDisabled } from '../../ducks/UI.duck';

import {
  Page,
  UserNav,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  NamedLink,
} from '../../components';
import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';

import ProfileSettingsForm from './ProfileSettingsForm/ProfileSettingsForm';

import { updateProfile, uploadImage } from './ProfileSettingsPage.duck';
import css from './ProfileSettingsPage.module.css';
import { last } from 'lodash';

const onImageUploadHandler = (values, fn) => {
  const { id, imageId, file } = values;
  if (file) {
    fn({ id, imageId, file });
  }
};

export class ProfileSettingsPageComponent extends Component {
  render() {
    const {
      currentUser,
      image,
      onImageUpload,
      onUpdateProfile,
      scrollingDisabled,
      updateInProgress,
      updateProfileError,
      uploadImageError,
      uploadInProgress,
      intl,
    } = this.props;

    const handleSubmit = values => {
      const { firstName, lastName, bio: rawBio, restaurantName, schedule } = values;

      // Ensure that the optional bio is a string
      const bio = rawBio || '';

      let lastNameValidated;
      if (!lastName || lastName === ' ') {
        lastNameValidated = ' ';
      } else {
        lastNameValidated = lastName.trim();
      }

      // Add our restaurant name to the user public data
      publicData.restaurantName = restaurantName;
      publicData.schedule = schedule;

      const profile = {
        firstName: firstName.trim(),
        lastName: lastNameValidated,
        bio,
        publicData,
      };

      const uploadedImage = this.props.image;

      // Update profileImage only if file system has been accessed
      const updatedValues =
        uploadedImage && uploadedImage.imageId && uploadedImage.file
          ? { ...profile, profileImageId: uploadedImage.imageId }
          : profile;

      onUpdateProfile(updatedValues);
    };

    const user = ensureCurrentUser(currentUser);
    // Conditional rendering of the provider/customer UI elements
    const isProvider = currentUser ? !!currentUser.attributes.profile.metadata.isProvider : false;

    const { firstName, lastName, bio } = user.attributes.profile;
    const publicData = user.attributes.profile.publicData;
    const restaurantName = publicData ? publicData.restaurantName : null;
    const profileImageId = user.profileImage ? user.profileImage.id : null;
    const profileImage = image || { imageId: profileImageId };
    const weekdays = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ].map(d => {
      return { day: d };
    });

    const savedSchedule = currentUser?.attributes.profile.publicData.schedule;
    const basicSchedule = [
      {
        day: 'monday',
        startHour: '00',
        startMinute: '00',
        endHour: '23',
        endMinute: '00',
      },
      {
        day: 'tuesday',
        startHour: '00',
        startMinute: '00',
        endHour: '23',
        endMinute: '00',
      },
      {
        day: 'wednesday',
        startHour: '00',
        startMinute: '00',
        endHour: '23',
        endMinute: '00',
      },
      {
        day: 'thursday',
        startHour: '00',
        startMinute: '00',
        endHour: '23',
        endMinute: '00',
      },
      {
        day: 'friday',
        startHour: '00',
        startMinute: '00',
        endHour: '23',
        endMinute: '00',
      },
      {
        day: 'saturday',
        startHour: '00',
        startMinute: '00',
        endHour: '23',
        endMinute: '00',
      },
      {
        day: 'sunday',
        startHour: '00',
        startMinute: '00',
        endHour: '23',
        endMinute: '00',
      },
    ];
    const scheduleValue = savedSchedule ?? basicSchedule;
    const isOffline = !!user?.attributes?.profile.publicData?.onHoldByOwner;

    const profileSettingsForm = user.id ? (
      <ProfileSettingsForm
        className={css.form}
        currentUser={currentUser}
        initialValues={{
          firstName,
          lastName,
          bio,
          restaurantName,
          profileImage: user.profileImage,
          schedule: scheduleValue,
        }}
        profileImage={profileImage}
        onImageUpload={e => onImageUploadHandler(e, onImageUpload)}
        uploadInProgress={uploadInProgress}
        updateInProgress={updateInProgress}
        uploadImageError={uploadImageError}
        updateProfileError={updateProfileError}
        onSubmit={handleSubmit}
        basicSchedule={basicSchedule}
        isOffline={isOffline}
      />
    ) : null;

    const title = intl.formatMessage({ id: 'ProfileSettingsPage.title' });

    return (
      <Page className={css.root} title={title} scrollingDisabled={scrollingDisabled}>
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer currentPage="ProfileSettingsPage" />
            <UserNav selectedPageName="ProfileSettingsPage" isProvider={isProvider} />
          </LayoutWrapperTopbar>
          <LayoutWrapperMain>
            <div className={css.content}>
              <div className={css.headingContainer}>
                <h1 className={css.heading}>
                  <FormattedMessage id="ProfileSettingsPage.heading" />
                </h1>
                {isProvider && user.id ? (
                  <NamedLink
                    className={css.profileLink}
                    name="ProfilePage"
                    params={{ id: user.id.uuid }}
                  >
                    <FormattedMessage id="ProfileSettingsPage.viewProfileLink" />
                  </NamedLink>
                ) : null}
              </div>
              {profileSettingsForm}
            </div>
          </LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </Page>
    );
  }
}

ProfileSettingsPageComponent.defaultProps = {
  currentUser: null,
  uploadImageError: null,
  updateProfileError: null,
  image: null,
};

const { bool, func, object, shape, string } = PropTypes;

ProfileSettingsPageComponent.propTypes = {
  currentUser: propTypes.currentUser,
  image: shape({
    id: string,
    imageId: propTypes.uuid,
    file: object,
    uploadedImage: propTypes.image,
  }),
  onImageUpload: func.isRequired,
  onUpdateProfile: func.isRequired,
  scrollingDisabled: bool.isRequired,
  updateInProgress: bool.isRequired,
  updateProfileError: propTypes.error,
  uploadImageError: propTypes.error,
  uploadInProgress: bool.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const { currentUser } = state.user;
  const {
    image,
    uploadImageError,
    uploadInProgress,
    updateInProgress,
    updateProfileError,
  } = state.ProfileSettingsPage;
  return {
    currentUser,
    image,
    scrollingDisabled: isScrollingDisabled(state),
    updateInProgress,
    updateProfileError,
    uploadImageError,
    uploadInProgress,
  };
};

const mapDispatchToProps = dispatch => ({
  onImageUpload: data => dispatch(uploadImage(data)),
  onUpdateProfile: data => dispatch(updateProfile(data)),
});

const ProfileSettingsPage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(ProfileSettingsPageComponent);

export default ProfileSettingsPage;
