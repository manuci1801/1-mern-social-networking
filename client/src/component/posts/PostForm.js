import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { addPost } from '../../actions/postActions'

import TextAreaFieldGroup from '../common/TextAreaFieldGroup'

class PostForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
  }

  onSubmit(e) {
    e.preventDefault()

    const newPost = {
      text: this.state.text
    }

    this.props.addPost(newPost)
    this.setState({ text: '' })
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const { errors } = this.state

    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">
            Say Somthing...
                  </div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Create a post"
                  name="text"
                  value={this.state.text}
                  onChange={this.onChange}
                  error={errors.text}
                  info=''
                />
              </div>
              <button type="submit" className="btn btn-dark" onSubmit={this.onSubmit} >
                Submit
                      </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  errors: state.errors
})

export default connect(mapStateToProps, { addPost })(PostForm)
