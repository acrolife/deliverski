import React, { Component } from 'react';
import { bool, string } from 'prop-types';
import { compose } from 'redux';
import { Field, Form as FinalForm, FormSpy } from 'react-final-form';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import WeeklySchedulerForm from '../WeeklySchedulerForm/WeeklySchedulerForm';
import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import { ensureCurrentUser } from '../../../util/data';
import { propTypes } from '../../../util/types';
import * as validators from '../../../util/validators';
import arrayMutators from 'final-form-arrays';
import Switch from '@mui/material/Switch';
import { isUploadImageOverLimitError } from '../../../util/errors';
import DelayTimes from './DelayTimes';

import {
  Form,
  Avatar,
  Button,
  ImageFromFile,
  IconSpinner,
  FieldSelect,
  FieldTextInput,
  SecondaryButton,
  Modal,
  // LocationAutocompleteInputField,
} from '../../../components';

import { resorts } from '../../../util/importStaticAssets';
import css from './ProfileSettingsForm.module.css';

const ACCEPT_IMAGES = 'image/*';
const UPLOAD_CHANGE_DELAY = 2000; // Show spinner so that browser has time to load img srcset

const sharetribeSdk = require('sharetribe-flex-sdk');
const sdk = sharetribeSdk.createInstance({
  clientId: process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID,
});
class ProfileSettingsFormComponent extends Component {
  constructor(props) {
    super(props);

    this.uploadDelayTimeoutId = null;
    this.state = {
      uploadDelay: false,
      offline: this.props.isOffline,
      onHoldModalOpen: false,
    };
    this.submittedValues = {};
  }

  componentDidUpdate(prevProps) {
    // Upload delay is additional time window where Avatar is added to the DOM,
    // but not yet visible (time to load image URL from srcset)
    if (prevProps.uploadInProgress && !this.props.uploadInProgress) {
      this.setState({ uploadDelay: true });
      this.uploadDelayTimeoutId = window.setTimeout(() => {
        this.setState({ uploadDelay: false });
      }, UPLOAD_CHANGE_DELAY);
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.uploadDelayTimeoutId);
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        mutators={{
          ...arrayMutators,
          fillSchedule: (args, state, utils) => {
            const formValues = args[0];
            const mondaySchedule = formValues.schedule.find(s => {
              return s.day === 'monday';
            });
            utils.changeValue(state, 'schedule', () => {
              return formValues.schedule.map(i => {
                i.endHour = mondaySchedule.endHour;
                i.endMinute = mondaySchedule.endMinute;
                i.startHour = mondaySchedule.startHour;
                i.startMinute = mondaySchedule.startMinute;

                return i;
              });
            });
          },
        }}
        render={fieldRenderProps => {
          const {
            className,
            currentUser,
            handleSubmit,
            intl,
            invalid,
            onImageUpload,
            pristine,
            profileImage,
            rootClassName,
            updateInProgress,
            updateProfileError,
            uploadImageError,
            uploadInProgress,
            form,
            values,
          } = fieldRenderProps;

          const t = intl.formatMessage;

          const user = ensureCurrentUser(currentUser);
          // Conditional rendering of the provider/customer UI elements
          const isProvider = currentUser
            ? !!currentUser.attributes.profile.metadata.isProvider
            : false;

          // First name
          const firstNameLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.firstNameLabel',
          });
          const firstNamePlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.firstNamePlaceholder',
          });
          const firstNameRequiredMessage = intl.formatMessage({
            id: 'ProfileSettingsForm.firstNameRequired',
          });
          const firstNameRequired = validators.required(firstNameRequiredMessage);

          // Last name
          const lastNameLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.lastNameLabel',
          });
          const lastNamePlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.lastNamePlaceholder',
          });
          // const lastNameRequiredMessage = intl.formatMessage({
          //   id: 'ProfileSettingsForm.lastNameRequired',
          // });
          // const lastNameRequired = validators.required(lastNameRequiredMessage);

          // Restaurant's name
          const restaurantLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.restaurantLabel',
          });
          const restaurantPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.restaurantPlaceholder',
          });
          const restaurantRequiredMessage = intl.formatMessage({
            id: 'ProfileSettingsForm.restaurantRequired',
          });
          const restaurantRequired = validators.required(restaurantRequiredMessage);

          // Restaurant's resort
          const resortLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.resortLabel',
          });
          const resortPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.resortPlaceholder',
          });
          const resortRequiredMessage = intl.formatMessage({
            id: 'ProfileSettingsForm.resortRequired',
          });
          const resortRequired = validators.required(resortRequiredMessage);
          const listOfEnabledResortNames = resorts.length
            ? resorts.map(o => o.name)
            : ['Resort name list error.'];
          const listOfEnabledresorts = resorts.length ? resorts.map(o => o.key) : [null];
          const resortNameOptions = listOfEnabledResortNames;

          // Pickup address
          const pickupAddressLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.pickupAddressLabel',
          });
          const pickupAddressPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.pickupAddressPlaceholder',
          });
          const pickupAddressRequiredMessage = intl.formatMessage({
            id: 'ProfileSettingsForm.pickupAddressRequired',
          });
          const pickupAddressRequired = validators.required(pickupAddressRequiredMessage);

          // Bio
          const bioLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.bioLabel',
          });
          const bioPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.bioPlaceholder',
          });

          const uploadingOverlay =
            uploadInProgress || this.state.uploadDelay ? (
              <div className={css.uploadingImageOverlay}>
                <IconSpinner />
              </div>
            ) : null;

          const hasUploadError = !!uploadImageError && !uploadInProgress;
          const errorClasses = classNames({ [css.avatarUploadError]: hasUploadError });
          const transientUserProfileImage = profileImage.uploadedImage || user.profileImage;
          const transientUser = { ...user, profileImage: transientUserProfileImage };

          // Ensure that file exists if imageFromFile is used
          const fileExists = !!profileImage.file;
          const fileUploadInProgress = uploadInProgress && fileExists;
          const delayAfterUpload = profileImage.imageId && this.state.uploadDelay;
          const imageFromFile =
            fileExists && (fileUploadInProgress || delayAfterUpload) ? (
              <ImageFromFile
                id={profileImage.id}
                className={errorClasses}
                rootClassName={css.uploadingImage}
                aspectRatioClassName={css.squareAspectRatio}
                file={profileImage.file}
              >
                {uploadingOverlay}
              </ImageFromFile>
            ) : null;

          // Avatar is rendered in hidden during the upload delay
          // Upload delay smoothes image change process:
          // responsive img has time to load srcset stuff before it is shown to user.
          const avatarClasses = classNames(errorClasses, css.avatar, {
            [css.avatarInvisible]: this.state.uploadDelay,
          });
          const avatarComponent =
            !fileUploadInProgress && profileImage.imageId ? (
              <Avatar
                className={avatarClasses}
                renderSizes="(max-width: 767px) 96px, 240px"
                user={transientUser}
                disableProfileLink
              />
            ) : null;

          const chooseAvatarLabel =
            profileImage.imageId || fileUploadInProgress ? (
              <div className={css.avatarContainer}>
                {imageFromFile}
                {avatarComponent}
                <div className={css.changeAvatar}>
                  <FormattedMessage id="ProfileSettingsForm.changeAvatar" />
                </div>
              </div>
            ) : (
              <div className={css.avatarPlaceholder}>
                <div className={css.avatarPlaceholderText}>
                  <FormattedMessage id="ProfileSettingsForm.addYourProfilePicture" />
                </div>
                <div className={css.avatarPlaceholderTextMobile}>
                  <FormattedMessage id="ProfileSettingsForm.addYourProfilePictureMobile" />
                </div>
              </div>
            );

          const submitError = updateProfileError ? (
            <div className={css.error}>
              <FormattedMessage id="ProfileSettingsForm.updateProfileFailed" />
            </div>
          ) : null;

          const classes = classNames(rootClassName || css.root, className);
          const submitInProgress = updateInProgress;
          const submittedOnce = Object.keys(this.submittedValues).length > 0;
          const pristineSinceLastSubmit = submittedOnce && isEqual(values, this.submittedValues);

          // eslint-disable-next-line no-unused-vars
          const submitDisabled =
            invalid || pristine || pristineSinceLastSubmit || uploadInProgress || submitInProgress;

          const onChangeSpy = formValues => {
            // console.log(formValues.values)
          };

          const handleOfflineSwitch = event => {
            if (this.props.isOffline) {
              return sdk.currentUser
                .updateProfile({
                  publicData: {
                    onHoldByOwner: !this.props.isOffline,
                  },
                })
                .then(res => {
                  if (typeof window !== 'undefined') {
                    window.location.reload();
                  }
                });
            } else {
              this.setState({
                onHoldModalOpen: true,
              });
            }

            // this.setState({
            //   offline: event.target.checked
            // })
          };

          const setOnlineOffline = () => {
            return sdk.currentUser
              .updateProfile({
                publicData: {
                  onHoldByOwner: !this.props.isOffline,
                },
              })
              .then(res => {
                if (typeof window !== 'undefined') {
                  window.location.reload();
                }
              });
          };

          const setOnHoldModalOpen = value => {
            this.setState({
              onHoldModalOpen: value,
            });
          };

          return (
            <Form
              className={classes}
              onSubmit={e => {
                this.submittedValues = values;
                handleSubmit(e);
              }}
            >
              <FormSpy onChange={onChangeSpy} />

              <div className={css.sectionContainer}>
                <h3 className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsForm.yourProfilePicture" />
                </h3>
                <Field
                  accept={ACCEPT_IMAGES}
                  id="profileImage"
                  name="profileImage"
                  label={chooseAvatarLabel}
                  type="file"
                  form={null}
                  uploadImageError={uploadImageError}
                  disabled={uploadInProgress}
                >
                  {fieldProps => {
                    const { accept, id, input, label, disabled, uploadImageError } = fieldProps;
                    const { name, type } = input;
                    const onChange = e => {
                      const file = e.target.files[0];
                      form.change(`profileImage`, file);
                      form.blur(`profileImage`);
                      if (file != null) {
                        const tempId = `${file.name}_${Date.now()}`;
                        onImageUpload({ id: tempId, file });
                      }
                    };

                    let error = null;

                    if (isUploadImageOverLimitError(uploadImageError)) {
                      error = (
                        <div className={css.error}>
                          <FormattedMessage id="ProfileSettingsForm.imageUploadFailedFileTooLarge" />
                        </div>
                      );
                    } else if (uploadImageError) {
                      error = (
                        <div className={css.error}>
                          <FormattedMessage id="ProfileSettingsForm.imageUploadFailed" />
                        </div>
                      );
                    }

                    return (
                      <div className={css.uploadAvatarWrapper}>
                        <label className={css.label} htmlFor={id}>
                          {label}
                        </label>
                        <input
                          accept={accept}
                          id={id}
                          name={name}
                          className={css.uploadAvatarInput}
                          disabled={disabled}
                          onChange={onChange}
                          type={type}
                        />
                        {error}
                      </div>
                    );
                  }}
                </Field>
                {isProvider && (
                  <div className={css.tip}>
                    <FormattedMessage id="ProfileSettingsForm.tip" />
                  </div>
                )}
                <div className={css.fileInfo}>
                  <FormattedMessage id="ProfileSettingsForm.fileInfo" />
                </div>
              </div>
              <div className={css.sectionContainer}>
                <h3 className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsForm.yourName" />
                </h3>
                <div className={css.nameContainer}>
                  <FieldTextInput
                    className={css.firstName}
                    type="text"
                    id="firstName"
                    name="firstName"
                    label={firstNameLabel}
                    placeholder={firstNamePlaceholder}
                    validate={firstNameRequired}
                  />
                  <FieldTextInput
                    className={css.lastName}
                    type="text"
                    id="lastName"
                    name="lastName"
                    label={lastNameLabel}
                    placeholder={lastNamePlaceholder}
                  />
                </div>
                {/* validate={lastNameRequired} */}
              </div>

              {isProvider && (
                <div className={classNames(css.sectionContainer)}>
                  <h3 className={css.sectionTitle}>
                    <FormattedMessage id="ProfileSettingsForm.restaurantHeading" />
                  </h3>
                  <FieldTextInput
                    type="text"
                    id="restaurantName"
                    name="restaurantName"
                    label={restaurantLabel}
                    placeholder={restaurantPlaceholder}
                    validate={restaurantRequired}
                  />
                  <p className={css.bioInfo}>
                    <FormattedMessage id="ProfileSettingsForm.restaurantInfo" />
                  </p>
                  <FieldTextInput
                    className={css.restaurantAddressPlainText}
                    type="text"
                    id="restaurantAddressPlainText"
                    name="restaurantAddressPlainText"
                    label={t({ id: 'ProfileSettingsForm.restaurantAddressLabel' })}
                    placeholder={t({ id: 'ProfileSettingsForm.restaurantAddressPlaceholder' })}
                  />
                  {/*
                  <LocationAutocompleteInputField
                    className={css.restaurantAddress}
                    inputClassName={css.locationAutocompleteInput}
                    iconClassName={css.locationAutocompleteInputIcon}
                    predictionsClassName={css.predictionsRoot}
                    validClassName={css.validLocation}
                    name="restaurantAddress"
                    label={t({ id: 'ProfileSettingsForm.restaurantAddressLabel' })}
                    placeholder={t({ id: 'ProfileSettingsForm.restaurantAddressPlaceholder' })}
                    useDefaultPredictions={false}
                    valueFromForm={values.restaurantAddress}
                    validate={validators.autocompletePlaceSelected(
                      t({ id: 'ProfileSettingsForm.addressNotRecognized' })
                    )}
                  />
                  */}
                  <p className={css.bioInfo}>
                    <FormattedMessage id="ProfileSettingsForm.restaurantAddressInfo" />
                  </p>
                </div>
              )}

              {isProvider && (
                <div className={classNames(css.sectionContainer)}>
                  <h3 className={css.sectionTitle}>
                    <FormattedMessage id="ProfileSettingsForm.resortHeading" />
                  </h3>
                  <FieldSelect
                    className={css.selectField}
                    id="resort"
                    name="resort"
                    label={resortLabel}
                    validate={resortRequired}
                    // defaultValue={resortPlaceholder}
                  >
                    <option value="" key={resortPlaceholder} disabled>
                      {resortPlaceholder}
                    </option>
                    {resortNameOptions.map((o, i) => (
                      <option value={listOfEnabledresorts[i]} key={o}>
                        {o}
                      </option>
                    ))}
                  </FieldSelect>
                  <p className={css.bioInfo}>
                    <FormattedMessage id="ProfileSettingsForm.resortInfo" />
                  </p>
                </div>
              )}

              {isProvider && (
                <div className={classNames(css.sectionContainer, css.lastSection)}>
                  <h3 className={css.sectionTitle}>
                    <FormattedMessage id="ProfileSettingsForm.bioHeading" />
                  </h3>
                  <FieldTextInput
                    type="textarea"
                    id="bio"
                    name="bio"
                    label={bioLabel}
                    placeholder={bioPlaceholder}
                  />
                  <p className={css.bioInfo}>
                    <FormattedMessage id="ProfileSettingsForm.bioInfo" />
                  </p>
                </div>
              )}

              {isProvider && (
                <div className={classNames(css.sectionContainer)}>
                  <h3 className={css.sectionTitle}>
                    <FormattedMessage id="ProfileSettingsForm.scheduleTitle" />
                  </h3>
                  <div className={css.buttonWrapper}>
                    <p className={css.bioInfo}>
                      <FormattedMessage id="ProfileSettingsForm.copyMondaySchedule" />
                    </p>

                    <SecondaryButton
                      className={css.fillDaysButton}
                      type="button"
                      onClick={() => {
                        form.mutators.fillSchedule(values);
                      }}
                    >
                      <FormattedMessage id="ProfileSettingsForm.fillAllDays" />
                    </SecondaryButton>
                  </div>

                  <WeeklySchedulerForm />
                </div>
              )}

              {isProvider && (
                <div className={css.sectionContainer}>
                  <h3 className={css.sectionTitle}>
                    <FormattedMessage id="ProfileSettingsForm.onHoldTitle" />
                    <br />

                    {this.props.isOffline ? (
                      <p className={css.onHoldStatus}>
                        <FormattedMessage id="ProfileSettingsForm.restaurantOnHold" />
                      </p>
                    ) : (
                      <p className={css.onlineStatus}>
                        <FormattedMessage id="ProfileSettingsForm.restaurantOnline" />
                      </p>
                    )}
                  </h3>

                  <p className={css.bioInfo}>
                    <FormattedMessage id="ProfileSettingsForm.warningSwitch" />
                  </p>

                  <div className={css.switchWrapper}>
                    {this.props.isOffline ? (
                      <FormattedMessage id="ProfileSettingsForm.setOnline" />
                    ) : (
                      <FormattedMessage id="ProfileSettingsForm.setOnHold" />
                    )}

                    <Switch checked={this.state.offline} onChange={handleOfflineSwitch} />
                  </div>
                </div>
              )}

              {isProvider && (
                <Modal
                  id="on_hold_modal"
                  isOpen={this.state.onHoldModalOpen}
                  onClose={() => {
                    setOnHoldModalOpen(false);
                  }}
                  onManageDisableScrolling={() => {}}
                >
                  <center>
                    <h2>
                      <p className={css.infoText}>
                        <FormattedMessage id="ProfileSettingsForm.confirm" />
                      </p>

                      <br />
                      <FormattedMessage id="ProfileSettingsForm.businessOffline" />
                    </h2>
                  </center>

                  <div className={css.modalButtonsWrapper}>
                    <SecondaryButton
                      type="button"
                      className={css.modalButton1}
                      onClick={setOnlineOffline}
                    >
                      <FormattedMessage id="ProfileSettingsForm.setOnHoldShort" />
                    </SecondaryButton>
                    <br />

                    <SecondaryButton
                      type="button"
                      className={css.modalButton2}
                      onClick={() => setOnHoldModalOpen(false)}
                    >
                      <FormattedMessage id="ProfileSettingsForm.goBack" />
                    </SecondaryButton>
                  </div>
                </Modal>
              )}

              {isProvider && <DelayTimes intl={intl} css={css} />}

              {isProvider && (
                <div className={classNames(css.sectionContainer, css.lastSection)}>
                  <h3 className={css.sectionTitle}>
                    <FormattedMessage id="ProfileSettingsForm.pickupAddressHeading" />
                  </h3>
                  <div className={css.sectionContainer}>
                    <FieldTextInput
                      type="text"
                      id="pickupAddress"
                      name="pickupAddress"
                      label={pickupAddressLabel}
                      placeholder={pickupAddressPlaceholder}
                      validate={pickupAddressRequired}
                    />
                  </div>
                  <p className={css.bioInfo}>
                    <FormattedMessage id="ProfileSettingsForm.pickupAddressInfo" />
                  </p>
                </div>
              )}

              {submitError}
              <Button
                className={css.submitButton}
                type="submit"
                inProgress={submitInProgress}
                disabled={submitDisabled}
                ready={pristineSinceLastSubmit}
              >
                <FormattedMessage id="ProfileSettingsForm.saveChanges" />
              </Button>
            </Form>
          );
        }}
      />
    );
  }
}

ProfileSettingsFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  uploadImageError: null,
  updateProfileError: null,
  updateProfileReady: false,
};

ProfileSettingsFormComponent.propTypes = {
  rootClassName: string,
  className: string,

  uploadImageError: propTypes.error,
  uploadInProgress: bool.isRequired,
  updateInProgress: bool.isRequired,
  updateProfileError: propTypes.error,
  updateProfileReady: bool,

  // from injectIntl
  intl: intlShape.isRequired,
};

const ProfileSettingsForm = compose(injectIntl)(ProfileSettingsFormComponent);

ProfileSettingsForm.displayName = 'ProfileSettingsForm';

export default ProfileSettingsForm;
