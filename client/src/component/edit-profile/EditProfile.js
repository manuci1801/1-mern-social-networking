import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'

import TextAreaFieldGroup from '../common/TextAreaFieldGroup'
import InputGroup from '../common/InputGroup'
import SelectListGroup from '../common/SelectListGroup'
import TextFieldGroup from '../common/TextFieldGroup'

import { createProfile, getCurrentProfile } from '../../actions/profileActions'
import isEmpty from '../../validation/isEmpty'

class EditProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDisplaySocialInputs: false,
      handle: '',
      company: '',
      website: '',
      location: '',
      status: '',
      skills: '',
      githubUsername: '',
      bio: '',
      facebook: '',
      twitter: '',
      youtube: '',
      linkedin: '',
      instagram: '',
      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount(e) {
    this.props.getCurrentProfile()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }

    if (nextProps.profile) {
      const profile = nextProps.profile.profile

      // Join skill to a string
      profile.skillsCSV = profile.skills.join(',')
      // If profile field doesn't exists, make empty string
      profile.company = !isEmpty(profile.company) ? profile.company : ''
      profile.website = !isEmpty(profile.website) ? profile.website : ''
      profile.location = !isEmpty(profile.location) ? profile.location : ''
      profile.githubUsername = !isEmpty(profile.githubUsername) ? profile.githubUsername : ''
      profile.bio = !isEmpty(profile.bio) ? profile.bio : ''
      // Get social fields
      profile.social = !isEmpty(profile.social) ? profile.social : {}
      profile.facebook = !isEmpty(profile.social.facebook) ? profile.social.facebook : ''
      profile.youtube = !isEmpty(profile.social.youtube) ? profile.social.youtube : ''
      profile.twitter = !isEmpty(profile.social.twitter) ? profile.social.twitter : ''
      profile.linkedin = !isEmpty(profile.social.linkedin) ? profile.social.facebook : ''
      profile.instagram = !isEmpty(profile.social.instagram) ? profile.social.instagram : ''

      // Set component fields state
      this.setState({
        handle: profile.handle,
        company: profile.company,
        website: profile.website,
        location: profile.location,
        status: profile.status,
        skills: profile.skillsCSV,
        githubUsername: profile.githubUsername,
        bio: profile.bio,
        facebook: profile.facebook,
        twitter: profile.twitter,
        youtube: profile.youtube,
        linkedin: profile.linkedin,
        instagram: profile.instagram,
      })
    }
  }

  onSubmit(e) {
    e.preventDefault()

    const profileData = {
      handle: this.state.handle,
      company: this.state.company,
      website: this.state.website,
      location: this.state.location,
      status: this.state.status,
      skills: this.state.skills,
      githubUsername: this.state.githubUsername,
      bio: this.state.bio,
      facebook: this.state.facebook,
      twitter: this.state.twitter,
      youtube: this.state.youtube,
      linkedin: this.state.linkedin,
      instagram: this.state.instagram,
    }

    this.props.createProfile(profileData, this.props.history)
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const { errors, isDisplaySocialInputs } = this.state

    let socialsInput
    if (isDisplaySocialInputs) {
      socialsInput = (
        <div>
          <InputGroup
            placeholder='Facebook Profile URL'
            name='facebook'
            icon='fab fa-facebook'
            value={this.state.facebook}
            onChange={this.onChange}
            error={errors.facebook}
          />
          <InputGroup
            placeholder='Youtube Profile URL'
            name='youtube'
            icon='fab fa-youtube'
            value={this.state.youtube}
            onChange={this.onChange}
            error={errors.youtube}
          />
          <InputGroup
            placeholder='Twitter Profile URL'
            name='twitter'
            icon='fab fa-twitter'
            value={this.state.twitter}
            onChange={this.onChange}
            error={errors.twitter}
          />
          <InputGroup
            placeholder='Linkedin Profile URL'
            name='linkedin'
            icon='fab fa-linkedin'
            value={this.state.linkedin}
            onChange={this.onChange}
            error={errors.linkedin}
          />
          <InputGroup
            placeholder='Instagram Profile URL'
            name='instagram'
            icon='fab fa-instagram'
            value={this.state.instagram}
            onChange={this.onChange}
            error={errors.instagram}
          />
        </div>
      )
    }

    // Select options for status
    const options = [
      { label: '* Select Professional Status', value: 0 },
      { label: 'Developer', value: 'Developer' },
      { label: 'Junior Developer', value: 'Junior Developer' },
      { label: 'Senior Developer', value: 'Senior Developer' },
      { label: 'Manager', value: 'Manager' },
      { label: 'Student or Leanring', value: 'Student or Leanring' },
      { label: 'Instructor or Teacher', value: 'Instructor or Teacher' },
      { label: 'Intern', value: 'Intern' },
      { label: 'Other', value: 'Other' }
    ]

    return (
      <div className='create-profile'>
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to='/dashboard' className='btn btn-light'>
                Go Back
              </Link>
              <h1 className='display-4 text-center'>Edit Profile</h1>
              <p className='lead text-center'>
                Let's get some infomation to make your profile stand out
              </p>
              <small className='d-block pb-3'>* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder='* Profile Handle'
                  name='handle'
                  value={this.state.handle}
                  onChange={this.onChange}
                  error={errors.handle}
                  info='A unique handle for your profile URL. Your fullname, company name, nickname'
                />
                <SelectListGroup
                  placeholder='* Status'
                  name='status'
                  value={this.state.status}
                  onChange={this.onChange}
                  error={errors.status}
                  options={options}
                  info='Give us an idea of where you are at in your carrer'
                />
                <TextFieldGroup
                  placeholder='Company'
                  name='company'
                  value={this.state.company}
                  onChange={this.onChange}
                  error={errors.company}
                  info='Could be your own company or one you work for'
                />
                <TextFieldGroup
                  placeholder='Website'
                  name='website'
                  value={this.state.website}
                  onChange={this.onChange}
                  error={errors.website}
                  info='Could be your own website or a company one'
                />
                <TextFieldGroup
                  placeholder='Location'
                  name='location'
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                  info='City or city & state suggested (eg. New York, NY)'
                />
                <TextFieldGroup
                  placeholder='* Skills'
                  name='skills'
                  value={this.state.skills}
                  onChange={this.onChange}
                  error={errors.skills}
                  info='Please use comma seprarated values(eg. HTML,CSS,Javascript)'
                />
                <TextFieldGroup
                  placeholder='Github Username'
                  name='githubUsername'
                  value={this.state.githubUsername}
                  onChange={this.onChange}
                  error={errors.githubUsername}
                  info='If you want your latest repos and a Github link, include your username'
                />
                <TextAreaFieldGroup
                  placeholder='Short Bio'
                  name='bio'
                  value={this.state.bio}
                  onChange={this.onChange}
                  error={errors.bio}
                  info='Tell us a little about yourself'
                />

                <div className='mb-3'>
                  <button
                    type='button'
                    onClick={() => {
                      this.setState(preState => ({
                        isDisplaySocialInputs: !preState.isDisplaySocialInputs
                      }))
                    }}
                    className='btn btn-light' >
                    Add Social Network Links
                  </button>
                  <span className='text-muted'>Optional</span>
                </div>
                {socialsInput}
                <input type='submit' value='Submit' className='btn btn-info btn btn-block' />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
})

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(withRouter(EditProfile))
