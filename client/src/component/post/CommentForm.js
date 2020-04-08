import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { addComment } from '../../actions/postActions'

import TextAreaFieldGroup from '../common/TextAreaFieldGroup'

class ComponentForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    this.setState({ errors: {} })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
  }

  onSubmit(e) {
    e.preventDefault()

    const { postID } = this.props

    const newComment = {
      text: this.state.text,
    }

    this.props.addComment(postID, newComment)
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
            Make a comment...
          </div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <TextAreaFieldGroup
                  placeholder="Reply to post"
                  name="text"
                  value={this.state.text}
                  onChange={this.onChange}
                  error={errors.text ? errors.text : null}
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

ComponentForm.propTypes = {
  errors: PropTypes.object.isRequired,
  postID: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  errors: state.errors
})

export default connect(mapStateToProps, { addComment })(ComponentForm)
